// Lo devolvemos a un Componente de Cliente (lo cual es correcto)
'use client'

import { type Tables } from '@/types/supabase'
import Link from 'next/link' // ¡Volvemos a usar Link!

interface CollectionListProps {
  collections: Tables<'collections'>[]
}

export default function CollectionList({ collections }: CollectionListProps) {
  
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

  return (
    <div className="flow-root">
      <h2 className="text-xl font-semibold mb-4">Mis Colecciones Creadas</h2>
      <ul role="list" className="divide-y divide-gray-200 rounded-lg border border-gray-200 shadow">
        {collections.map((collection) => (
          <li key={collection.id} className="flex items-center justify-between gap-x-6 p-4 bg-white">
            <div>
              <p className="font-semibold text-gray-900">{collection.name}</p>
              <p className="text-sm text-gray-500">
                Slug: /{collection.slug}
              </p>
            </div>
            
            {/* --- ¡VOLVEMOS A USAR EL LINK PROFESIONAL! --- */}
            <Link 
              href={`/dashboard/collections/${collection.id}`} 
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Administrar
            </Link>
            {/* --- FIN DEL CAMBIO --- */}

          </li>
        ))}
      </ul>
    </div>
  )
}