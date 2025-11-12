// PASO 1: Indicar que este es un "Componente de Cliente"
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client' // Cliente de Navegador
import { type Tables } from '@/types/supabase'
import Image from 'next/image' // Para mostrar la imagen
import { useRouter } from 'next/navigation' // Para refrescar la página

// Definimos las "props" que recibirá
interface ImageUploaderProps {
  collection: Tables<'collections'> // Recibe la colección actual
}

export default function ImageUploader({ collection }: ImageUploaderProps) {
  const router = useRouter() // Obtenemos el router
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; content: string } | null>(null)

  // Estado para la previsualización de la imagen
  const [previewUrl, setPreviewUrl] = useState<string | null>(collection.image_url)

  // PASO 2: Manejar la selección del archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)

    // Crear una URL de previsualización
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile))
    } else {
      setPreviewUrl(collection.image_url) // Vuelve a la imagen original si cancela
    }
  }

  // PASO 3: Manejar la subida del archivo
  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', content: 'Por favor, selecciona un archivo primero.' })
      return
    }

    setIsUploading(true)
    setMessage(null)
    const supabase = createClient()

    // 1. Definimos un nombre de archivo único y seguro
    //    Ej: 'public/e7160f90.../nft-image.png'
    const fileExt = file.name.split('.').pop()
    const fileName = `nft-image.${fileExt}`
    const filePath = `public/${collection.id}/${fileName}`

    // 2. Subimos el archivo al "Bucket" de Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('collection_images') // El nombre de nuestro bucket
      .upload(filePath, file, {
        upsert: true, // "upsert" significa: sobrescribir si ya existe
      })

    if (uploadError) {
      console.error('Error uploading file:', uploadError)
      setMessage({ type: 'error', content: `Error al subir: ${uploadError.message}` })
      setIsUploading(false)
      return
    }

    // 3. Obtenemos la URL pública del archivo que acabamos de subir
    const { data: publicUrlData } = supabase.storage
      .from('collection_images')
      .getPublicUrl(filePath)

    const publicUrl = publicUrlData.publicUrl

    // 4. ACTUALIZAMOS nuestra base de datos (la tabla 'collections')
    //    Guardamos la URL pública en la columna 'image_url'
    const { error: updateError } = await supabase
      .from('collections')
      .update({ image_url: publicUrl }) // Guardamos la URL
      .eq('id', collection.id) // Para esta colección

    if (updateError) {
      console.error('Error updating collection:', updateError)
      setMessage({ type: 'error', content: `Error al guardar: ${updateError.message}` })
    } else {
      setMessage({ type: 'success', content: '¡Imagen actualizada con éxito!' })
      // Forzamos un refresco de la página para que el 'Server Component'
      // vuelva a cargar y muestre la nueva imagen guardada.
      router.refresh()
    }

    setFile(null)
    setIsUploading(false)
  }

  return (
    <div className="space-y-4">

      {/* Previsualización de la Imagen */}
      <div className="w-full max-w-xs">
        <label className="block text-sm font-medium text-gray-700">Previsualización</label>
        <div className="mt-1 flex h-48 w-48 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Previsualización de la colección"
              width={192}
              height={192}
              className="h-full w-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-gray-500">Sube una imagen</span>
          )}
        </div>
      </div>

      {/* Selector de Archivo */}
      <div>
        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
          Seleccionar imagen (PNG, JPG)
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-500
                     file:mr-4 file:rounded-md file:border-0
                     file:bg-blue-50 file:px-4 file:py-2
                     file:text-sm file:font-semibold file:text-blue-700
                     hover:file:bg-blue-100"
        />
      </div>

      {/* Botón de Subir */}
      <button
        onClick={handleUpload}
        disabled={isUploading || !file}
        className="w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isUploading ? 'Subiendo...' : 'Guardar Imagen'}
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
    </div>
  )
}