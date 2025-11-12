'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation' // ¡NUEVO! Para redirigir

// (El componente 'User' ya no es necesario aquí, lo quitamos)
// interface CreateCollectionFormProps {
//   user: User
// }

// (La función 'slugify' ya no está aquí, la movimos al servidor)

export default function CreateCollectionForm() {
  const router = useRouter() // Inicializamos el router

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; content: string } | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setMessage(null)

    // ¡NUEVA LÓGICA! Llamamos a nuestra propia API de Web2
    const response = await fetch('/api/collections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        description: description,
      }),
    })

    const data = await response.json()
    setIsLoading(false)

    if (!response.ok) {
      // Si la API devuelve un error
      console.error('Error al crear colección:', data.error)
      setMessage({ type: 'error', content: `Error: ${data.error}` })
    } else {
      // ¡ÉXITO!
      setMessage({ type: 'success', content: '¡Colección creada! Redirigiendo...' })

      // ¡LA REDIRECCIÓN!
      // data.id es el ID de la colección que nuestra API nos devolvió
      router.push(`/dashboard/collections/${data.id}`)
    }
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full max-w-lg space-y-4 rounded-lg border border-gray-200 p-6 shadow"
    >
      <h2 className="text-xl font-semibold">Crear Nueva Colección</h2>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nombre de la Colección (Requerido)
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Ej: Colección Fundadores"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descripción (Opcional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Ej: Un NFT especial para mis 100 primeros clientes."
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? 'Creando...' : 'Crear Colección'}
      </button>

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