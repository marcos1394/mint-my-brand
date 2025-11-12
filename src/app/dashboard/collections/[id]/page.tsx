import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'
import ImageUploader from './image-uploader'
import DeployButton from './deploy-button' // ¡NUEVA IMPORTACIÓN!

interface CollectionDetailsPageProps {
  params: Promise<{ id: string }> 
}

export default async function CollectionDetailsPage({ params }: CollectionDetailsPageProps) {

  const { id } = await params 

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

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

        {/* Componente de Subida de Imagen (Sin cambios) */}
        <div className="mt-10 rounded-lg border border-gray-200 p-6 shadow">
          <h2 className="text-xl font-semibold">Imagen del NFT</h2>
          <p className="mt-2 text-sm text-gray-500">
            Esta será la imagen que tus clientes verán en sus wallets.
          </p>
          <div className="mt-4">
            <ImageUploader collection={collection} />
          </div>
        </div>

        {/* --- ¡AQUÍ ESTÁ EL CAMBIO! --- */}
        {/* Lógica condicional para el despliegue */}
        <div className="mt-10 rounded-lg border p-6 shadow">
          {collection.contract_address ? (
            // 1. SI YA ESTÁ DESPLEGADO (tiene dirección)
            <div className="text-left">
              <h2 className="text-xl font-semibold text-green-700">¡Colección Desplegada!</h2>
              <p className="mt-2 text-sm text-gray-600">
                Tu Smart Contract está en vivo en la red Base Sepolia.
              </p>
              <p className="mt-2 text-sm font-medium text-gray-900">
                Dirección del Contrato:
              </p>
              <pre className="mt-1 w-full overflow-x-auto rounded bg-gray-100 p-2 text-xs text-gray-700">
                {collection.contract_address}
              </pre>
              <a 
                href={`https://sepolia.basescan.org/address/${collection.contract_address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-blue-600 hover:underline"
              >
                Ver en el Explorador de Bloques (Basescan) &rarr;
              </a>
            </div>
          ) : (
            // 2. SI NO ESTÁ DESPLEGADO (es null)
            <div className="text-left">
              <h2 className="text-xl font-semibold text-orange-900">Estado: No Desplegado</h2>
              <p className="mt-2 text-sm text-orange-700">
                Tu colección está guardada, pero aún no existe en la blockchain.
                Presiona "Desplegar" para publicar tu contrato (esto puede tardar 30-60 segundos).
              </p>
              <div className="mt-4">
                {/* ¡Renderizamos nuestro nuevo botón interactivo! */}
                <DeployButton collectionId={collection.id} />
              </div>
            </div>
          )}
        </div>
        {/* --- FIN DEL CAMBIO --- */}

      </div>
    </main>
  )
}