import { createClient } from '@/lib/supabase/server' // ¡Cliente de Servidor!
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CreateCollectionForm from './create-collection-form' // ¡IMPORTAMOS EL NUEVO FORMULARIO!

export default async function DashboardPage() {
  // 1. Creamos cliente de servidor
  const supabase = createClient()

  // 2. Obtenemos los datos del usuario
  const { data, error } = await supabase.auth.getUser()

  // 3. ¡Seguridad! Si no hay usuario, lo mandamos al login.
  if (error || !data?.user) {
    redirect('/login')
  }

  // 4. Si llegamos aquí, el usuario SÍ está autenticado.
  return (
    <main className="flex min-h-screen flex-col items-center p-8 lg:p-12">

      <div className="flex w-full max-w-4xl justify-between">
        <div className="text-left">
          <h1 className="text-2xl font-bold">Tu Dashboard</h1>
          <p className="mt-1 text-gray-500">
            Bienvenido, <span className="font-medium text-blue-600">{data.user.email}</span>
          </p>
        </div>

        {/* TODO: Crear un botón de Logout real */}
        <Link href="/" className="text-sm text-blue-500 hover:underline">
          Volver a la Home
        </Link>
      </div>

      <div className="mt-10 w-full max-w-4xl">
        {/* 5. ¡AQUÍ ESTÁ LA MAGIA! */}
        {/* Renderizamos el formulario (Cliente) dentro de la página (Servidor) */}
        {/* y le pasamos los datos del usuario para la seguridad. */}
        <CreateCollectionForm user={data.user} />
      </div>

      {/* Aquí es donde irá la lista de colecciones existentes en el futuro */}
      <div className="mt-10 w-full max-w-4xl">
        {/* <CollectionList /> */}
      </div>

    </main>
  )
}