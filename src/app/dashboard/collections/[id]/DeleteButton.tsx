// Marcamos como "Componente de Cliente"
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
// ¡Importamos las herramientas de Modal de Headless UI!
import { Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Fragment } from 'react' // Para 'Transition'

// Definimos las "props" que recibirá
interface DeleteButtonProps {
  collectionId: string
  collectionName: string
}

export default function DeleteButton({ collectionId, collectionName }: DeleteButtonProps) {
  const router = useRouter()
  
  // ¡NUEVO! Estado para controlar si el modal está abierto o cerrado
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // --- Funciones del Modal ---
  function closeModal() {
    setIsOpen(false)
  }
  function openModal() {
    setIsOpen(true)
    setError(null) // Limpiamos errores al abrir
  }

  // --- Función de Borrado (se llama DESDE el modal) ---
  const handleDelete = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Llamamos a la API de "DELETE" que creamos
      const response = await fetch(`/api/collections/${collectionId}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Algo salió mal.')
      }

      // ¡ÉXITO!
      closeModal() // Cerramos el modal
      
      // ¡Refrescamos y Redirigimos!
      // Redirigimos al usuario de vuelta al Dashboard principal
      router.push('/dashboard')
      // Forzamos un refresco para que la lista de colecciones se actualice
      router.refresh() 

    } catch (error: any) {
      console.error('Error al borrar:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* --- 1. El Botón "Gatillo" --- */}
      {/* Este es el botón que el usuario ve en la página */}
      <button
        type="button"
        onClick={openModal} // Al hacer clic, ABRE el modal
        className="w-full justify-center rounded-md border border-red-600 px-4 py-2 font-medium text-red-600 shadow-sm hover:bg-red-50 disabled:opacity-50"
      >
        Borrar Colección
      </button>

      {/* --- 2. El Modal (Pop-up) de Confirmación --- */}
      {/* Esto usa los componentes de Headless UI */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-4 text-left">
                      <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        Borrar Colección
                      </DialogTitle>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          ¿Estás absolutamente seguro? Esta acción es irreversible.
                          Se borrará la colección <strong className="text-gray-900">{collectionName}</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mensaje de Error (si la API falla) */}
                  {error && (
                    <div className="mt-4 rounded-md bg-red-50 p-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      disabled={isLoading}
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={handleDelete} // ¡Llama a la API DELETE!
                    >
                      {isLoading ? 'Borrando...' : 'Sí, borrar'}
                    </button>
                    <button
                      type="button"
                      disabled={isLoading}
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={closeModal}
                    >
                      Cancelar
                    </button>
                  </div>
                </DialogPanel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}