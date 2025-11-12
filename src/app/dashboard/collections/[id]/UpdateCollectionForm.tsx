// PASO 1: Indicar que este es un "Componente de Cliente"
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation' // ¡Para refrescar la página!
import { type Tables } from '@/types/supabase' // Importamos nuestros tipos

// Definimos las "props" que recibirá
// Necesita la 'collection' para pre-llenar los campos
interface UpdateCollectionFormProps {
  collection: Tables<'collections'>
}

export default function UpdateCollectionForm({ collection }: UpdateCollectionFormProps) {
  const router = useRouter()
  
  // PASO 2: Pre-llenamos el estado con los datos existentes
  const [name, setName] = useState(collection.name)
  const [description, setDescription] = useState(collection.description || '')
  
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; content: string } | null>(null)

  // PASO 3: La función que llama a nuestra API de "PATCH"
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      // Llamamos a la API de "Update" que creamos
      const response = await fetch(`/api/collections/${collection.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          description: description,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Si la API devuelve un error
        throw new Error(data.error || 'Algo salió mal en el servidor.')
      }

      // ¡ÉXITO!
      setMessage({ type: 'success', content: '¡Colección actualizada con éxito!' })

      // PASO 4: ¡Refrescar!
      // Forzamos un refresco de la página del servidor.
      router.refresh()

    } catch (error: any) {
      console.error('Error al actualizar:', error)
      setMessage({ type: 'error', content: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    // ¡Usamos el estilo de "tarjeta" para una mejor UX!
    <form 
      onSubmit={handleSubmit} 
      className="w-full space-y-4 rounded-lg border border-gray-200 p-6 shadow"
    >
      <h2 className="text-xl font-semibold">Detalles de la Colección</h2>
      
      {/* Campo de Nombre */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nombre de la Colección
        </label>
        <input
          id="name"
          type="text"
          required
          value={name} // Controlado por el estado
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Campo de Descripción */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="description"
          value={description} // Controlado por el estado
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Botón de Enviar */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? 'Guardando...' : 'Guardar Cambios'}
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