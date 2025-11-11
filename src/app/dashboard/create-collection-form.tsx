// PASO 1: Indicar que este es un "Componente de Cliente"
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client' // ¡El cliente del NAVEGADOR!
import { type User } from '@supabase/supabase-js' // Importamos el tipo 'User'

// PASO 2: Definir las "props" que recibirá
// Necesitamos que el "Servidor" nos pase el ID del usuario para la seguridad.
interface CreateCollectionFormProps {
  user: User
}

// Un "slug" es una versión de un texto para URLs (ej: "Mi Café" -> "mi-cafe")
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/\s+/g, '-') // Reemplaza espacios con -
    .replace(/[^\w-]+/g, '') // Quita caracteres especiales
    .replace(/--+/g, '-') // Reemplaza múltiples - con uno solo
    .replace(/^-+/, '') // Quita - del inicio
    .replace(/-+$/, '') // Quita - del final

export default function CreateCollectionForm({ user }: CreateCollectionFormProps) {
  // PASO 3: Estados del formulario
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; content: string } | null>(null)

  // PASO 4: Función para manejar el envío
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setMessage(null)

    // Creamos el slug a partir del nombre
    const slug = slugify(name)
    if (!slug) {
      setMessage({ type: 'error', content: 'El nombre debe ser válido.' })
      setIsLoading(false)
      return
    }

    // Creamos una instancia de Supabase (del navegador)
    const supabase = createClient()

    // PASO 5: Insertar en la base de datos
    const { error } = await supabase.from('collections').insert({
      user_id: user.id, // ¡Seguridad! El ID viene del servidor
      name: name,
      description: description,
      slug: slug,
    })

    setIsLoading(false)

    if (error) {
      console.error('Error creating collection:', error.message)
      setMessage({ type: 'error', content: `Error: ${error.message}` })
    } else {
      setMessage({ type: 'success', content: '¡Colección creada con éxito!' })
      // Limpiamos el formulario
      setName('')
      setDescription('')
    }
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full max-w-lg space-y-4 rounded-lg border border-gray-200 p-6 shadow"
    >
      <h2 className="text-xl font-semibold">Crear Nueva Colección</h2>

      {/* Campo de Nombre */}
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

      {/* Campo de Descripción */}
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

      {/* Botón de Enviar */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? 'Creando...' : 'Crear Colección'}
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