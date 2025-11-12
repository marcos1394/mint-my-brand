// PASO 1: Indicar que este es un "Componente de Cliente"
'use client'

import { useState } from 'react'

// Definimos las "props" que recibirá
interface RecordActivityFormProps {
  collectionId: string // El ID de la colección para la que registramos
}

export default function RecordActivityForm({ collectionId }: RecordActivityFormProps) {
  // PASO 2: Estados del formulario
  const [userAddress, setUserAddress] = useState('') // La wallet del cliente
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; content: string } | null>(null)

  // PASO 3: La función que llama a nuestra API de "Actividad"
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      // Llamamos a la API que construimos en el paso anterior
      const response = await fetch('/api/activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collectionId: collectionId,
          userAddress: userAddress,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Si la API devuelve un error (ej. "no eres el dueño")
        throw new Error(data.error || 'Algo salió mal en el servidor.')
      }

      // ¡ÉXITO!
      setMessage({ type: 'success', content: `¡Visita registrada para ${userAddress.substring(0, 6)}...!` })
      setUserAddress('') // Limpiamos el campo

    } catch (error: any) {
      console.error('Error al registrar visita:', error)
      setMessage({ type: 'error', content: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full space-y-4 rounded-lg border border-gray-200 p-6 shadow"
    >
      <h2 className="text-xl font-semibold">Registrar Visita de Cliente</h2>
      <p className="text-sm text-gray-500">
        Ingresa la dirección de wallet de tu cliente (ej. 0x...) para registrar una "visita" y que su NFT suba de nivel.
      </p>

      {/* Campo de Dirección de Wallet */}
      <div>
        <label htmlFor="userAddress" className="block text-sm font-medium text-gray-700">
          Dirección de Wallet del Cliente
        </label>
        <input
          id="userAddress"
          type="text"
          required
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="0xAbC...123"
        />
      </div>

      {/* Botón de Enviar */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? 'Registrando...' : 'Registrar Visita'}
      </button>

      {/* Mensajes de Éxito/Error */}
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
    </form>
  )
}