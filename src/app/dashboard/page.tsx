import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CreateCollectionForm from './create-collection-form'
import CollectionList from './collection-list'
import { cookies } from 'next/headers' // ¡NUEVO! Importamos cookies

export default async function DashboardPage() {
  
  // ¡LA CORRECCIÓN!
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  const { data: collections } = await supabase
    .from('collections')
    .select('*')
    .order('created_at', { ascending: false })

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
        {/* Este componente ya usa la API, así que no necesita el 'user' */}
        <CreateCollectionForm />
      </div>

      <div className="mt-10 w-full max-w-4xl">
        <CollectionList collections={collections || []} />
      </div>

    </main>
  )
}