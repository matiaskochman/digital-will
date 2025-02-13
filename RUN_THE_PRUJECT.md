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

## Running the Project

### 1. Ejecutar en Desarrollo

```bash
$ npm run start:dev
```

Esto iniciará el servidor en **modo desarrollo** con hot-reloading.

### 2. Ejecutar en Producción

```bash
$ npm run build
$ npm run start:prod
```

Esto compilará el código y lo ejecutará desde `dist/`.

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

## Database Schema

El esquema principal de la base de datos consiste en la entidad `DigitalWill`:

```ts
@Entity()
export class DigitalWill {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', nullable: true })
  ownerWalletAddress!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cid!: string;

  @Column({ type: 'varchar', nullable: true })
  nftContractAddress!: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
```

---

## Deployment

### Deploy con Docker en un Servidor Remoto

```bash
$ npm run docker:deploy
```

Esto:

1. Limpia módulos y compilados previos
2. Crea un archivo ZIP con el código fuente
3. Lo sube al servidor
4. Lo desempaqueta y construye los contenedores en el servidor
5. Levanta los servicios con `docker-compose up -d`

---

## Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"

Solución: Asegurarse de que la variable `DB_PASSWORD` en `.env` coincida con la contraseña en `docker-compose.yml`.

### Error: "Alchemy RPC URL is not defined"

Solución: Verificar que la variable `ALCHEMY_ETHEREUM_SEPOLIA_URL` esté correctamente configurada en `.env`.

---

## Contribución

1. Crear una rama nueva: `git checkout -b feature/nueva-funcionalidad`
2. Hacer commit de los cambios: `git commit -m "Agregada nueva funcionalidad"`
3. Hacer push a la rama: `git push origin feature/nueva-funcionalidad`
4. Crear un Pull Request en GitHub

---

## License

Este proyecto es **UNLICENSED** y su código está protegido. No puede ser distribuido sin permiso explícito del autor.
