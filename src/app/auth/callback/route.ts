// src/app/auth/callback/route.ts
// ¡ESTE CÓDIGO ESTÁ CORRECTO Y LO SEGUIMOS NECESITANDO!

import { createClient } from '@/lib/supabase/server' // Cliente de Servidor
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    const supabase = createClient()
    // ¡Esta función maneja el 'code' de Google Y del Magic Link!
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirigir al usuario al Dashboard después del login
  return NextResponse.redirect(`${origin}/dashboard`)
}