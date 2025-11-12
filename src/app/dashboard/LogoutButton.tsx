// Le decimos a Next.js que este es un Componente de Cliente
'use client'

import { createClient } from '@/lib/supabase/client' // Cliente de NAVEGADOR
import { useRouter } from 'next/navigation'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline' // Un icono bonito

export default function LogoutButton() {
  const router = useRouter()

  // Esta es la función que se ejecuta al hacer clic
  const handleLogout = async () => {
    // Creamos un cliente de Supabase (del navegador)
    const supabase = createClient()

    // ¡La magia! Le decimos a Supabase que cierre la sesión
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error al cerrar sesión:', error.message)
      // (En un producto real, mostraríamos un "toast" de error)
    }

    // Haya o no error, forzamos la redirección a la página de login
    // y refrescamos la app para limpiar cualquier estado.
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-x-2 text-sm text-red-500 hover:text-red-700 hover:underline"
    >
      <ArrowRightOnRectangleIcon className="h-4 w-4" />
      Cerrar Sesión
    </button>
  )
}