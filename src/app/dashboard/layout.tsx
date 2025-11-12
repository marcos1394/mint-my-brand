import { createClient } from '@/lib/supabase/server' // Cliente de Servidor
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import LogoutButton from './LogoutButton' // ¡Importamos nuestro botón de cliente!
import React from 'react'

/**
 * Este es el Layout para TODA la sección del Dashboard.
 * Es un "Componente de Servidor" (Server Component).
 * Su trabajo es:
 * 1. Proteger toda la sección (¡Seguridad Centralizada!).
 * 2. Renderizar un Navbar/Menú persistente.
 * 3. Renderizar la página "hija" (ej. page.tsx o collections/[id]/page.tsx).
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  // --- 1. ¡SEGURIDAD CENTRALIZADA! ---
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    // Si no está logueado, lo echamos de CUALQUIER página del dashboard.
    // (ej. /dashboard, /dashboard/collections/123, etc.)
    redirect('/login')
  }

  // --- 2. RENDERIZADO DEL LAYOUT ---
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* --- Navbar Persistente --- */}
      {/* Es 'sticky' (pegajoso) para una mejor UX */}
      <header className="bg-white shadow-sm border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="mx-auto max-w-4xl flex justify-between items-center px-4 sm:px-0">
          
          {/* Logo/Nombre del Dashboard */}
          <Link href="/dashboard" className="font-semibold text-lg text-gray-800 hover:text-blue-600">
            Mint-My-Brand
          </Link>
          
          {/* Perfil de Usuario y Botón de Logout */}
          <div className="flex items-center gap-x-4">
            <span className="text-sm text-gray-500 hidden sm:block">
              {user.email} 
            </span>
            {/* ¡Aquí está nuestro botón! */}
            <LogoutButton /> 
          </div>
          
        </div>
      </header>

      {/* --- Contenido de la Página "Hija" --- */}
      <main className="mx-auto max-w-4xl py-8 px-4 sm:px-0">
        {/* Aquí es donde Next.js renderizará la página específica (ej. page.tsx) */}
        {children}
      </main>
      
    </div>
  )
}