// Importamos el tipo 'NextConfig' de Next.js
import type { NextConfig } from 'next'

// Definimos nuestra configuración y le asignamos el tipo 'NextConfig'
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'btzaftdavzsfhklajkyz.supabase.co', // ¡Este es tu hostname!
        port: '',
        pathname: '**', // Permitimos cualquier ruta dentro de ese hostname
      },
    ],
  },
}

// Exportamos la configuración
export default nextConfig