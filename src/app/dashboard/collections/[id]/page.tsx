import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import ImageUploader from './image-uploader'
import DeployButton from './deploy-button'
import UpdateCollectionForm from './UpdateCollectionForm'
import DeleteButton from './DeleteButton' // ¡NUEVA IMPORTACIÓN!
import RecordActivityForm from './RecordActivityForm' // ¡NUEVA IMPORTACIÓN!

/**
 * Esta es la "prop" que Next.js 16/Turbopack le pasa
 */
interface CollectionDetailsPageProps {
  params: Promise<{ id: string }> 
}

/**
 * Esta es la página de "Administrar Colección"
 * Es un "Componente de Servidor" (Server Component).
 * Renderiza "caparazones" y pasa datos a los
 * Componentes de Cliente interactivos.
 */
export default async function CollectionDetailsPage({ params }: CollectionDetailsPageProps) {
  
  // 1. "Desenvolvemos" la promesa de params
  const { id } = await params 
  
  // 2. Creamos el cliente de Supabase
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  // 3. Obtenemos al usuario (para nuestra consulta de seguridad)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { notFound() } // Seguridad: El layout ya lo hizo, pero esto es defensa en profundidad
  
  // 4. Buscamos la colección (seguridad explícita)
  const { data: collection, error: collectionError } = await supabase
    .from('collections')
    .select()
    .eq('id', id)
    .eq('user_id', user.id) // Solo el dueño puede ver esta página
    .single()

  // 5. Si no existe o no es el dueño, 404
  if (collectionError || !collection) {
    notFound() 
  }

  // 6. Variable de estado para el botón de despliegue
  const isReadyToDeploy = !!collection.image_url

  // 7. ¡Éxito! Renderizamos la página
  return (
    // El 'layout.tsx' padre ya nos da el <main> y el padding
    // Usamos 'space-y-10' para separar nuestras "tarjetas"
    <div className="w-full max-w-4xl space-y-10">
      
      {/* Tarjeta 1: Encabezado */}
      <div>
        <h1 className="text-3xl font-bold">
          Administrar Colección: {collection.name}
        </h1>
        <p className="mt-2 text-gray-600">
          {collection.description || 'Actualiza los detalles de tu colección.'}
        </p>
      </div>

      {/* Tarjeta 2: Formulario de Actualizar Detalles */}
      <UpdateCollectionForm collection={collection} />

      {/* Tarjeta 3: Formulario de Subir Imagen */}
      <div className="rounded-lg border border-gray-200 p-6 shadow">
        <h2 className="text-xl font-semibold">Imagen del NFT</h2>
        <p className="mt-2 text-sm text-gray-500">
          Esta será la imagen que tus clientes verán en sus wallets.
        </p>
        <div className="mt-4">
          <ImageUploader collection={collection} />
        </div>
      </div>
      
      {/* Tarjeta 4: Sección de Despliegue (Estado de la Colección) */}
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
              <DeployButton 
                collectionId={collection.id} 
                isReadyToDeploy={isReadyToDeploy} 
              />
            </div>
          </div>
        )}
      </div>

      {/* --- ¡NUEVA TARJETA! Tarjeta 5: "Registrar Actividad" --- */}
{/* Solo mostramos esta tarjeta SI la colección ya fue desplegada */}
{collection.contract_address && (
  <RecordActivityForm collectionId={collection.id} />
)}

      {/* --- ¡NUEVA TARJETA! Tarjeta 5: "Zona de Peligro" --- */}
      <div className="rounded-lg border border-red-300 bg-red-50 p-6 shadow">
        <h2 className="text-xl font-semibold text-red-900">Zona de Peligro</h2>
        <p className="mt-2 text-sm text-red-700">
          Esta acción es irreversible. Borrará tu colección de la base de datos
          (aunque el contrato en la blockchain, si fue desplegado, es permanente).
        </p>
        <div className="mt-4">
          {/* Le pasamos el 'id' y el 'name' al botón de borrado */}
          <DeleteButton 
            collectionId={collection.id} 
            collectionName={collection.name} 
          />
        </div>
      </div>

    </div>
  )
}