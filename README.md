# Q-NIMI

## Descripción


## Estructura de carpetas

A continuación se describe la organización del proyecto, para que cualquier
desarrollador que se una pueda ubicarse rápidamente:
```
Q-NIMI/
├── Backend
|   ├── venv/
│   ├── connection/
│   │   └── BD.py
│   ├── controllers/
│   ├── main.py
│   ├── models
│   └── requirements.txt
├── Frontend/
│   ├── assets/
│   │   ├── diferencias.jpg
│   │   ├── img de diferencias
│   │   │   └── elefantante813x610.png
│   │   ├── Logo.jpeg
│   │   ├── nivel_memoria.png
│   │   └── tangram.png
│   └── views/
│       ├── css/
│       │   ├── styles.css
│       │   ├── styles_diferencias.css
│       │   ├── styles_memoria.css
│       │   └── styles_tangram.css
│       ├── js/
│       │   ├── autenticacion.js
│       │   ├── cuestionario.js
│       │   ├── diferencias.js
│       │   ├── memoria.js
│       │   ├── pantalla-inicio.js
│       │   └── tangram.js
│       ├── cuestionario_inicial.html
│       ├── diferencias.html
│       ├── mapa_niveles.html
│       ├── memoria.html
│       └── tangram.html
├── index.html
└── README.md
```
## Descripción de los directorios y archivos

* **`Backend/`** — Contiene el código del backend del proyecto.

* **`venv/`** — Entorno virtual de Python del backend (no se versiona).
* **`connection/`** — Módulos relacionados con la conexión a la base de datos.

* `BD.py` — Configuración y conexión a la base de datos MySQL.
* **`controllers/`** — Controladores con la lógica de las rutas del backend.
* `main.py` — Punto de entrada de la aplicación FastAPI.
* **`models/`** — Modelos de datos usados por el backend.
* `requirements.txt` — Lista de dependencias de Python del backend.

* **`Frontend/`** — Contiene los archivos relacionados con la interfaz del proyecto.

* **`assets/`** — Contiene recursos utilizados por el frontend.

* `Logo.jpeg` — Imagen del logo del proyecto.
* **`views/`** — Contiene las vistas HTML del proyecto.

* **`css/`** — Contiene los archivos de estilos CSS.

* `styles.css` — Hoja de estilos del frontend.
  styles_diferencias.css — Hoja de estilos del juego de diferencias
  styles_memoria.css     — Hoja de estilos del juego de memoria
  styles_tangram.css     — Hoja de estilos del juego de tangram
  styles.css             — Hoja de estilos del frontend.
* **`js/`** — Contiene los archivos JavaScript.
* `autenticacion.js` — Archivo JavaScript relacionado con la autenticación.
  diferencias.js — lógica del juego de diferencias
  memoria.js — lógica del juego de memoria 
  pantalla-inicio.js` — Archivo JavaScript relacionado con la pantalla de carga de index.
  tangram.Js — lógica del juego (pendiente )
* `cuestionario.js` — Lógica de la evaluación inicial interactiva (cuestionario guiado con la mascota Nimi).
* `diferencias.html` — Vista correspondiente al juego o actividad de diferencias.
* `mapa_niveles.html` — Vista correspondiente al mapa de niveles.
* `memoria.html` — Vista correspondiente al juego o actividad de memoria.
* `tangram.html` — Vista correspondiente al juego o actividad de tangram.
* `cuestionario_inicial.html` — Vista de la evaluación inicial que clasifica al usuario en un nivel (básico, medio o alto).

* **`index.html`** — Página principal del proyecto.

* **`README.md`** — Archivo de documentación del proyecto.

## Backend

El backend está construido en **Python** con **FastAPI**. Las librerías
principales usadas en `backend/requirements.txt` son:

* `fastapi` — Framework para construir la API.
* `uvicorn` — Servidor ASGI que ejecuta la aplicación.
* `mysql-connector-python` — Conexión con la base de datos MySQL.
* `pydantic` — Validación y modelado de datos.
* `python-dotenv` — Manejo de variables de entorno (`.env`).

(El resto de paquetes del `requirements.txt`, como `anyio`, `click`, `h11`,
`idna`, `starlette`, `pydantic_core`, `typing_extensions`, etc., son
dependencias internas de los anteriores y no se gestionan directamente.)

### Versión de Python

Se recomienda **Python 3.12**, compatible con las versiones de FastAPI y
Pydantic listadas en `requirements.txt`.

### Crear y activar el entorno virtual

```bash
# Desde la carpeta backend/
cd backend

# Crear el entorno virtual
python -m venv venv

# Activar en Linux / macOS
source venv/bin/activate

# Activar en Windows (PowerShell)
venv\Scripts\Activate.ps1
```

# si no llega a funcionar el comando por restricciones haz esto: (para windows)
coloca este comando en el powerShell como administrador 

Set-ExecutionPolicy -ExecutionPolicy RemoteSigned

posterior se tiene que poner "S" como respuesta "Si" o en el caso que este en ingles "Y" para "Yes" y se solucionara el problema de deshabilitacion


### Instalar las dependencias

```bash
pip install -r requirements.txt
```

### Inicializar la base de datos

`Backend/connection/BD.py` contiene la configuración Python de la base de
datos MySQL. Antes de ejecutarla, crea un archivo `.env` dentro de `Backend/`
con los datos de tu servidor:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD= "tu contraseña"
DB_NAME=juego_memoria
```

Con MySQL encendido, ejecuta desde la carpeta raíz del proyecto:

```bash
python -m Backend.connection.BD
```

El módulo crea la base de datos, sus tablas y los catálogos iniciales si aún
no existen.

### Endpoints disponibles

Con el backend iniciado, la documentación interactiva queda disponible en
`http://127.0.0.1:8000/docs`.

| Método| Ruta | Función |
|-------|----------------------------------------|----------------------|
| `POST`| `/api/usuarios`                        | Registrar un usuario |
| `GET` | `/api/usuarios/{usuario_id}`           | Consultar un usuario |
| `GET` | `/api/juegos`                          | Listar juegos        |
| `GET` | `/api/juegos/{juego_id}`               | Consultar un juego   |
| `POST`| `/api/resultados`                      | Guardar un puntaje   |
| `GET` | `/api/resultados/usuario/{usuario_id}` | Consultar puntajes   |

### Arrancar el backend

```bash
uvicorn main:app --reload
```

> Se ejecuta desde dentro de `backend/`, ya que `main.py` está en la raíz de esa carpeta.