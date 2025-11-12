// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// 1. ¡Importamos nuestro "molde" de NFT!
//    Esto le da a la Fábrica acceso al código de MintMyBrand.
import "./MintMyBrand.sol";

/**
 * @title MintMyBrandFactory
 * Este contrato es el "Centro de Despliegue".
 * Su único propósito es desplegar nuevos contratos MintMyBrand (ERC-721)
 * para cada uno de nuestros clientes.
 * También es "Ownable" (Tiene un Dueño) para que solo nuestro backend pueda
 * crear nuevas colecciones.
 */
contract MintMyBrandFactory is Ownable {

    /**
     * @dev Constructor de la Fábrica.
     * Se ejecuta UNA SOLA VEZ cuando desplegamos la Fábrica.
     * Asigna al dueño (nuestra wallet 'deployer') como el
     * "Administrador de la Fábrica".
     */
    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @dev ¡ESTA ES LA FUNCIÓN MÁGICA!
     * Es la que nuestro backend (API) llamará cuando un cliente
     * cree una nueva colección en el dashboard.
     *
     * Es "onlyOwner", por lo que solo nuestro backend puede hacerlo.
     *
     * Retorna la 'address' (dirección) del contrato que acaba de crear.
     */
    function createCollection(
        string memory name,
        string memory symbol,
        string memory baseURI
    ) public onlyOwner returns (address) {
        
        // 2. ¡EL DESPLIEGUE!
        //    Usamos la palabra clave "new" para desplegar una COPIA NUEVA
        //    de nuestro contrato MintMyBrand.
        //    Le pasamos los argumentos que el constructor de MintMyBrand necesita.
        //    Importante: El "dueño" (Owner) del *nuevo contrato de NFT*
        //    será nuestra wallet de servidor, no el cliente.
        MintMyBrand newCollection = new MintMyBrand(
            owner(), // El dueño de la Fábrica (nuestro backend) será el dueño del nuevo contrato
            name,
            symbol,
            baseURI
        );

        // 3. Devolvemos la dirección del contrato recién creado
        //    a nuestra API, para que pueda guardarla en Supabase.
        return address(newCollection);
    }
}