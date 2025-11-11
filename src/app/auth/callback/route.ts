import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  
  console.log('\n--- INICIO DE AUTH CALLBACK (v6 - Leyendo X-Forwarded-Host) ---')
  
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  // --- LA CORRECCIÓN DE "PROXY" (v6) ---
  
  // 1. Intentamos leer el header 'x-forwarded-host' que pone el proxy.
  //    Este DEBERÍA ser la URL pública real (ej: ...-443.app.github.dev)
  let rawHost = request.headers.get('x-forwarded-host')
  console.log('1. Host de "x-forwarded-host":', rawHost)

  // 2. Si no existe, volvemos a nuestro plan B (el header 'host')
  if (!rawHost) {
    rawHost = request.headers.get('host')
    console.log('2. "x-forwarded-host" no encontrado. Usando "host":', rawHost)
  }

  // 3. ¡LA LÓGICA COMBINADA (Anti-errores)!
  
  //    a. Nos aseguramos de que no sea nulo
  const hostnameWithPort = rawHost || 'localhost' 
  
  //    b. Le quitamos el puerto (ej: 'localhost:3000' -> 'localhost')
  const hostnameNoPort = hostnameWithPort.split(':')[0]
  
  //    c. ¡Aplicamos TU LÓGICA! (ej: '...-443...' -> '...-3000...')
  const cleanHostname = hostnameNoPort.replace('-443', '-3000')

  console.log('3. Hostname Limpio Final (después de split y replace):', cleanHostname)

  // 4. Construimos el origin limpio
  const origin = `${url.protocol}//${cleanHostname}`
  console.log('4. Origin Final (limpio):', origin)
  
  // --- FIN DE LA CORRECIÓN ---

  if (code) {
    const supabase = createClient()
    await supabase.auth.exchangeCodeForSession(code)
    console.log('5. Sesión de Supabase intercambiada.')
  } else {
    console.log('5. No se encontró "code" en la URL.')
  }

  // 6. Redirigimos al Dashboard usando el origin LIMPIO
  console.log('6. Redirigiendo a:', `${origin}/dashboard`)
  console.log('--- FIN DE AUTH CALLBACK ---\n')
  
  return NextResponse.redirect(`${origin}/dashboard`)
}