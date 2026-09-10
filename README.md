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
│   │   ├──img de diferencias/
├   ├   ├    ├──elefantante813x610png
│   │   └── Logo.jpeg
│   │   └──diferencias.jpg
│   │   └──nivel_memoria.png
│   │   └──tangram.png
│   └── views/
│       ├── css/
│       │   └── styles_diferencias.css
│       │   └── styles_memoria.css
│       │   └── Styles_tangram.css
│       │   └── styles.css
│       ├── js/
│       │   ├── autenticacion.js
│       │   └── diferencias.js
│       │   └──memoria.js 
│       │   └──pantalla-inicio.js 
│       │   └── tangram.Js
│       ├── diferencias.html
│       ├── mapa_niveles.html
│       ├── memoria.html
│       └── tangram.html
├── index.html
└── README.md
```
## Descripción de los directorios y archivos

* **`Backend/`** — Directorio destinado al código del backend del proyecto.

* **`Frontend/`** — Contiene los archivos relacionados con la interfaz del proyecto.

  * **`assets/`** — Contiene recursos utilizados por el frontend.

    * `Logo.jpeg` — Imagen del logo del proyecto.
  * **`views/`** — Contiene las vistas HTML del proyecto.

    * **`css/`** — Contiene los archivos de estilos CSS.

      * `styles.css` — Hoja de estilos del frontend.

    * **`js/`** — Contiene los archivos JavaScript.
          styles_diferencias.css — Hoja de estilos del juego de diferencias
          styles_memoria.css     — Hoja de estilos del juego de memoria
          styles_tangram.css     — Hoja de estilos del juego de tangram
          styles.css             — Hoja de estilos del frontend.
    * `autenticacion.js` — Archivo JavaScript relacionado con la autenticación.
        diferencias.js — lógica del juego de diferencias
        memoria.js — lógica del juego de memoria 
      * `pantalla-inicio.js` — Archivo JavaScript relacionado con la pantalla de inicio.
        tangram.Js — lógica del juego (pendiente )
        
    * `diferencias.html` — Vista correspondiente al juego o actividad de diferencias.
    * `mapa_niveles.html` — Vista correspondiente al mapa de niveles.
    * `memoria.html` — Vista correspondiente al juego o actividad de memoria.
    * `tangram.html` — Vista correspondiente al juego o actividad de tangram.

* **`index.html`** — Página principal del proyecto.

* **`README.md`** — Archivo de documentación del proyecto.
