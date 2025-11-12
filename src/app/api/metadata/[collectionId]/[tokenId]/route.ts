import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'
// ¡NUEVA IMPORTACIÓN! La herramienta para manejar zonas horarias
import { formatInTimeZone } from 'date-fns-tz'

// 1. Creamos el cliente de Supabase (público)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// 2. Definimos las "props" que Next.js 16 pasa
interface MetadataApiProps {
  params: Promise<{ collectionId: string; tokenId: string }>
}

/**
 * Esta es la API PÚBLICA de Metadatos.
 * ¡AHORA ES DINÁMICA!
 */
export async function GET(
  request: NextRequest,
  { params }: MetadataApiProps
) {
  
  // 3. "Desenvolvemos" la promesa (la lección aprendida)
  const { collectionId, tokenId } = await params

  // 4. Buscamos la colección en la base de datos
  const { data: collection, error } = await supabase
    .from('collections')
    .select('name, description, image_url')
    .eq('id', collectionId)
    .single()

  // 5. Si la colección no existe o no tiene imagen, 404
  if (error || !collection || !collection.image_url) {
    console.error('Error de metadatos:', error?.message || 'Colección o imagen no encontrada')
    return NextResponse.json({ error: 'Metadatos no encontrados' }, { status: 404 })
  }

  // --- ¡AQUÍ ESTÁ LA NUEVA LÓGICA DINÁMICA! ---
  
  // 6. Definimos la zona horaria del negocio (¡la tuya!)
  //    'America/Mazatlan' es la zona horaria de Culiacán.
  const timeZone = 'America/Mazatlan'
  
  // 7. Obtenemos la hora actual EN ESA ZONA HORARIA
  //    (Usamos 'H' para formato de 24 horas: 0 a 23)
  const currentHour = parseInt(formatInTimeZone(new Date(), timeZone, 'H'))

  // 8. Definimos la lógica de negocio: "Happy Hour" es de 5 PM a 7 PM
  //    (17:00 a 18:59)
  const isHappyHour = (currentHour >= 17 && currentHour < 19)
  
  // 9. Construimos los metadatos base
  const metadata = {
    name: `${collection.name} #${tokenId}`,
    description: collection.description || 'Un NFT de lealtad especial',
    image: collection.image_url, // La imagen principal
    attributes: [
      {
        "trait_type": "Tipo",
        "value": "Lealtad"
      }
    ]
  }

  // 10. ¡Añadimos el atributo DINÁMICO!
  if (isHappyHour) {
    metadata.attributes.push({
      "trait_type": "Estado",
      "value": "¡Happy Hour Activo!"
    })
    // (En el futuro, podríamos incluso cambiar la 'metadata.image'
    //  a una imagen "verde" o "brillante")
  } else {
    metadata.attributes.push({
      "trait_type": "Estado",
      "value": "Inactivo"
    })
  }
  // --- FIN DE LA LÓGICA DINÁMICA ---

  // 11. Devolvemos el archivo JSON (que ahora es dinámico)
  return NextResponse.json(metadata)
}