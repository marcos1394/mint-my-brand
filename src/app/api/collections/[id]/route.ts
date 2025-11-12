import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { type NextRequest } from 'next/server'

// 1. Definimos las "props" que Next.js 16 pasa
//    ¡'params' es una Promesa!
interface ApiRouteProps {
  params: Promise<{ id: string }>
}


// ===================================================================
// MÉTODO PATCH (Actualizar) - (Este código ya lo teníamos)
// ===================================================================
export async function PATCH(
  request: NextRequest,
  { params }: ApiRouteProps // Usamos nuestra interface
) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // 1. Verificar que el usuario esté autenticado
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  // 2. "Desenvolvemos" la promesa
  const { id: collectionId } = await params

  // 3. Obtener los datos del formulario
  const { name, description } = await request.json()
  if (!name) {
    return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })
  }

  console.log(`[API UPDATE] Solicitud para actualizar colección: ${collectionId}`)

  // 4. ¡LA MAGIA DE SEGURIDAD!
  //    Actualizamos la fila SÓLO SI el 'id' y el 'user_id' coinciden.
  const { data: updatedCollection, error: updateError } = await supabase
    .from('collections')
    .update({
      name: name,
      description: description,
    })
    .eq('id', collectionId)    // Cláusula 1: El ID debe coincidir
    .eq('user_id', user.id)   // Cláusula 2: ¡El dueño debe coincidir!
    .select()                 
    .single()

  if (updateError) {
    console.error('Error al actualizar colección:', updateError.message)
    return NextResponse.json({ error: `Error de base de datos: ${updateError.message}` }, { status: 500 })
  }

  // 5. ¡Éxito! Devolver la colección actualizada
  return NextResponse.json(updatedCollection)
}


// ===================================================================
// ¡NUEVO! MÉTODO DELETE (Borrar)
// ===================================================================
export async function DELETE(
  request: NextRequest,
  { params }: ApiRouteProps // Usamos la misma interface
) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // 1. Verificar que el usuario esté autenticado
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  // 2. "Desenvolvemos" la promesa
  const { id: collectionId } = await params

  console.log(`[API DELETE] Solicitud para BORRAR colección: ${collectionId}`)

  // 3. ¡LA MAGIA DE SEGURIDAD!
  //    Borramos la fila SÓLO SI el 'id' y el 'user_id' coinciden.
  //    RLS (Row Level Security) en Supabase ya nos protege,
  //    pero esta es una "defensa en profundidad" explícita.
  const { error: deleteError } = await supabase
    .from('collections')
    .delete()
    .eq('id', collectionId)    // Cláusula 1: El ID debe coincidir
    .eq('user_id', user.id)   // Cláusula 2: ¡El dueño debe coincidir!

  if (deleteError) {
    console.error('Error al borrar colección:', deleteError.message)
    return NextResponse.json({ error: `Error de base de datos: ${deleteError.message}` }, { status: 500 })
  }

  // 4. ¡Éxito! Devolver un mensaje de éxito
  return NextResponse.json({ success: true, message: 'Colección borrada exitosamente' })
}