# Chess Academy API

Este proyecto es una plataforma para una academia de ajedrez, que incluye tanto el servidor (backend) como la interfaz de usuario (frontend). Permite gestionar usuarios, roles (Admin, Estudiante, Usuario) y materiales de estudio (gratuitos y premium).

## Tecnologías Utilizadas

### Backend
- **NestJS**: Framework de Node.js progresivo para construir aplicaciones del lado del servidor eficientes y escalables.
- **TypeScript**: Superset de JavaScript que añade tipado estático, proporcionando mayor seguridad y robustez al código.
- **Prisma**: ORM (Object-Relational Mapping) moderno para Node.js y TypeScript, utilizado para interactuar con la base de datos de manera sencilla.
- **PostgreSQL**: Sistema de gestión de bases de datos relacional utilizado para almacenar los datos de usuarios, materiales, etc.
- **JWT (JSON Web Tokens) & Passport**: Herramientas para la autenticación y autorización de usuarios.
- **Swagger**: Utilizado para documentar la API y proporcionar una interfaz gráfica para probar los endpoints.

### Frontend
- **HTML5, CSS3, JavaScript Vanilla**: Interfaz construida sin frameworks complejos, usando las tecnologías web estándar.

---

## Estructura del Proyecto

El proyecto sigue una arquitectura de monorepo simplificada donde el backend y el frontend conviven en la misma carpeta raíz, pero están separados lógicamente.

```text
chess-academy-api/
├── frontend/               # Código de la aplicación web (Cliente)
├── prisma/                 # Configuración y esquema de la base de datos (Prisma ORM)
├── src/                    # Código fuente del Backend (NestJS)
│   ├── auth/               # Módulo de Autenticación
│   ├── materials/          # Módulo de Materiales de estudio
│   ├── prisma/             # Módulo para el servicio de Prisma
│   └── users/              # Módulo de Usuarios
├── uploads/                # Directorio para archivos subidos (ej. PDFs, imágenes)
├── .env                    # Variables de entorno
├── package.json            # Dependencias y scripts de Node.js
└── README.md               # Documentación del proyecto
```

---

## Para qué sirve cada parte

### Backend (`src/` y `prisma/`)
El backend es el motor principal de la aplicación. Se encarga de la lógica de negocio, la seguridad y la persistencia de datos.

- **`src/auth/`**: Maneja todo el flujo de inicio de sesión y registro. Genera tokens JWT para que los usuarios puedan acceder a rutas protegidas.
- **`src/users/`**: Gestiona las operaciones relacionadas con los usuarios (crear, leer, actualizar, eliminar perfiles y roles).
- **`src/materials/`**: Controla el acceso a los recursos de ajedrez. Verifica si un usuario tiene el nivel (premium/estudiante) adecuado para ver cierto material.
- **`src/prisma/`**: Contiene el servicio que instancia la conexión con la base de datos a través de Prisma.
- **`prisma/schema.prisma`**: Define la estructura de las tablas de la base de datos (Modelos: `User`, `Material`).

### Frontend (`frontend/`)
El frontend es lo que ve el usuario final e interactúa en el navegador. Se comunica con el backend a través de peticiones HTTP (API REST).

- **`index.html` / `main.css` / `main.js`**: Páginas de inicio (landing page), registro e inicio de sesión. Envían los datos de autenticación al backend.
- **`dashboard.html` / `dashboard.css` / `dashboard.js`**: El panel de control del usuario autenticado. Aquí el usuario puede ver los materiales de estudio dependiendo de su rol. El frontend se encarga de almacenar el token JWT y enviarlo en cada petición al backend.

---

## Instrucciones de Instalación y Uso

### 1. Requisitos Previos
- [Node.js](https://nodejs.org/) (v16 o superior)
- [PostgreSQL](https://www.postgresql.org/)

### 2. Configuración
1. Clona el repositorio.
2. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```
3. Configura las variables de entorno en el archivo `.env` (URL de la base de datos, secreto JWT, etc.).

### 3. Base de Datos
Ejecuta las migraciones de Prisma para crear las tablas en tu base de datos:
```bash
npx prisma migrate dev
```

### 4. Ejecución del Proyecto

**Backend:**
```bash
# Modo de desarrollo
npm run start:dev
```

**Frontend:**
Puedes usar cualquier servidor HTTP estático para servir la carpeta `frontend`. Por ejemplo:
```bash
npx serve ./frontend
```
