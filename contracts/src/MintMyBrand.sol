// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Importamos las "herramientas" estándar de OpenZeppelin
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// --- CAMBIO #1: ¡Ya no importamos 'Counters.sol' porque no existe! ---

/**
 * @title MintMyBrand
 * Este es el contrato que "moldea" la colección de NFTs de un cliente.
 * (Versión 2, compatible con OpenZeppelin 5.0+)
 */
contract MintMyBrand is ERC721, Ownable {
    // --- CAMBIO #2: Ya no usamos 'using Counters for Counters.Counter' ---

    // --- CAMBIO #3: Reemplazamos el 'Counter' por un simple 'uint256' ---
    // Este será nuestro contador. Comienza en 0 automáticamente.
    uint256 private _nextTokenId;

    // Variable para guardar la URL base de los metadatos (la imagen, etc.)
    string private _baseTokenURI;

    /**
     * @dev El "constructor" se ejecuta UNA SOLA VEZ, cuando desplegamos el contrato.
     */
    constructor(
        address initialOwner,
        string memory name,
        string memory symbol,
        string memory baseURI
    )
        ERC721(name, symbol) // Nombra al token ERC-721
        Ownable(initialOwner) // Asigna al dueño
    {
        _baseTokenURI = baseURI;
    }

    /**
     * @dev Esta es la FUNCIÓN CLAVE. Es la que nuestro backend llamará.
     * Crea un nuevo NFT y se lo asigna a la wallet de un cliente.
     */
    function safeMint(address to) public onlyOwner {
        // --- CAMBIO #4: Usamos nuestro 'uint256' simple ---
        uint256 tokenId = _nextTokenId; // El ID actual (empieza en 0)
        _nextTokenId++; // Incrementamos el contador para el *siguiente* mint
        _safeMint(to, tokenId);
    }

    /**
     * @dev Esta función le dice a wallets como MetaMask o OpenSea
     * dónde encontrar el archivo JSON (metadatos) de un NFT.
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
}