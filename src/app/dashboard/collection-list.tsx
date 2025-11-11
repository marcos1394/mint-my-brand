// Importamos los 'tipos' que definirá nuestra data
import { type Tables } from '@/types/supabase' // ¡Crearemos este archivo en un segundo!

// Definimos las "props" que recibirá el componente
interface CollectionListProps {
  collections: Tables<'collections'>[] // Recibirá un array de 'colecciones'
}

export default function CollectionList({ collections }: CollectionListProps) {

  // Si el usuario no tiene colecciones, mostramos un mensaje amigable
  if (collections.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900">Aún no tienes colecciones</h3>
        <p className="mt-2 text-sm text-gray-500">
          Usa el formulario de arriba para crear tu primera.
        </p>
      </div>
    )
  }

  // Si SÍ tiene colecciones, las mostramos en una lista
  return (
    <div className="flow-root">
      <h2 className="text-xl font-semibold mb-4">Mis Colecciones Creadas</h2>
      <ul role="list" className="divide-y divide-gray-200 rounded-lg border border-gray-200 shadow">
        {collections.map((collection) => (
          <li key={collection.id} className="flex items-center justify-between gap-x-6 p-4 bg-white">
            <div>
              <p className="font-semibold text-gray-900">{collection.name}</p>
              <p className="text-sm text-gray-500">
                {collection.slug}
              </p>
            </div>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Editar {/* Esto no hará nada por ahora, pero es para el futuro */}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}