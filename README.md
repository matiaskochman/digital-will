# Digital Will

## 📖 Descripción

Digital Will es una aplicación basada en **NestJS**, **TypeORM** y **MySQL** que permite a los usuarios almacenar testamentos digitales de manera segura y encriptada. Utiliza **Lighthouse Web3** para el almacenamiento de archivos cifrados y **Alchemy** para la verificación de saldos y tokens ERC20/ERC721.

---

## 🏗 Tech Stack

- **Backend:** NestJS (TypeScript)
- **Base de datos:** MySQL (TypeORM)
- **Blockchain:** Ethers.js, Alchemy SDK, Lighthouse Web3 SDK
- **Contenerización:** Docker & Docker Compose
- **Testing Framework:** Jest

---

## 🚀 Instalación y Configuración

### 1️⃣ Clonar el repositorio
```bash
git clone <repo-url>
cd digital-will
```

### 2️⃣ Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```ini
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

### 3️⃣ Levantar los contenedores Docker
```bash
docker-compose up -d --build
```
Esto iniciará:
- Un contenedor MySQL con la base de datos configurada
- Un contenedor `digital-will` con las variables de entorno adecuadas

## ✅ Testing

### Ejecutar pruebas unitarias
```bash
npm run test
```

### Ejecutar pruebas en modo watch
```bash
npm run test:watch
```

### Ejecutar pruebas de cobertura
```bash
npm run test:cov
```

---

## 🔗 API Endpoints

### Wallet Signer

#### 🔹 `POST /wallet/sign-message`
Firma un mensaje de autenticación con una clave privada.

📌 **Ejemplo:**
```bash
curl -X POST "http://localhost:4000/wallet/sign-message" \
     -H "Content-Type: application/json" \
     -d '{"walletAddress": "0xYourWalletAddress", "privateKey": "0xYourPrivateKey"}'
```
📌 **Respuesta esperada:**
```json
{
  "signedMessage": "0xGeneratedSignature"
}
```

### Will Management

#### 🔹 `POST /will/upload`
Sube y encripta un testamento digital.

📌 **Ejemplo:**
```bash
curl -X POST "http://localhost:4000/will/upload" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@/path/to/file.json" \
     -F "walletAddress=0xYourWalletAddress" \
     -F "nftContractAddress=0xYourNFTContract" \
     -F "signedMessage=0xYourSignedMessage"
```
📌 **Respuesta esperada:**
```json
{
  "cid": "QmHashDelArchivo"
}
```

#### 🔹 `GET /will/:cid`
Recupera y desencripta un testamento.

📌 **Ejemplo:**
```bash
curl -X GET "http://localhost:4000/will/QmHashDelArchivo?walletAddress=0xYourWalletAddress&signedMessage=0xYourSignedMessage" \
     -H "Content-Type: application/json"
```
📌 **Respuesta esperada:**
```json
{
  "content": "Contenido del testamento descifrado"
}
```

---

## 📂 Pruebas con Scripts Bash

Los scripts ubicados en `scripts/` interactúan con la API para firmar mensajes con una billetera Ethereum, subir un testamento y recuperarlo por su CID.

### 🛠 Requisitos Previos

- Sistema operativo UNIX/Linux con Bash instalado.
- `curl` y `jq` instalados.
- Un archivo JSON con el testamento en `wills/matias.json`.
- API en ejecución en `http://localhost:4000` o `http://109.199.124.173:4000`.

### 📥 Instalación de Dependencias

#### En macOS (Homebrew):
```bash
brew install curl jq
```

#### En Linux (Debian/Ubuntu):
```bash
sudo apt update && sudo apt install curl jq -y
```

### 📌 Cuentas Disponibles (Blockchain Local de Hardhat)

#### Cuentas con NFT y balance/tokens:
- **Account #0**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- **Account #1**: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- **Account #2**: `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`

#### Cuentas sin NFT pero con balance/tokens:
- **Account #47**: `0x3c3E2E178C69D4baD964568415a0f0c84fd6320A`
- **Account #48**: `0x35304262b9E87C00c430149f28dD154995d01207`
- **Account #49**: `0xD4A1E660C916855229e1712090CcfD8a424A2E33`

---

## 📜 Licencia

Este proyecto está bajo la licencia **UNLICENSED**.

💡 **Desarrollado por:** Tu Nombre / Empresa 🚀

