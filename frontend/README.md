# ChessMaster Academy — Frontend

Landing page estática que consume la API REST de NestJS en `http://localhost:3000/api`.

## Estructura

```
frontend/
├── index.html          # Página principal (landing + modales de auth)
├── main.css            # Estilos globales
├── main.js             # Lógica principal (tablero, carrito, auth modales)
├── config/
│   └── api-config.js   # URL base de la API + TokenManager (JWT + sesión)
└── modules/
    ├── formularios.js  # Módulo auxiliar de formularios (registro/login)
    ├── payment-api.js  # Integración con WilloPay
    ├── cart.js         # Módulo del carrito
    ├── navbar.js       # Comportamiento del navbar
    ├── toast.js        # Notificaciones toast
    └── ...             # Otros módulos de UI
```

## Cómo usarlo

1. Asegúrate de que el API esté corriendo: `npm run start:dev` (desde la raíz del proyecto)
2. Abre `frontend/index.html` directamente en el navegador, o sirve la carpeta con:
   ```bash
   npx serve ./frontend
   ```
3. La API debe estar en `http://localhost:3000/api` (configurable en `config/api-config.js`)

## Flujo de autenticación

| Acción | Endpoint API | Almacenamiento |
|--------|-------------|---------------|
| Registro | `POST /api/auth/register` | `chessmaster_token` + `chessmaster_user` en localStorage |
| Login | `POST /api/auth/login` | `chessmaster_token` + `chessmaster_user` en localStorage |
| Logout | — (limpia localStorage) | — |

Después del login/registro, el usuario es redirigido a `dashboard.html`.
