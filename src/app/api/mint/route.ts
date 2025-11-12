import { createClient } from '@/lib/supabase/server' // ¡Cliente de Servidor!
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  createWalletClient,
  createPublicClient,
  http,
  type Hex
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'

// ¡YA NO USAMOS el ABI de la Fábrica, usamos el ABI del NFT!
import MintMyBrandABI from '@/lib/MintMyBrandABI.json' 

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // --- 1. LEER Y VALIDAR LA ENTRADA (¡CAMBIO!) ---
  const body = await request.json()
  // ¡Ahora también leemos el collectionId que nos envía el frontend!
  const { userAddress, collectionId } = body

  // Validación de seguridad
  if (!userAddress || !userAddress.startsWith('0x') || userAddress.length !== 42) {
    return NextResponse.json({ error: 'Dirección de wallet no válida.' }, { status: 400 })
  }
  if (!collectionId) {
    return NextResponse.json({ error: 'Falta el ID de la colección.' }, { status: 400 })
  }

  console.log(`[API MINT] Solicitud para mintear a: ${userAddress} en Colección: ${collectionId}`)

  // --- 2. BUSCAR LA COLECCIÓN Y OBTENER SU DIRECCIÓN (¡NUEVO!) ---
  const { data: collection, error: collectionError } = await supabase
    .from('collections')
    .select('contract_address') // ¡Solo necesitamos la dirección del contrato!
    .eq('id', collectionId)
    .single()

  if (collectionError || !collection) {
    return NextResponse.json({ error: 'Colección no encontrada.' }, { status: 404 })
  }

  if (!collection.contract_address) {
    // ¡Seguridad! No se puede mintear si el dueño no ha presionado "Desplegar"
    return NextResponse.json({ error: 'Esta colección no ha sido desplegada en la blockchain.' }, { status: 400 })
  }

  const contractAddress = collection.contract_address as Hex

  // --- 3. CARGAR NUESTRA "SERVER WALLET" (Sin cambios) ---
  const privateKey = process.env.SERVER_WALLET_PRIVATE_KEY
  if (!privateKey) {
    console.error('SERVER_WALLET_PRIVATE_KEY no está configurada')
    return NextResponse.json({ error: 'Error del servidor: El pagador no está configurado.' }, { status: 500 })
  }
  const serverAccount = privateKeyToAccount(privateKey as Hex)

  // --- 4. PREPARAR LA CONEXIÓN (¡CAMBIO!) ---
  // Ya no nos conectamos a la "Fábrica", nos conectamos al
  // 'contractAddress' específico de esta colección.

  const rpcUrl = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL!

  const walletClient = createWalletClient({
    account: serverAccount,
    chain: baseSepolia,
    transport: http(rpcUrl)
  })

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(rpcUrl)
  })

  try {
    // --- 5. SIMULAR LA TRANSACCIÓN (¡CAMBIO!) ---
    // Ahora llamamos a 'safeMint' en el 'contractAddress' de la colección
    console.log(`[API MINT] Simulando 'safeMint' en el contrato: ${contractAddress}`)

    const { request: mintRequest } = await publicClient.simulateContract({
      account: serverAccount,
      address: contractAddress, // ¡Usamos la dirección de la colección!
      abi: MintMyBrandABI.abi,  // ¡Usamos el ABI del NFT!
      functionName: 'safeMint',
      args: [userAddress as Hex], // El destinatario
    })

    console.log('[API MINT] Simulación exitosa. Enviando transacción...')

    // --- 6. EJECUTAR LA TRANSACCIÓN REAL (Sin cambios) ---
    const transactionHash = await walletClient.writeContract(mintRequest)

    console.log(`[API MINT] ¡Éxito! Transacción enviada: ${transactionHash}`)

    // (En un producto v2, esperaríamos la confirmación,
    // pero para un MVP, devolver el hash es suficiente para la UX)

    // --- 7. ENVIAR RESPUESTA AL FRONTEND ---
    return NextResponse.json({
      success: true,
      transactionHash: transactionHash,
    })

  } catch (error: any) {
    console.error('[API MINT] Error al mintear:', error)
    return NextResponse.json({ error: `Error al mintear: ${error.message}` }, { status: 500 })
  }
}