import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

// 1. Creamos el cliente de Supabase (público)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// 2. Definimos las "props" que Next.js 16 pasa
interface MetadataApiProps {
  params: Promise<{ collectionId: string; tokenId: string }> // ¡LA CLAVE! params es una Promesa
}

export async function GET(
  request: NextRequest,
  { params }: MetadataApiProps // Usamos nuestra nueva interface
) {

  // 3. ¡LA CORRECCIÓN! "Desenvolvemos" la promesa
  const { collectionId, tokenId } = await params

  // 4. Buscamos la colección
  const { data: collection, error } = await supabase
    .from('collections')
    .select('name, description, image_url') // Solo pedimos los datos que necesitamos
    .eq('id', collectionId) // Usamos el 'collectionId' desenvuelto
    .single()

  // 5. Si la colección no existe (o no tiene imagen), devolvemos un error
  if (error || !collection || !collection.image_url) {
    console.error('Error de metadatos:', error?.message || 'Colección o imagen no encontrada')
    return NextResponse.json({ error: 'Metadatos no encontrados' }, { status: 404 })
  }

  // 6. ¡Éxito! Construimos el JSON de Metadatos (Estándar de OpenSea)
  const metadata = {
    name: `${collection.name} #${tokenId}`,
    description: collection.description || 'Un NFT de lealtad especial',
    image: collection.image_url, // ¡La URL pública de Supabase Storage!
    attributes: [
      {
        "trait_type": "Tipo",
        "value": "Lealtad"
      }
    ]
  }

  // 7. Devolvemos el archivo JSON
  return NextResponse.json(metadata)
}