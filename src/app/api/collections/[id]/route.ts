import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { type NextRequest } from 'next/server'

/**
 * API para ACTUALIZAR (PATCH) una colección existente
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } } // Next.js nos pasa el [id] de la URL
) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // 1. Verificar que el usuario esté autenticado
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  // 2. Obtener los datos del formulario (el 'id' viene de params)
  const { name, description } = await request.json()
  const collectionId = params.id

  if (!name) {
    return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })
  }

  console.log(`[API UPDATE] Solicitud para actualizar colección: ${collectionId}`)

  // 3. ¡LA MAGIA DE SEGURIDAD!
  //    Actualizamos la fila en la base de datos SÓLO SI
  //    el 'id' coincide Y el 'user_id' coincide con el del usuario logueado.
  const { data: updatedCollection, error: updateError } = await supabase
    .from('collections')
    .update({
      name: name,
      description: description,
      // (No actualizamos el 'slug' por ahora, eso es más complejo)
    })
    .eq('id', collectionId)    // Cláusula 1: El ID debe coincidir
    .eq('user_id', user.id)   // Cláusula 2: ¡El dueño debe coincidir!
    .select()                 // Devuélveme la fila actualizada
    .single()

  if (updateError) {
    console.error('Error al actualizar colección:', updateError.message)
    // Si 'updatedCollection' es nulo, significa que RLS falló
    // (el usuario no es el dueño o el ID no existe)
    return NextResponse.json({ error: `Error de base de datos: ${updateError.message}` }, { status: 500 })
  }

  // 4. ¡Éxito! Devolver la colección actualizada
  return NextResponse.json(updatedCollection)
}