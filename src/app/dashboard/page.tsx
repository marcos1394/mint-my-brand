import { createClient } from '@/lib/supabase/server'
import CreateCollectionForm from './create-collection-form'
import CollectionList from './collection-list'
import { cookies } from 'next/headers'

export default async function DashboardPage() {
  
  // 1. Solo necesitamos el cliente de Supabase
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  // 2. ¡NO necesitamos getUser()! El layout.tsx ya lo hizo.
  
  // 3. ¡SOLO buscamos las colecciones!
  //    RLS (Row Level Security) en Supabase filtra
  //    automáticamente por el 'user_id' que está en la cookie de sesión.
  //    ¡Esto es magia de seguridad de backend!
  const { data: collections } = await supabase
    .from('collections')
    .select('*')
    .order('created_at', { ascending: false })

  // 4. Renderizamos los componentes hijos.
  return (
    <>
      <div className="w-full max-w-4xl">
        <CreateCollectionForm />
      </div>

      <div className="mt-10 w-full max-w-4xl">
        <CollectionList collections={collections || []} />
      </div>
    </>
  )
}