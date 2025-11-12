import type { NextConfig } from 'next'

// Definimos nuestra configuración
const nextConfig: NextConfig = {
  
  // 1. La configuración de 'images' (¡ESTO SÍ ES CORRECTO!)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'btzaftdavzsfhklajkyz.supabase.co',
        port: '',
        pathname: '**',
      },
    ],
  },

  // 2. ¡ELIMINAMOS EL BLOQUE 'proxy' DE AQUÍ!
  //    Mi instrucción anterior fue incorrecta.
}

// Exportamos la configuración
export default nextConfig