import { createClient } from '@/lib/supabase/server' // ¡Cliente de Servidor!
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  // Creamos un cliente de Supabase (de servidor) para esta página
  const supabase = createClient()

  // Obtenemos los datos del usuario que está en la sesión (cookie)
  const { data, error } = await supabase.auth.getUser()

  // ¡ESTA ES LA MAGIA DE LA SEGURIDAD!
  // Si hay un error O no hay un usuario, significa que no ha iniciado sesión.
  // Lo redirigimos a la página de login.
  if (error || !data?.user) {
    redirect('/login')
  }

  // Si llegamos aquí, el usuario SÍ está autenticado.
  // Mostramos su página de dashboard.
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="text-center">
        <h1 className="text-3xl font-bold">¡Bienvenido a tu Dashboard!</h1>
        <p className="mt-4 text-lg text-gray-700">
          Has iniciado sesión correctamente.
        </p>
        <p className="mt-2 text-gray-500">
          Tu email es: <span className="font-medium text-blue-600">{data.user.email}</span>
        </p>

        <p className="mt-8 text-sm text-gray-400">
          (Pronto aquí podrás crear tus colecciones de NFTs)
        </p>

        {/* TODO: Crear un botón de Logout */}
        <Link href="/" className="mt-4 inline-block text-blue-500 hover:underline">
          Volver a la Home (temporal)
        </Link>
      </div>
    </main>
  )
}