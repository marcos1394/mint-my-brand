import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  createWalletClient,
  createPublicClient,
  http,
  type Hex,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'
import MintMyBrandFactoryABI from '@/lib/MintMyBrandFactoryABI.json' 

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // ... (Pasos 1-4: Seguridad, Obtener Datos, Buscar Colección) ...
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }
  const { collectionId } = await request.json()
  if (!collectionId) {
    return NextResponse.json({ error: 'Falta el ID de la colección' }, { status: 400 })
  }
  const { data: collection, error: collectionError } = await supabase
    .from('collections')
    .select()
    .eq('id', collectionId)
    .eq('user_id', user.id)
    .single()
  if (collectionError || !collection) {
    return NextResponse.json({ error: 'Colección no encontrada o no autorizado' }, { status: 404 })
  }
  if (collection.contract_address) {
    return NextResponse.json({ error: 'Esta colección ya ha sido desplegada.' }, { status: 400 })
  }
  // --- Fin de las verificaciones ---

  try {
    // --- 5. CONFIGURAR LA CONEXIÓN WEB3 (VIEM) ---
    const privateKey = process.env.SERVER_WALLET_PRIVATE_KEY as Hex
    if (!privateKey) throw new Error('SERVER_WALLET_PRIVATE_KEY no configurada')

    const factoryAddress = process.env.NEXT_PUBLIC_CONTRACT_FACTORY_ADDRESS as Hex
    if (!factoryAddress) throw new Error('CONTRACT_FACTORY_ADDRESS no configurada')

    const serverAccount = privateKeyToAccount(privateKey)
    const rpcUrl = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL!

    const walletClient = createWalletClient({
      account: serverAccount,
      chain: baseSepolia,
      transport: http(rpcUrl),
    })

    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(rpcUrl),
    })

    // --- 6. ¡LA MAGIA! (CORREGIDA) ---
    console.log(`[API DEPLOY] Llamando a "createCollection" en la fábrica: ${factoryAddress}`)
    
    // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
    // El array 'args' ahora solo tiene 3 elementos,
    // ¡coincidiendo con la firma de la función del contrato!
    const args = [
      collection.name,          // 1. name
      collection.slug.toUpperCase().substring(0, 5), // 2. symbol
      `https://api.mintmybrand.com/metadata/${collection.id}/` // 3. baseURI
    ]
    // --- FIN DE LA CORRECCIÓN ---

    console.log('[API DEPLOY] Simulando con args:', args)

    const { request: deployRequest, result: newContractAddress } = await publicClient.simulateContract({
      account: serverAccount,
      address: factoryAddress,
      abi: MintMyBrandFactoryABI.abi,
      functionName: 'createCollection',
      args: args, // ¡Ahora pasamos el array de 3 elementos!
    })

    console.log(`[API DEPLOY] Simulación exitosa. Nueva dirección de contrato: ${newContractAddress}`)

    const txHash = await walletClient.writeContract(deployRequest)
    
    console.log(`[API DEPLOY] Transacción enviada. Hash: ${txHash}`)
    console.log(`[API DEPLOY] Esperando confirmación de la blockchain... (esto puede tardar 30s)`)

    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash })

    if (receipt.status === 'reverted') {
      throw new Error('La transacción falló (reverted) en la blockchain.')
    }

    console.log(`[API DEPLOY] ¡Éxito! Transacción confirmada.`)

    // --- 7. ACTUALIZAR SUPABASE CON LA NUEVA DIRECCIÓN ---
    const { error: updateError } = await supabase
      .from('collections')
      .update({ contract_address: newContractAddress as string })
      .eq('id', collection.id)

    if (updateError) throw new Error(`Error al actualizar Supabase: ${updateError.message}`)

    console.log(`[API DEPLOY] Base de datos actualizada. ¡Proceso completo!`)

    // --- 8. DEVOLVER ÉXITO ---
    return NextResponse.json({
      success: true,
      contractAddress: newContractAddress,
      transactionHash: txHash,
    })

  } catch (error: any) {
    console.error('[API DEPLOY] Error fatal:', error)
    return NextResponse.json({ error: error.message || 'Error desconocido' }, { status: 500 })
  }
}