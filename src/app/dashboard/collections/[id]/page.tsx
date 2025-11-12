import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers' // Importamos 'cookies'
import ImageUploader from './image-uploader' // Importamos el componente de subida
import DeployButton from './deploy-button' // Importamos el botón de despliegue
import UpdateCollectionForm from './UpdateCollectionForm' // ¡Importamos el nombre correcto!
/**
 * Esta es la "prop" que Next.js 16/Turbopack le pasa a una página dinámica
 * (¡params es una Promesa!)
 */
interface CollectionDetailsPageProps {
  params: Promise<{ id: string }> 
}

/**
 * Esta es la página de "Administrar Colección"
 * Es un "Componente de Servidor" (Server Component).
 * Su trabajo es:
 * 1. Obtener el 'id' de la URL (desenvolviendo la promesa).
 * 2. Obtener el 'user' actual (para seguridad).
 * 3. Buscar la colección específica que pertenezca a ESE usuario.
 * 4. Renderizar los componentes de cliente (Uploader, Deployer) con esos datos.
 */
export default async function CollectionDetailsPage({ params }: CollectionDetailsPageProps) {
  
  // 1. "Desenvolvemos" la promesa de params (la lección aprendida)
  const { id } = await params 
  
  // 2. Creamos el cliente de Supabase (con el patrón profesional)
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  // 3. Obtenemos al usuario (para nuestra consulta de seguridad)
  //    El layout.tsx ya manejó el 'redirect' si no hay usuario,
  //    pero lo necesitamos para el user.id
  const { data: { user } } = await supabase.auth.getUser()

  // ¡Defensa en profundidad! Si el usuario es nulo por alguna razón, no seguimos.
  if (!user) {
    return notFound()
  }
  
  // 4. Buscamos la colección en la base de datos
  const { data: collection, error: collectionError } = await supabase
    .from('collections')
    .select() // select() o select('*') es lo mismo aquí
    .eq('id', id) // "Donde el 'id' sea el de la URL"
    .eq('user_id', user.id) // "Y donde el dueño sea el usuario logueado"
    .single()

  // 5. Manejamos el error (RLS)
  //    Si 'collection' es nulo, significa que no se encontró
  //    o que el usuario no es el dueño.
  if (collectionError || !collection) {
    notFound() // Muestra la página de "No Encontrado" (404)
  }

  // 6. ¡NUEVA LÓGICA DE VALIDACIÓN!
  //    Creamos la variable booleana que le pasaremos al botón
  //    '!!' (doble negación) convierte (string o null) a (true o false)
  const isReadyToDeploy = !!collection.image_url

  // 7. ¡Éxito! Renderizamos la página
  return (
    // ¡No hay <main>! El layout.tsx (el "padre") ya lo tiene.
    <div className="w-full max-w-4xl space-y-10">
      
      {/* Sección de Encabezado */}
      <div>
        <h1 className="text-3xl font-bold">
          Administrar Colección: {collection.name}
        </h1>
        <p className="mt-2 text-gray-600">
          {collection.description || 'Esta colección aún no tiene descripción.'}
        </p>
      </div>

      {/* --- ¡NUEVA SECCIÓN! --- */}
      {/* Formulario para Actualizar Nombre y Descripción */}
      <div className="rounded-lg border border-gray-200 p-6 shadow">
        <h2 className="text-xl font-semibold">Detalles de la Colección</h2>
        <div className="mt-4">
          <UpdateCollectionForm collection={collection} />
        </div>
      </div>

      {/* Sección de Subida de Imagen */}
      <div className="rounded-lg border border-gray-200 p-6 shadow">
        <h2 className="text-xl font-semibold">Imagen del NFT</h2>
        <p className="mt-2 text-sm text-gray-500">
          Esta será la imagen que tus clientes verán en sus wallets.
        </p>
        <div className="mt-4">
          <ImageUploader collection={collection} />
        </div>
      </div>
      
      {/* Sección de Despliegue (Estado de la Colección) */}
      <div className="rounded-lg border p-6 shadow">
        {collection.contract_address ? (
          
          // --- ESTADO 1: YA DESPLEGADO ---
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
          
          // --- ESTADO 2: NO DESPLEGADO ---
          <div className="text-left">
            <h2 className="text-xl font-semibold text-orange-900">Estado: No Desplegado</h2>
            <p className="mt-2 text-sm text-orange-700">
              Tu colección está guardada, pero aún no existe en la blockchain.
            </p>
            <div className="mt-4">
              {/* ¡Le pasamos ambas props a nuestro botón de cliente! */}
              <DeployButton 
                collectionId={collection.id} 
                isReadyToDeploy={isReadyToDeploy} 
              />
            </div>
          </div>
        )}
      </div>

    </div>
  )
}