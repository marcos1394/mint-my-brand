'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi' // Seguimos necesitando esto para saber si mostrar el botón de "Mint"
import { Wallet } from '@coinbase/onchainkit/wallet' // ¡LA CORRECCIÓN! Usamos el componente "Todo en Uno"

// Definimos las "props" que la página del servidor le pasará
interface ClaimButtonProps {
  collectionId: string
}

export default function ClaimButton({ collectionId }: ClaimButtonProps) {
  // 1. Obtenemos el estado de la wallet del usuario desde Wagmi
  const { address, isConnected } = useAccount()

  // 2. Estados de React para manejar la carga y los mensajes
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; content: string } | null>(null)

  // 3. Nuestra función de "Minting" (Acuñación) que llama a NUESTRA API
  //    (Esta función no cambia, es 100% correcta)
  const handleMint = async () => {
    if (!isConnected || !address) {
      setMessage({ type: 'error', content: 'Por favor, conecta tu wallet primero.' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress: address }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Algo salió mal.')

      setMessage({ 
        type: 'success', 
        content: `¡Éxito! Tu NFT está en camino. Hash: ${data.transactionHash.substring(0, 10)}...`
      })

    } catch (error: any) {
      console.error('Error al reclamar el NFT:', error)
      setMessage({ type: 'error', content: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  // 4. El renderizado (JSX)
  return (
    <div className="w-full space-y-4">
      
      {/* PARTE A: El Componente de Wallet (Versión "Quick Start")
          Esto renderizará el botón "Connect Wallet" por defecto, 
          y se convertirá en el perfil del usuario (Avatar, Nombre, Menú)
          automáticamente cuando se conecte.
      */}
      <Wallet />

      {/* PARTE B: Nuestro Botón de "Reclamar"
          Este es un botón separado que SOLO se muestra si el usuario ya está conectado.
      */}
      {isConnected && (
        <button
          onClick={handleMint}
          disabled={isLoading}
          className="w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-3 font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? 'Procesando en la blockchain...' : 'Reclamar mi NFT (¡Gratis!)'}
        </button>
      )}

      {/* PARTE C: Mensajes de Éxito o Error
      */}
      {message && (
        <div 
          className={`mt-4 rounded p-3 text-center text-sm ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}
        >
          {message.content}
        </div>
      )}
    </div>
  )
}