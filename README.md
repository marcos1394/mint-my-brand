# Mint-My-Brand 🚀

Un SaaS B2B que permite a cualquier negocio lanzar programas de lealtad basados en NFTs en la red Base, sin necesidad de código.

## Descripción

Este proyecto es una plataforma web (SaaS) que resuelve la complejidad de la adopción de Web3 para negocios. Permite a los dueños de negocios (restaurantes, tiendas, creadores) crear y distribuir "activos digitales de lealtad" (NFTs) a sus clientes.

El sistema se encarga de:
* Creación de la colección de NFTs (ERC-721).
* Una página de "reclamo" (minting) pública para los clientes finales.
* Patrocinio de transacciones ("gasless") para que el cliente final no pague nada.

---

## 🛠️ Stack Tecnológico

* **Framework:** Next.js (App Router)
* **Lenguaje:** TypeScript
* **Estilos:** Tailwind CSS
* **Blockchain:** Base (EVM L2)
* **Contratos:** Solidity (Hardhat)
* **Pagos:** Stripe
* **Despliegue:** Vercel

---

## 🚀 Cómo Empezar

Este proyecto está configurado para usar Codespaces. Simplemente abre un Codespace desde la rama `develop` o una rama de `feature`.

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```

2.  **Ejecutar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

3.  Abre `http://localhost:3000` en tu navegador.

---

## 🌐 Despliegue

El despliegue se maneja automáticamente a través de Vercel:

* **Pushes a `feature/*`:** Crean un despliegue de "Preview" único.
* **Merges a `develop`:** Despliegan al entorno de "Staging".
* **Merges a `main`:** Despliegan a "Producción" (el sitio en vivo).