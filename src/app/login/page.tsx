// Marcamos como "client component" porque es interactivo
'use client'

import { createClient } from '@/lib/supabase/client' // Importamos nuestra "herramienta" de cliente
import { useState } from 'react'
import { HiOutlineMail } from 'react-icons/hi' // Un icono de email

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Esta es la nueva función que se ejecuta al enviar el formulario
  const handleSignInWithMagicLink = async (event: React.FormEvent) => {
    event.preventDefault() // Prevenimos que la página se recargue
    setIsLoading(true)
    setMessage('')
    
    const supabase = createClient()
    
    // ¡Esta es la función clave de Magic Link!
    const { error } = await supabase.auth.signInWithOtp({
      email: email, // El email que el usuario escribió
      options: {
        // La URL a la que el usuario será enviado DESPUÉS
        // de hacer clic en el link de su correo.
        // ¡Aquí es donde nuestro 'callback' entra en acción!
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })

    setIsLoading(false)

    if (error) {
      setMessage('Error: No se pudo enviar el link. Intenta de nuevo.')
      console.error(error)
    } else {
      setMessage('¡Revisa tu correo! Te hemos enviado un link mágico para iniciar sesión.')
      setEmail('')
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="flex w-full max-w-sm flex-col items-center space-y-6 rounded-lg border border-gray-200 p-8 shadow-lg">
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Bienvenido a Mint-My-Brand
          </h1>
          <p className="mt-2 text-gray-500">
            Ingresa tu email para iniciar sesión o registrarte.
          </p>
        </div>

        {/* Formulario de Email */}
        <form className="w-full space-y-4" onSubmit={handleSignInWithMagicLink}>
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <HiOutlineMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-3 font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Enviando...' : 'Enviar link mágico'}
          </button>
        </form>

        {/* Mensaje de éxito o error */}
        {message && (
          <p className="text-center text-sm text-gray-600">{message}</p>
        )}
      </div>
    </main>
  )
}