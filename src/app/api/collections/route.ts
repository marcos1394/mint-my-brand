import { createClient } from '@/lib/supabase/server' // Cliente de Servidor
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Un "slug" es una versión de un texto para URLs (ej: "Mi Café" -> "mi-cafe")
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/\s+/g, '-') // Reemplaza espacios con -
    .replace(/[^\w-]+/g, '') // Quita caracteres especiales
    .replace(/--+/g, '-') // Reemplaza múltiples - con uno solo
    .replace(/^-+/, '') // Quita - del inicio
    .replace(/-+$/, '') // Quita - del final

/**
 * API para CREAR una nueva colección (solo la fila en Supabase)
 * Esto es el "Paso A" (Web2) - Rápido
 */
export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // 1. Verificar que el usuario esté autenticado
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  // 2. Obtener los datos del formulario
  const { name, description } = await request.json()
  if (!name) {
    return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })
  }

  // 3. Generar el 'slug' (podríamos añadir aleatoriedad para hacerlo único)
  const slug = slugify(name)

  // 4. Insertar la nueva fila en la base de datos
  const { data: newCollection, error: insertError } = await supabase
    .from('collections')
    .insert({
      user_id: user.id,
      name: name,
      description: description,
      slug: slug,
      // 'contract_address' se queda en NULL por ahora
    })
    .select() // ¡Devuélveme la fila que acabas de crear!
    .single()

  if (insertError) {
    console.error('Error al insertar colección:', insertError.message)
    return NextResponse.json({ error: `Error de base de datos: ${insertError.message}` }, { status: 500 })
  }

  // 5. ¡Éxito! Devolver la colección recién creada
  return NextResponse.json(newCollection)
}