import { NextResponse } from 'next/server'
import {
  createWalletClient,
  createPublicClient,
  http,
  type Hex
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'
import MintMyBrandABI from '@/lib/MintMyBrandABI.json' // ¡Importamos el "manual" del contrato!

/**
 * Esta es nuestra API de "Minting".
 * Recibe la dirección del usuario (a quién mintear) y llama
 * a nuestro Smart Contract usando NUESTRA wallet de servidor para pagar el gas.
 */
export async function POST(request: Request) {
  
  // --- 1. LEER Y VALIDAR LA ENTRADA ---
  const body = await request.json()
  const { userAddress } = body

  // Validación de seguridad simple
  if (!userAddress || !userAddress.startsWith('0x') || userAddress.length !== 42) {
    return NextResponse.json({ error: 'Dirección de wallet no válida.' }, { status: 400 })
  }

  // --- 2. CARGAR NUESTRA "SERVER WALLET" (EL PAGADOR) ---
  const privateKey = process.env.SERVER_WALLET_PRIVATE_KEY
  if (!privateKey) {
    console.error('SERVER_WALLET_PRIVATE_KEY no está configurada')
    return NextResponse.json({ error: 'Error del servidor: El pagador no está configurado.' }, { status: 500 })
  }

  // Convertimos la llave privada (string) en una "cuenta" de wallet
  const serverAccount = privateKeyToAccount(privateKey as Hex)

  // --- 3. PREPARAR LA CONEXIÓN A LA BLOCKCHAIN (Viem) ---
  
  // Obtenemos la dirección de nuestro contrato desde las variables de entorno
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Hex
  if (!contractAddress) {
    console.error('NEXT_PUBLIC_CONTRACT_ADDRESS no está configurada')
    return NextResponse.json({ error: 'Error del servidor: Contrato no configurado.' }, { status: 500 })
  }

  // Creamos un "Wallet Client": un cliente que puede ESCRIBIR (enviar transacciones)
  const walletClient = createWalletClient({
    account: serverAccount,
    chain: baseSepolia,
    transport: http(process.env.BASE_SEPOLIA_RPC_URL) // Usamos la URL RPC del .env de /contracts
  })

  // Creamos un "Public Client": un cliente que puede LEER (simular transacciones)
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(process.env.BASE_SEPOLIA_RPC_URL)
  })

  console.log(`[API MINT] Solicitud para mintear a: ${userAddress}`)

  try {
    // --- 4. SIMULAR LA TRANSACCIÓN (Prueba de fallos) ---
    // Esto es profesional: simulamos la transacción ANTES de enviarla.
    // Si esto falla (ej. el usuario ya minteó, no tenemos gas), no gastamos dinero.
    const { request: mintRequest } = await publicClient.simulateContract({
      account: serverAccount,
      address: contractAddress,
      abi: MintMyBrandABI.abi, // Usamos el ABI que importamos
      functionName: 'safeMint',
      args: [userAddress as Hex], // El argumento para la función del contrato
    })

    console.log('[API MINT] Simulación exitosa. Enviando transacción...')

    // --- 5. EJECUTAR LA TRANSACCIÓN REAL ---
    // Si la simulación fue exitosa, ahora enviamos la transacción real.
    const transactionHash = await walletClient.writeContract(mintRequest)

    console.log(`[API MINT] ¡Éxito! Transacción enviada: ${transactionHash}`)

    // --- 6. ENVIAR RESPUESTA AL FRONTEND ---
    return NextResponse.json({
      success: true,
      transactionHash: transactionHash,
    })

  } catch (error: any) {
    // Si algo sale mal (en la simulación o en la ejecución)
    console.error('[API MINT] Error al mintear:', error)
    return NextResponse.json({ error: `Error al mintear: ${error.message}` }, { status: 500 })
  }
}