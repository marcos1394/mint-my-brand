import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CreateCollectionForm from './create-collection-form'
import CollectionList from './collection-list' // ¡IMPORTAMOS LA NUEVA LISTA!

export default async function DashboardPage() {
  const supabase = createClient()
  
  // 1. Obtenemos al usuario (como antes)
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // 2. ¡NUEVO! Obtenemos las colecciones de ESE usuario
  //    Gracias a RLS (Seguridad a Nivel de Fila) que ya activamos,
  //    Supabase *automáticamente* solo nos devolverá las colecciones
  //    donde 'user_id' == 'auth.uid()'. ¡Es magia de seguridad!
  const { data: collections } = await supabase
    .from('collections')
    .select()
    .order('created_at', { ascending: false }) // Mostrar las más nuevas primero

  return (
    <main className="flex min-h-screen flex-col items-center p-8 lg:p-12">
      
      <div className="flex w-full max-w-4xl justify-between">
        <div className="text-left">
          <h1 className="text-2xl font-bold">Tu Dashboard</h1>
          <p className="mt-1 text-gray-500">
            Bienvenido, <span className="font-medium text-blue-600">{user.email}</span>
          </p>
        </div>
        
        <Link href="/" className="text-sm text-blue-500 hover:underline">
          Volver a la Home
        </Link>
      </div>

      <div className="mt-10 w-full max-w-4xl">
        {/* El formulario sigue aquí, sin cambios */}
        <CreateCollectionForm user={user} />
      </div>

      <div className="mt-10 w-full max-w-4xl">
        {/* 3. ¡AQUÍ ESTÁ LA MAGIA! */}
        {/* Renderizamos la lista y le pasamos las colecciones */}
        {/* que obtuvimos del servidor (o un array vacío si es nulo) */}
        <CollectionList collections={collections || []} />
      </div>

    </main>
  )
}