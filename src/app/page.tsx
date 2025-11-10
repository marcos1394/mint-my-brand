import Link from 'next/link';
import { CheckCircleIcon, ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  return (
    // Hemos cambiado el "main" para que no centre todo,
    // ya que ahora tendremos múltiples secciones.
    <main className="flex min-h-screen flex-col items-center">
      
      {/* ----------------- */}
      {/* Hero Section     */}
      {/* ----------------- */}
      <section className="flex w-full items-center justify-center p-8 lg:p-24 bg-white">
        <div className="z-10 w-full max-w-5xl items-center justify-center text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block">La Lealtad de Clientes,</span>
            <span className="block text-blue-600">Re-imaginada.</span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-600 sm:text-xl md:text-2xl">
            Lanza tu programa de lealtad NFT en 10 minutos. Conéctate con los 110 millones de usuarios de Coinbase a través de Base.
          </p>
          
          <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
            <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5">
              <Link
                href="httpss://buy.stripe.com/tu-link-de-pago-aqui" // Placeholder
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
      </section>

      {/* ----------------- */}
      {/* Problem Section  */}
      {/* ----------------- */}
      {/* ----------------- */}
      {/* Problem Section  */}
      {/* ----------------- */}
      <section className="w-full bg-gray-50 py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          
          {/* Encabezado de la sección */}
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Tus programas de lealtad actuales no funcionan
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Estás perdiendo clientes (y dinero) por culpa de métodos anticuados.
            </p>
          </div>
          
          {/* Lista de problemas */}
          <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
            
            {/* Problema 1: Tarjetas de Sellos */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600">
                {/* Usamos el icono importado */}
                <CheckCircleIcon className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Tarjetas de Sellos</h3>
              <p className="mt-2 text-base text-gray-600">
                Se pierden, se rompen o terminan en la basura. Tienen cero valor percibido y no crean una comunidad.
              </p>
            </div>
            
            {/* Problema 2: Listas de Email */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600">
                {/* Usamos el icono importado */}
                <ArrowPathIcon className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Listas de Email</h3>
              <p className="mt-2 text-base text-gray-600">
                Tus correos de descuentos se van a la carpeta de 'Promociones'. Tienes suerte si consigues un 10% de apertura.
              </p>
            </div>

            {/* Problema 3: Desconexión */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600">
                {/* Usamos el icono importado */}
                <ExclamationTriangleIcon className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Desconexión</h3>
              <p className="mt-2 text-base text-gray-600">
                Es imposible hacer que tus mejores clientes se sientan *realmente* especiales y recompensar su lealtad de forma tangible.
              </p>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}