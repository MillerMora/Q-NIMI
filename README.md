# Q-NIMI

## Descripción


## Estructura de carpetas

A continuación se describe la organización del proyecto, para que cualquier
desarrollador que se una pueda ubicarse rápidamente:
```
Q-NIMI/
├── Backend/
├── Frontend/
│   ├── assets/
│   │   └── Logo.jpeg
│   └── views/
│       ├── css/
│       │   └── styles.css
│       └── js/
│           ├── autenticacion.js
│           └── pantalla-inicio.js
├── index.html
└── README.md
```
- **Backend/** — Lógica del servidor, rutas, controladores y conexión con la base de datos.
- **Frontend/** — Todo el código del lado del cliente (lo que el usuario ve y con lo que interactúa).
  - **assets/** — Recursos estáticos como imágenes, íconos y logos.
  - **views/** — Vistas del proyecto; aquí van todas las páginas HTML del sitio web.
    - **css/** — Hojas de estilo CSS.
    - **js/** — Scripts de JavaScript.
      - `autenticacion.js` — Controla el modal de inicio de sesión, registro y reconocimiento facial.
      - `pantalla-inicio.js` — Controla la pantalla de carga inicial que se desvanece para mostrar el index.
- **index.html** — Página principal del sitio web.
- **README.md** — Este archivo: documentación general del proyecto..

