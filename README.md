# README

# Digital Will - Documentation

## Overview

Digital Will es una aplicación construida con **NestJS**, **TypeORM** y **MySQL** para permitir a los usuarios almacenar testamentos digitales en un sistema seguro y encriptado. Utiliza **Lighthouse Web3** para el almacenamiento y recuperación de archivos cifrados, y **Alchemy** para la verificación de saldos y tokens ERC20/ERC721.

---

## Tech Stack

- **Backend:** NestJS (TypeScript)
- **Database:** MySQL (TypeORM)
- **Blockchain Integrations:** Ethers.js, Alchemy SDK, Lighthouse Web3 SDK
- **Docker & Docker Compose:** Para contenerización y despliegue
- **Testing Framework:** Jest

---

## Installation & Setup 

### 1. Clonar el repositorio

```bash
$ git clone <repo-url>
$ cd digital-will
```

### 2. Configurar Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
PORT=4000
NODE_ENV=development
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=yourpassword
DB_DATABASE=digital_will
LIGHTHOUSE_API_KEY=your_lighthouse_api_key
ALCHEMY_ETHEREUM_SEPOLIA_URL=your_alchemy_rpc_url
```

### 3. Construir y ejecutar los contenedores Docker

```bash
$ docker-compose up -d --build
```

Esto iniciará:

- Un contenedor MySQL con la base de datos configurada
- Un contenedor de la aplicación `digital-will` con las variables de entorno correctas

---

## Testing

Ejecutar pruebas unitarias:

```bash
$ npm run test
```

Ejecutar pruebas en modo watch:

```bash
$ npm run test:watch
```

Ejecutar pruebas de cobertura:

```bash
$ npm run test:cov
```

---

## API Endpoints

### Wallet Signer

- **`POST /wallet/sign-message`** - Firma un mensaje de autenticación con una clave privada.

### Will Management

- **`POST /will/upload`** - Sube y encripta un testamento digital.
- **`GET /will/:cid`** - Recupera y desencripta un testamento.

Ejemplo de solicitud para subir un testamento:

```bash
curl -X POST "http://localhost:4000/will/upload" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/file.json" \
  -F "walletAddress=0xYourWalletAddress" \
  -F "nftContractAddress=0xYourNFTContract" \
  -F "signedMessage=0xYourSignedMessage"
```

---

## Probar la funcionalidad

Los scripts test_upload_fetch1.sh y test_upload_fetch_loop.sh en Bash interactúan con una API local para firmar mensajes con una billetera Ethereum, subir un testamento en formato JSON y luego recuperarlo mediante su CID.

## Requisitos Previos

Antes de ejecutar el script, asegúrate de tener:

- Un entorno UNIX/Linux con Bash instalado.
- curl y jq instalados.
- Un archivo JSON con el testamento en la ruta wills/matias.json.
- Una API en ejecución en http://localhost:3000 o en el servidor remoto http://109.199.124.173:4000 con los siguientes endpoints:
  - /wallet/sign-message (POST)
  - /will/upload (POST)
  - /will/{cid} (GET)

## Instalación de Dependencias para utilizar los scripts de prueba

Si no tienes curl y jq instalados, puedes hacerlo con los siguientes comandos:

### En macOS (usando Homebrew):

```bash
brew install curl jq
```

### En Linux (usando apt o yum dependiendo de la distribución):

**Para Debian/Ubuntu:**

```bash
sudo apt update && sudo apt install curl jq -y
```

## Configuración

Las siguientes variables deben definirse dentro del script:

- WALLET_ADDRESS: Dirección de la billetera Ethereum.
- PRIVATE_KEY: Clave privada asociada a la billetera.
- NFT_CONTRACT: Dirección del contrato NFT asociado.

### Cuentas disponibles: se utilizan las cuentas que provee la blockchain local de hardhat

#### Cuentas con NFT y balance/tokens:

- **Account #0**: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

  - **Private Key**: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

- **Account #1**: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8

  - **Private Key**: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

- **Account #2**: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC

  - **Private Key**: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a

#### Cuentas sin NFT pero con balance/tokens:

- **Account #47**: 0x3c3E2E178C69D4baD964568415a0f0c84fd6320A

  - **Private Key**: 0x7ec49efc632757533404c2139a55b4d60d565105ca930a58709a1c52d86cf5d3

- **Account #48**: 0x35304262b9E87C00c430149f28dD154995d01207

  - **Private Key**: 0x755e273950f5ae64f02096ae99fe7d4f478a28afd39ef2422068ee7304c636c0

- **Account #49**: 0xD4A1E660C916855229e1712090CcfD8a424A2E33

  - **Private Key**: 0xaf6ecabcdbbfb2aefa8248b19d811234cd95caa51b8e59b6ffd3d4bbc2a6be4c

## Pasos del Script

## ¿Por qué son necesarias las firmas?

En este proceso, las firmas criptográficas aseguran que solo el propietario legítimo de la billetera puede subir y recuperar el testamento. Cada firma generada con la clave privada de la billetera garantiza que la operación es válida y que la API puede verificar la autenticidad de la solicitud.

### 1. Obtener la primera firma para la subida del testamento

El script hace una petición POST a `http://localhost:3000/wallet/sign-message` o `http://109.199.124.173:4000/wallet/sign-message`, enviando la dirección de la billetera y la clave privada.
La respuesta contiene un signedMessage que se almacena en sign_for_upload.

### 2. Subir el testamento

Se hace una petición POST a `http://localhost:3000/will/upload` o `http://109.199.124.173:4000/will/upload`, enviando:

- El archivo `wills/matias.json`.
- La dirección de la billetera.
- La dirección del contrato NFT.
- La firma obtenida en el paso anterior (`sign_for_upload`).

La respuesta de la API contiene un CID, que es el identificador único del testamento subido.

### 3. Obtener la segunda firma para la consulta

Se repite el proceso de firma anterior (POST a `http://localhost:3000/wallet/sign-message` o `http://109.199.124.173:4000/wallet/sign-message`).
El signedMessage obtenido se almacena en `sign_for_download`.

### 4. Recuperar el testamento

Se realiza una petición GET a `http://localhost:3000/will/{cid}` o `http://109.199.124.173:4000/will/{cid}` con:

- El CID obtenido en el paso 2.
- La dirección de la billetera.
- La firma `sign_for_download`.

La respuesta contiene el contenido del testamento almacenado.

## Ejecución del Script

Para ejecutar el script:

```bash
chmod +x script.sh
./script.sh
```

También se pueden ejecutar los siguientes scripts adicionales:

- **test_upload_fetch1.sh**: Sube el archivo para una sola wallet válida.
- **test_upload_fetch_loop.sh**: Sube el archivo a tres wallets válidas y trata de subirlo a tres wallets inválidas.

Estos scripts utilizan las wallets de la blockchain local de Hardhat.
