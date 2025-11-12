'use client' 

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { OnchainKitProvider } from '@coinbase/onchainkit'
import { metaMask, walletConnect } from 'wagmi/connectors'

// --- ¡LOGS DE DEPURACIÓN! ---
// Vamos a imprimir las variables de entorno tal como las ve el NAVEGADOR.
console.log('--- LEYENDO VARIABLES EN providers.tsx ---')
console.log('Project ID de WalletConnect:', process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID)
console.log('URL RPC de Base Sepolia:', process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL)
console.log('-------------------------------------------')
// --- FIN DE LOGS ---

const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
const BASE_SEPOLIA_RPC_URL = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL

// Creamos un 'fallback' por si la URL es undefined, para que no crashee
const transport = BASE_SEPOLIA_RPC_URL ? http(BASE_SEPOLIA_RPC_URL) : http()

if (!WALLETCONNECT_PROJECT_ID) {
  console.error('¡Error! Falta NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID en .env.local')
}

const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    metaMask({ dappMetadata: { name: 'Mint-My-Brand' } }),
    walletConnect({
      projectId: WALLETCONNECT_PROJECT_ID!,
      metadata: { name: 'Mint-My-Brand', description: 'Plataforma de Lealtad NFT', url: 'https://mintmybrand.com', icons: [''] }
    }),
  ],
  ssr: true,
  transports: {
    [baseSepolia.id]: transport, // Usamos nuestro 'transport' seguro
  },
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider chain={baseSepolia}>
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}