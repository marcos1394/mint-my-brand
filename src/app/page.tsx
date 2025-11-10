import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 lg:p-24">
      {/* Contenedor principal de la Hero Section */}
      <div className="z-10 w-full max-w-5xl items-center justify-center text-center">
        
        {/* Encabezado Principal (H1) */}
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="block">La Lealtad de Clientes,</span>
          <span className="block text-blue-600">Re-imaginada.</span>
        </h1>
        
        {/* Sub-encabezado */}
        <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-600 sm:text-xl md:text-2xl">
          Lanza tu programa de lealtad NFT en 10 minutos. Conéctate con los 110 millones de usuarios de Coinbase a través de Base.
        </p>
        
        {/* Call to Action (CTA) y Mensaje Secundario */}
        <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
          <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5">
            
            {/* Botón de Pago (Enlazará a Stripe) */}
            <Link
              href="https://buy.stripe.com/tu-link-de-pago-aqui" // ¡Importante: Esto es un placeholder!
              className="flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-8 py-3 text-lg font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Comenzar (Acceso Anticipado)
            </Link>
            
            <p className="text-sm text-gray-500">
              Sin código. Sin "gas". Sin complejidad.
            </p>
            
          </div>
        </div>
        
      </div>
    </main>
  );
}