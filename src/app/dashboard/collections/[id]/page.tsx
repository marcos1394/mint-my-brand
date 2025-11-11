import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import ImageUploader from './image-uploader' // ¡NUEVA IMPORTACIÓN!

interface CollectionDetailsPageProps {
  params: Promise<{ id: string }> 
}

export default async function CollectionDetailsPage({ params }: CollectionDetailsPageProps) {

  const { id } = await params 

  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  const { data: collection, error: collectionError } = await supabase
    .from('collections')
    .select()
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (collectionError || !collection) {
    console.error('Error fetching collection:', collectionError?.message)
    notFound() 
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 lg:p-12">
      <div className="w-full max-w-4xl">

        <Link href="/dashboard" className="text-sm text-blue-500 hover:underline">
          &larr; Volver a tu Dashboard
        </Link>

        <h1 className="mt-4 text-3xl font-bold">
          Administrar Colección: {collection.name}
        </h1>
        <p className="mt-2 text-gray-600">
          {collection.description || 'Esta colección aún no tiene descripción.'}
        </p>

        {/* --- ¡AQUÍ ESTÁ EL CAMBIO! --- */}
        <div className="mt-10 rounded-lg border border-gray-200 p-6 shadow">
          <h2 className="text-xl font-semibold">Imagen del NFT</h2>
          <p className="mt-2 text-sm text-gray-500">
            Esta será la imagen que tus clientes verán en sus wallets.
          </p>

          <div className="mt-4">
            {/* Reemplazamos el 'placeholder' con nuestro componente real */}
            <ImageUploader collection={collection} />
          </div>
        </div>
        {/* --- FIN DEL CAMBIO --- */}

      </div>
    </main>
  )
}