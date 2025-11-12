import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { type NextRequest } from 'next/server'

/**
 * API para REGISTRAR UNA ACCIÓN (ej. "una visita")
 * Esta API es "privada" y solo puede ser llamada
 * por un usuario autenticado (el dueño del negocio).
 */
export async function POST(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // 1. Verificar que el usuario (dueño del negocio) esté autenticado
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  // 2. Obtener los datos de la "caja registradora"
  //    - ¿Para qué colección es?
  //    - ¿Para qué cliente (wallet) es?
  const { collectionId, userAddress } = await request.json()

  // 3. Validar la entrada
  if (!collectionId) {
    return NextResponse.json({ error: 'Falta el ID de la colección.' }, { status: 400 })
  }
  if (!userAddress || !userAddress.startsWith('0x')) {
    return NextResponse.json({ error: 'La dirección del cliente no es válida.' }, { status: 400 })
  }

  console.log(`[API ACTIVITY] Registrando 'visit' para ${userAddress} en col. ${collectionId}`)

  // 4. ¡LA MAGIA DE RLS!
  //    Insertamos la nueva "visita" en la libreta de contabilidad.
  //    La Política RLS que escribimos en la base de datos
  //    AUTOMÁTICAMENTE comprobará si 'user.id' (el dueño)
  //    es el propietario de 'collectionId'.
  //    Si no lo es, Supabase devolverá un error. ¡Seguridad automática!
  const { data: newActivity, error: insertError } = await supabase
    .from('activity_log')
    .insert({
      collection_id: collectionId,
      user_address: userAddress,
      // 'action_type' usará el valor por defecto ('visit')
    })
    .select() // Devuélveme la fila que acabas de crear
    .single()

  if (insertError) {
    console.error('Error al registrar actividad:', insertError.message)
    // Este error se disparará si RLS falla (ej. "no eres el dueño")
    return NextResponse.json({ error: `Error de base de datos: ${insertError.message}` }, { status: 500 })
  }

  // 5. ¡Éxito! Devolver el registro de la actividad
  return NextResponse.json(newActivity)
}