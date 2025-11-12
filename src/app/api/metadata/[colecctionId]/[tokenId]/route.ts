import { createClient } from '@supabase/supabase-js' // ¡Importamos el cliente JS estándar!
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

// 1. Creamos un cliente de Supabase (público) usando las variables de entorno
//    Esto es seguro porque nuestra política RLS protege los datos.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * Esta es la API PÚBLICA de Metadatos.
 * Es la que las wallets y mercados de NFT (como OpenSea)
 * llamarán para saber qué imagen y nombre tiene un NFT.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { collectionId: string; tokenId: string } }
) {
  const { collectionId, tokenId } = params

  // 1. Buscamos la colección en la base de datos
  //    (Esto usa la política RLS de "Lectura Pública" que creamos)
  const { data: collection, error } = await supabase
    .from('collections')
    .select('name, description, image_url') // Solo pedimos los datos que necesitamos
    .eq('id', collectionId)
    .single()

  // 2. Si la colección no existe (o no tiene imagen), devolvemos un error
  if (error || !collection || !collection.image_url) {
    console.error('Error de metadatos:', error?.message || 'Colección o imagen no encontrada')
    return NextResponse.json({ error: 'Metadatos no encontrados' }, { status: 404 })
  }

  // 3. ¡Éxito! Construimos el JSON de Metadatos (Estándar de OpenSea)
  //    Aquí le decimos a la wallet: "El nombre es 'Colección #1',
  //    la descripción es '...', y la IMAGEN es la que el usuario subió".
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

  // 4. Devolvemos el archivo JSON
  return NextResponse.json(metadata)
}