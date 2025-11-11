// Importamos la función correcta DESDE EL PAQUETE CORRECTO
import { createBrowserClient } from '@supabase/ssr'

// Esta función crea un cliente de Supabase para el NAVEGADOR
export const createClient = () =>
  createBrowserClient(
    // Y (qué ironía), esta versión SÍ espera dos strings separados,
    // no un objeto.
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )