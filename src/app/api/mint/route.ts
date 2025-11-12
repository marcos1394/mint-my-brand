// --- ¡CORRECCIÓN DE ARQUITECTURA! ---
// Importamos el cliente JS PÚBLICO estándar, no el de "servidor"
import { createClient } from '@supabase/supabase-js' 
import { NextResponse } from 'next/server'
// 'cookies' ya no es necesario aquí, porque esta ruta es pública
// import { cookies } from 'next/headers' 
import {
  createWalletClient,
  createPublicClient,
  http,
  type Hex
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'
import MintMyBrandABI from '@/lib/MintMyBrandABI.json' // El ABI del NFT, no de la Fábrica

// --- ¡CORRECCIÓN DE ARQUITECTURA! ---
// Creamos un cliente público y sin estado (stateless)
// Es seguro porque nuestra política RLS protege la escritura.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * API PÚBLICA para "Mintear" (Acuñar) un NFT
 * Esta API es llamada por el cliente final en la página de reclamo.
 */
export async function POST(request: Request) {
  
  // --- 1. LEER Y VALIDAR LA ENTRADA ---
  const { userAddress, collectionId } = await request.json()

  // Validación de seguridad simple
  if (!userAddress || !userAddress.startsWith('0x') || userAddress.length !== 42) {
    return NextResponse.json({ error: 'Dirección de wallet no válida.' }, { status: 400 })
  }
  if (!collectionId) {
    return NextResponse.json({ error: 'Falta el ID de la colección.' }, { status: 400 })
  }

  console.log(`[API MINT] Solicitud para mintear a: ${userAddress} en Colección: ${collectionId}`)

  // --- 2. BUSCAR LA COLECCIÓN Y OBTENER SU DIRECCIÓN ---
  // ¡Esto usa el cliente público, lo cual es correcto!
  const { data: collection, error: collectionError } = await supabase
    .from('collections')
    .select('contract_address') // ¡Solo necesitamos la dirección del contrato!
    .eq('id', collectionId)
    .single()

  // Verificamos si la colección existe y si ya fue desplegada
  if (collectionError || !collection || !collection.contract_address) {
    return NextResponse.json({ error: 'Colección no encontrada o no desplegada.' }, { status: 404 })
  }
  
  const contractAddress = collection.contract_address as Hex

  // --- 3. CARGAR NUESTRA "SERVER WALLET" (EL PAGADOR) ---
  const privateKey = process.env.SERVER_WALLET_PRIVATE_KEY as Hex
  if (!privateKey) {
    console.error('SERVER_WALLET_PRIVATE_KEY no está configurada')
    return NextResponse.json({ error: 'Error del servidor: El pagador no está configurado.' }, { status: 500 })
  }
  const serverAccount = privateKeyToAccount(privateKey)
  
  // --- 4. PREPARAR LA CONEXIÓN (Viem) ---
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
    // --- 5. ¡NUEVA LÓGICA! VERIFICAR SI YA TIENE UN NFT ---
    console.log(`[API MINT] Verificando balance de ${userAddress} en ${contractAddress}...`)

    // Usamos el 'publicClient' para LEER datos de la blockchain
    const balance = (await publicClient.readContract({
      address: contractAddress,
      abi: MintMyBrandABI.abi,
      functionName: 'balanceOf', // Función estándar de ERC-721
      args: [userAddress as Hex] // El usuario que queremos chequear
    })) as bigint // Forzamos el tipo a 'bigint'

    console.log(`[API MINT] Balance del usuario: ${balance}`)

    // Si el balance es mayor que 0, ¡el usuario ya tiene uno!
    if (balance > 0) {
      console.log(`[API MINT] Rechazado: El usuario ya tiene un NFT.`)
      return NextResponse.json({ error: 'Ya posees un NFT de esta colección.' }, { status: 400 })
    }
    // --- FIN DE LA NUEVA LÓGICA ---


    // --- 6. SIMULAR LA TRANSACCIÓN ---
    console.log(`[API MINT] Simulando 'safeMint' en el contrato: ${contractAddress}`)
    
    const { request: mintRequest } = await publicClient.simulateContract({
      account: serverAccount,
      address: contractAddress,
      abi: MintMyBrandABI.abi,
      functionName: 'safeMint',
      args: [userAddress as Hex],
    })

    // --- 7. EJECUTAR LA TRANSACCIÓN REAL ---
    console.log('[API MINT] Simulación exitosa. Enviando transacción...')
    const transactionHash = await walletClient.writeContract(mintRequest)
    console.log(`[API MINT] ¡Éxito! Transacción enviada: ${transactionHash}`)

    // --- 8. ENVIAR RESPUESTA AL FRONTEND ---
    // (En un producto v2, esperaríamos la confirmación,
    // pero para un MVP, devolver el hash es suficiente para la UX)
    return NextResponse.json({
      success: true,
      transactionHash: transactionHash,
    })

  } catch (error: any) {
    console.error('[API MINT] Error al mintear:', error)
    return NextResponse.json({ error: `Error al mintear: ${error.message}` }, { status: 500 })
  }
}