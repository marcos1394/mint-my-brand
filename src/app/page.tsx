import Link from 'next/link';
// Importamos los iconos que usaremos
import {
  CheckCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  GiftIcon,
  BuildingStorefrontIcon, 
  UsersIcon, 
  TicketIcon,  // Icono para la sección de solución
} from '@heroicons/react/24/outline';

export default function HomePage() {
  return (
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
      <section className="w-full bg-gray-50 py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Tus programas de lealtad actuales no funcionan
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Estás perdiendo clientes (y dinero) por culpa de métodos anticuados.
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
            
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600">
                <CheckCircleIcon className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Tarjetas de Sellos</h3>
              <p className="mt-2 text-base text-gray-600">
                Se pierden, se rompen o terminan en la basura. Tienen cero valor percibido y no crean una comunidad.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600">
                <ArrowPathIcon className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Listas de Email</h3>
              <p className="mt-2 text-base text-gray-600">
                Tus correos de descuentos se van a la carpeta de 'Promociones'. Tienes suerte si consigues un 10% de apertura.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600">
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

      {/* ----------------- */}
      {/* Solution Section */}
      {/* ----------------- */}
      <section className="w-full bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            
            {/* Icono de la Solución */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <SparklesIcon className="h-10 w-10" />
            </div>

            {/* Encabezado de la sección */}
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Presentamos Mint-My-Brand
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              El "Shopify" para Activos Digitales de Lealtad.
            </p>

            {/* Párrafo de la Solución */}
            <p className="mt-6 max-w-2xl text-xl text-gray-700">
              Transforma tus descuentos, cupones y membresías en{" "}
              <span className="font-semibold text-gray-900">
                activos digitales únicos (NFTs)
              </span>{" "}
              que tus clientes <span className="italic">poseen de verdad</span>.
            </p>
            <p className="mt-4 max-w-2xl text-lg text-gray-600">
              Un NFT no es solo una imagen. Es una{" "}
              <span className="font-semibold text-blue-600">
                llave digital
              </span>{" "}
              a una comunidad exclusiva: la tuya. Tus clientes lo guardan en su
              wallet de Coinbase o MetaMask y se convierte en un símbolo de
              estatus que pueden presumir.
            </p>

          </div>
        </div>
      </section>

      {/* ----------------- */}
      {/* How It Works     */}
      {/* ----------------- */}
      <section className="w-full bg-gray-50 py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          
          {/* Encabezado */}
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Listo para lanzar en 3 simples pasos
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Olvídate de la complejidad de "blockchain". Esto es tan fácil como crear un post de Instagram.
            </p>
          </div>

          {/* Pasos */}
          <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
            
            {/* Paso 1: Diseña */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <PencilSquareIcon className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">1. Diseña</h3>
              <p className="mt-2 text-base text-gray-600">
                Inicia sesión en tu dashboard. Sube tu imagen, ponle un nombre ("NFT Fundador") y describe sus beneficios ("15% de descuento siempre").
              </p>
            </div>

            {/* Paso 2: Publica */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <PaperAirplaneIcon className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">2. Publica</h3>
              <p className="mt-2 text-base text-gray-600">
                Genera tu página de reclamo pública con un solo clic. Obtendrás un link único (ej. `app.com/c/tucafe`) para compartir.
              </p>
            </div>

            {/* Paso 3: Comparte */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <GiftIcon className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">3. Comparte</h3>
              <p className="mt-2 text-base text-gray-600">
                Envía el link a tus clientes. Ellos conectan su wallet (Coinbase/MetaMask) y reclaman su NFT. **Tú pagas los centavos de 'gas', ellos no pagan nada.**
              </p>
            </div>

          </div>

        </div>
      </section>
      {/* ----------------- */}
      {/* Use Cases Section */}
      {/* ----------------- */}
      <section className="w-full bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          
          {/* Encabezado */}
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              ¿Qué puedes crear?
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Un NFT de lealtad es un "contenedor" para tus ideas.
            </p>
          </div>

          {/* Lista de Casos de Uso */}
          <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">

            {/* Caso 1: E-commerce */}
            <div className="flex flex-col rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <BuildingStorefrontIcon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Para E-commerce y Tiendas</h3>
              <p className="mt-2 text-base text-gray-600">
                Crea el "NFT de Acceso VIP". Otorga acceso anticipado a nuevas colecciones o ventas privadas solo a los que posean el NFT.
              </p>
            </div>

            {/* Caso 2: Cafés y Restaurantes */}
            <div className="flex flex-col rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <TicketIcon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Para Cafés y Restaurantes</h3>
              <p className="mt-2 text-base text-gray-600">
                Lanza el "NFT Fundador". Un club de 100 fans leales que obtienen un 10% de descuento de por vida o un café gratis al mes.
              </p>
            </div>

            {/* Caso 3: Creadores y Comunidades */}
            <div className="flex flex-col rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <UsersIcon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Para Creadores y Comunidades</h3>
              <p className="mt-2 text-base text-gray-600">
                Úsalo como una llave de acceso digital. Da acceso a un canal de Discord privado, a contenido exclusivo o a un evento en Zoom.
              </p>
            </div>

          </div>

          {/* Beneficio Extra */}
          <div className="mt-16 text-center">
            <p className="text-xl font-medium text-gray-900">
              El mejor beneficio: Tus clientes presumen su NFT.
            </p>
            <p className="mt-2 text-lg text-gray-600">
              Se convierte en **marketing orgánico** que ellos hacen por ti.
            </p>
          </div>

        </div>
      </section>

    </main>
  );
}