# ChessMaster Academy — Frontend

Landing page estática y dashboard que consumen la API REST NestJS en `http://localhost:3000/api`.

## Estructura

```
frontend/
├── pages/                          # Páginas HTML
│   ├── index.html                  # Landing page (hero, cursos, FAQ, contacto, auth)
│   └── dashboard.html              # Panel de usuario autenticado
├── styles/                         # Hojas de estilo
│   ├── main.css                    # Estilos globales del landing
│   └── dashboard.css               # Estilos del dashboard
├── scripts/                        # Lógica JavaScript
│   ├── main.js                     # Lógica principal del landing
│   ├── dashboard.js                # Lógica del dashboard
│   ├── config/
│   │   └── api-config.js           # URL base de API + TokenManager
│   └── modules/
│       ├── auth/
│       │   └── formularios.js      # Formularios de registro/login
│       ├── payment/
│       │   └── payment-api.js      # Integración con WilloPay
│       ├── cart/
│       │   └── cart.js             # Módulo del carrito de compras
│       ├── ui/
│       │   ├── navbar.js           # Comportamiento del navbar
│       │   ├── toast.js            # Notificaciones toast
│       │   ├── modals.js           # Modales de piezas de ajedrez
│       │   ├── faq.js              # Acordeón de FAQ
│       │   └── contact-form.js     # Formulario de contacto
│       ├── animations/
│       │   ├── smooth-scroll.js    # Scroll suave en anclas
│       │   ├── scroll-reveal.js    # Animaciones al scroll
│       │   ├── particles.js        # Partículas flotantes
│       │   └── chess-board.js      # Tablero de ajedrez animado
│       └── utils/
│           ├── utils.js            # Utilidades globales
│           └── counters.js         # Contadores animados
├── components/                     # Componentes reutilizables (futuro)
├── hooks/                          # Hooks personalizados (futuro)
└── README.md
```

## Cómo usarlo

1. Asegúrate de que el backend esté corriendo (ver `/backend/README.md`)
2. Abre `frontend/pages/index.html` en el navegador, o sirve la carpeta:
   ```bash
   npx serve ./frontend/pages
   ```
3. La API debe estar en `http://localhost:3000/api` (configurable en `scripts/config/api-config.js`)

## Flujo de autenticación

| Acción | Endpoint API | Almacenamiento |
|--------|-------------|---------------|
| Registro | `POST /api/auth/register` | `chessmaster_token` + `chessmaster_user` en localStorage |
| Login | `POST /api/auth/login` | `chessmaster_token` + `chessmaster_user` en localStorage |
| Logout | — (limpia localStorage) | — |

Después del login/registro, el usuario es redirigido a `dashboard.html`.
