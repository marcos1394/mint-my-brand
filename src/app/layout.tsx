import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// 1. Importamos nuestro (futuro) componente de Proveedores
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mint-My-Brand',
  description: 'Crea programas de lealtad NFT sin código.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* 2. Envolvemos toda la aplicación con los Proveedores */}
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}