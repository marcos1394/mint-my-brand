import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Esta función crea un cliente de Supabase para el SERVIDOR.
 * Utiliza la función 'cookies()' de Next.js para leer, escribir y eliminar
 * las cookies de autenticación de forma segura en el servidor.
 */
export const createClient = () => {
  // Obtenemos acceso al almacén de cookies del servidor
  const cookieStore = cookies()

  // Creamos y devolvemos el cliente de servidor
  return createServerClient(
    // Usamos las variables de entorno que configuramos en .env.local
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        /**
         * Le decimos al cliente de Supabase cómo LEER las cookies.
         * Lee del almacén de cookies del servidor.
         */
        async get(name: string) {
          return (await cookieStore).get(name)?.value
        },
        /**
         * Le decimos al cliente de Supabase cómo ESCRIBIR las cookies.
         * Escribe en el almacén de cookies del servidor.
         */
        async set(name: string, value: string, options: CookieOptions) {
          try {
            (await cookieStore).set({ name, value, ...options })
          } catch (error) {
            // El 'set' puede fallar si la cookie es muy grande
            // o en un contexto donde no se pueden establecer (ej. Server Actions)
          }
        },
        /**
         * Le decimos al cliente de Supabase cómo BORRAR las cookies.
         * Lo hace estableciendo una cookie vacía con fecha pasada.
         */
        async remove(name: string, options: CookieOptions) {
          try {
            (await cookieStore).set({ name, value: '', ...options })
          } catch (error) {
            // El 'set' (para borrar) también puede fallar
          }
        },
      },
    }
  )
}