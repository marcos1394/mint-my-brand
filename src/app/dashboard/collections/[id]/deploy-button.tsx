// PASO 1: Indicar que este es un "Componente de Cliente"
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation' // ¡Para refrescar la página!

// --- ¡NUEVO CAMBIO! ---
// Añadimos 'isReadyToDeploy' a las props
interface DeployButtonProps {
  collectionId: string // El ID de la fila de Supabase
  isReadyToDeploy: boolean // ¿Ha subido el usuario una imagen?
}

export default function DeployButton({ collectionId, isReadyToDeploy }: DeployButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; content: string } | null>(null)

  // PASO 2: La función que llama a nuestra API de "Fábrica"
  const handleDeploy = async () => {
    // Doble chequeo por si acaso
    if (!isReadyToDeploy) {
      setMessage({ type: 'error', content: 'Debes subir una imagen antes de desplegar.' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      // Llamamos a la API que construimos en el paso anterior
      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collectionId: collectionId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Si la API devuelve un error (ej. 500)
        throw new Error(data.error || 'Algo salió mal en el servidor.')
      }

      // ¡ÉXITO!
      console.log('Contrato desplegado:', data.contractAddress)
      setMessage({ type: 'success', content: '¡Desplegado con éxito! Refrescando...' })

      // PASO 3: ¡LA MAGIA DE UX!
      // Forzamos un refresco de la página del servidor.
      // Next.js volverá a cargar la página, verá que la colección
      // YA tiene una 'contract_address', y mostrará el estado "Desplegado".
      router.refresh()

    } catch (error: any) {
      console.error('Error al desplegar:', error)
      setMessage({ type: 'error', content: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      
      {/* ¡NUEVO! Un mensaje de ayuda si no está listo */}
      {!isReadyToDeploy && (
        <p className="text-sm text-center text-orange-700">
          Por favor, sube una imagen para la colección en la sección de arriba antes de desplegar.
        </p>
      )}

      <button
        onClick={handleDeploy}
        // --- ¡NUEVO CAMBIO! ---
        // El botón se deshabilita si está 'cargando' O si no está 'listo'
        disabled={isLoading || !isReadyToDeploy}
        className="w-full justify-center rounded-md border border-transparent bg-orange-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? 'Desplegando... (esto puede tardar 45s)' : 'Desplegar en Base Sepolia'}
      </button>

      {/* Mensajes de Éxito/Error (sin cambios) */}
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