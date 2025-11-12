// PASO 1: Indicar que este es un "Componente de Cliente"
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation' // ¡Para redirigir!

export default function CreateCollectionForm() {
  const router = useRouter() // Inicializamos el router
  
  // --- Estados del formulario ---
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  // ¡NUEVO ESTADO para el tipo de NFT!
  const [dynamicType, setDynamicType] = useState('STATIC') // 'STATIC' por defecto
  
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; content: string } | null>(null)

  // --- Función de Envío (Submit) ---
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault() // Prevenimos que la página se recargue
    setIsLoading(true)
    setMessage(null)

    // ¡NUEVO! Enviamos el 'dynamicType' a la API
    const response = await fetch('/api/collections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        description: description,
        dynamicType: dynamicType, // ¡Aquí está!
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

  // --- Renderizado del Formulario ---
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

      {/* --- ¡NUEVO FORMULARIO (Select)! --- */}
      <div>
        <label htmlFor="dynamicType" className="block text-sm font-medium text-gray-700">
          Tipo de NFT
        </label>
        <select
          id="dynamicType"
          value={dynamicType}
          onChange={(e) => setDynamicType(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="STATIC">Estático (La imagen nunca cambia)</option>
          <option value="HAPPY_HOUR">Dinámico: Happy Hour (Cambia de 5-7 PM)</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Puedes configurar más tipos dinámicos (niveles, etc.) más adelante.
        </p>
      </div>
      {/* --- FIN DE NUEVO FORMULARIO --- */}

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