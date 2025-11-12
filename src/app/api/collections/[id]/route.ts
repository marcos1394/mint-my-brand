import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { type NextRequest } from 'next/server'

// 1. Definimos las "props" que Next.js 16 pasa
//    ¡'params' es una Promesa!
interface ApiRouteProps {
  params: Promise<{ id: string }>
}

/**
 * API para ACTUALIZAR (PATCH) una colección existente
 */
export async function PATCH(
  request: NextRequest,
  { params }: ApiRouteProps // 2. Usamos nuestra nueva interface
) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // 1. Verificar que el usuario esté autenticado
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  // 3. ¡LA CORRECCIÓN! "Desenvolvemos" la promesa
  const { id: collectionId } = await params

  // 4. Obtener los datos del formulario
  const { name, description } = await request.json()
  if (!name) {
    return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })
  }

  console.log(`[API UPDATE] Solicitud para actualizar colección: ${collectionId}`)

  // 5. ¡LA MAGIA DE SEGURIDAD!
  //    Actualizamos la fila SÓLO SI el 'id' y el 'user_id' coinciden.
  const { data: updatedCollection, error: updateError } = await supabase
    .from('collections')
    .update({
      name: name,
      description: description,
    })
    .eq('id', collectionId)    // ¡Usamos el 'collectionId' desenvuelto!
    .eq('user_id', user.id)   // ¡El dueño debe coincidir!
    .select()                 
    .single()

  if (updateError) {
    console.error('Error al actualizar colección:', updateError.message)
    return NextResponse.json({ error: `Error de base de datos: ${updateError.message}` }, { status: 500 })
  }

  // 6. ¡Éxito! Devolver la colección actualizada
  return NextResponse.json(updatedCollection)
}