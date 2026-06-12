# ♚ ChessMaster Academy

Plataforma educativa de ajedrez con arquitectura limpia (Clean Architecture) y principios SOLID. Backend en NestJS con PostgreSQL y frontend vanilla JavaScript.

---

## Arquitectura del Proyecto

```
chess-academy/
├── backend/                # API REST — NestJS + Prisma + PostgreSQL
│   ├── src/
│   │   ├── config/              # Configuración (Prisma, conexiones)
│   │   ├── core/                # Capa de dominio (enums, entidades)
│   │   ├── repositories/        # Capa de acceso a datos
│   │   │   ├── interfaces/      #   Contratos abstractos
│   │   │   └── implementations/ #   Implementaciones concretas (Prisma)
│   │   ├── services/            # Capa de negocio (casos de uso)
│   │   ├── controllers/         # Capa de presentación (rutas HTTP)
│   │   ├── guards/              # Guardias de autenticación/autorización
│   │   ├── decorators/          # Decoradores personalizados
│   │   ├── strategies/          # Estrategias Passport (JWT)
│   │   └── dto/                 # Objetos de transferencia de datos
│   ├── prisma/                  # Schema y migraciones de BD
│   └── test/                    # Tests e2e
├── frontend/               # SPA Vanilla JS
│   ├── pages/                   # Páginas HTML
│   ├── styles/                  # Hojas de estilo CSS
│   ├── scripts/                 # Lógica JavaScript
│   │   ├── config/              # Configuración de API
│   │   └── modules/             # Módulos por dominio
│   │       ├── auth/            #   Autenticación
│   │       ├── payment/         #   Pagos
│   │       ├── cart/            #   Carrito
│   │       ├── ui/              #   Componentes de UI
│   │       ├── animations/      #   Animaciones
│   │       └── utils/           #   Utilidades
│   ├── components/              # Componentes reutilizables
│   └── hooks/                   # Hooks personalizados
└── README.md
```

### Principios SOLID aplicados

| Principio | Implementación |
|-----------|---------------|
| **S**ingle Responsibility | Cada clase tiene una única responsabilidad (controllers: rutas, services: negocio, repositories: datos) |
| **O**pen/Closed | Repositorios basados en interfaces permiten extender sin modificar |
| **L**iskov Substitution | Implementaciones de repositorios son intercambiables |
| **I**nterface Segregation | Interfaces de repositorio específicas por entidad |
| **D**ependency Inversion | Servicios dependen de abstracciones (interfaces), no de implementaciones concretas |

### Flujo de dependencias

```
Controller (HTTP) → Service (Business Logic) → Repository Interface ← Repository Implementation (Prisma)
```

Las dependencias apuntan hacia adentro: los controllers dependen de servicios, y los servicios dependen de interfaces de repositorio, no de implementaciones concretas.

---

## Instalación

### Requisitos previos

- Node.js >= 18
- PostgreSQL
- npm

### Backend

```bash
# 1. Ir al directorio del backend
cd backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con los datos de tu base de datos PostgreSQL

# 4. Ejecutar migraciones de Prisma
npx prisma migrate dev

# 5. Generar cliente Prisma
npx prisma generate

# 6. (Opcional) Sembrar datos de prueba
node seed_material.js
```

### Frontend

```bash
# 1. Ir al directorio del frontend
cd frontend

# 2. No requiere instalación (vanilla JS)
#    Abrir pages/index.html en el navegador
```

---

## Ejecución

### Backend (API)

```bash
cd backend

# Desarrollo con recarga automática
npm run start:dev

# Producción
npm run build && npm run start:prod
```

La API estará disponible en `http://localhost:3000/api`.

Documentación Swagger: `http://localhost:3000/docs`.

### Frontend

```bash
# Opción 1 — Abrir directamente
# Abrir frontend/pages/index.html en el navegador

# Opción 2 — Servir con un servidor HTTP
npx serve ./frontend/pages

# Opción 3 — Servir desde la raíz del frontend
npx serve ./frontend
```

### Scripts disponibles (backend)

| Comando | Descripción |
|---------|------------|
| `npm run start:dev` | Iniciar en modo desarrollo con watch |
| `npm run build` | Compilar TypeScript a JavaScript |
| `npm run start:prod` | Iniciar en producción |
| `npm run lint` | Ejecutar ESLint |
| `npm test` | Ejecutar tests unitarios |
| `npm run test:e2e` | Ejecutar tests e2e |
| `npm run prisma:studio` | Abrir Prisma Studio (explorador de BD) |

---

## API Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/api` | No | Health check |
| `POST` | `/api/auth/register` | No | Registrar usuario |
| `POST` | `/api/auth/login` | No | Iniciar sesión |
| `GET` | `/api/users` | No | Listar usuarios |
| `POST` | `/api/materials` | ADMIN | Crear material |
| `GET` | `/api/materials` | Sí | Listar materiales |
| `GET` | `/api/materials/:id` | Sí | Obtener material |
| `PUT` | `/api/materials/:id` | ADMIN | Actualizar material |
| `DELETE` | `/api/materials/:id` | ADMIN | Eliminar material |
| `GET` | `/docs` | No | Swagger UI |

---

## Tecnologías

- **Backend**: NestJS, Prisma ORM, PostgreSQL, Passport JWT, Swagger
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES Modules)
- **Principios**: Clean Architecture, SOLID, Repository Pattern
