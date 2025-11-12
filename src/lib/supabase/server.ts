import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers' // Importamos 'cookies' para obtener su TIPO

/**
 * Esta función crea un cliente de Supabase para el SERVIDOR.
 * AHORA ACEPTA el 'cookieStore' como un argumento,
 * lo cual es un patrón más robusto y profesional.
 */
export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            (await cookieStore).set({ name, value, ...options })
          } catch (error) {
            // El 'set' puede fallar en ciertos contextos (ej. Server Actions)
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            (await cookieStore).set({ name, value: '', ...options })
          } catch (error) {
            // El 'remove' (que es un 'set') también puede fallar
          }
        },
      },
    }
  )
}