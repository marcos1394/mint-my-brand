import { createClient } from '@/lib/supabase/server' // Cliente de Servidor
import { notFound } from 'next/navigation'
import Image from 'next/image' // Para mostrar la imagen del NFT
import Link from 'next/link'

// 1. Definimos las props (¡sabemos que 'params' es una Promesa!)
interface PublicClaimPageProps {
  params: Promise<{ slug: string }> // El '[slug]' de la URL
}

export default async function PublicClaimPage(props: PublicClaimPageProps) {
  
  // 2. "Desenvolvemos" la promesa (¡la lección aprendida!)
  const { slug } = await props.params

  // 3. Creamos un cliente de Supabase (anónimo)
  const supabase = createClient()

  // 4. Buscamos la colección usando el 'slug' de la URL
  //    ¡Esto funciona gracias a nuestra nueva política de "Lectura Pública"!
  const { data: collection, error: collectionError } = await supabase
    .from('collections')
    .select() // "Selecciona todo"
    .eq('slug', slug) // "Donde el 'slug' sea igual al de la URL"
    .single() // "Espero solo UN resultado"

  // 5. Si no se encuentra (o hay error), mostramos un 404
  if (collectionError || !collection) {
    notFound() // Muestra la página de "No Encontrado" (404)
  }

  // 6. ¡Éxito! Tenemos la colección. La mostramos.
  return (
    <main className="flex min-h-screen flex-col items-center p-8 lg:p-12 bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl border border-gray-200">
        
        {/* La Imagen del NFT */}
        {collection.image_url ? (
          <Image
            src={collection.image_url} // ¡La imagen que subió el usuario!
            alt={`Imagen de ${collection.name}`}
            width={600}
            height={600}
            className="w-full h-auto object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-72 flex items-center justify-center bg-gray-100 rounded-t-lg">
            <span className="text-gray-400">Sin imagen</span>
          </div>
        )}

        {/* Detalles de la Colección */}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {collection.name}
          </h1>
          <p className="mt-2 text-gray-600">
            {collection.description || 'Una colección especial.'}
          </p>

          {/* El Botón de Reclamo (Aún no hace nada) */}
          <button
            disabled // Lo deshabilitamos por ahora
            className="mt-6 w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-3 font-medium text-white shadow-sm disabled:bg-gray-400"
          >
            Reclamar mi NFT (Próximamente)
          </button>
        </div>

      </div>

      {/* Un link "Powered by" para tu marca */}
      <footer className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Powered by{' '}
          <Link href="/" className="font-medium text-blue-600 hover:underline">
            Mint-My-Brand
          </Link>
        </p>
      </footer>
    </main>
  )
}