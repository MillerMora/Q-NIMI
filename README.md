# Q-NIMI

## Descripción

Q'NIMI es un juego educativo por niveles dirigido a niños con discapacidad
cognitiva leve. El proyecto combina una página de presentación (misión, 
visión y objetivos), un sistema de cuentas con inicio de sesión y registro, 
un cuestionario inicial que identifica las necesidades de aprendizaje del 
usuario, y distintos minijuegos (diferencias,memoria y tangram) pensados para
adaptarse al ritmo de cada niño. El backend gestiona usuarios, catálogo de 
juegos y resultados obtenidos en cada partida.

## Estructura de carpetas

A continuación se describe la organización del proyecto, para que cualquier
desarrollador que se una pueda ubicarse rápidamente:
```
Q-NIMI/
├── Backend/
│   ├── requirements.txt
│   ├── main.py/
│   ├── venv/
│   ├── connection/
│   │   ├── BD.py
│   │   └── __pycache__/
│   │       └── BD.cpython-314.pyc
│   ├── controllers/
│   │   ├── __init__.py
│   │   ├── juegos.py
│   │   ├── __pycache__/
│   │   │   ├── __init__.cpython-314.pyc
│   │   │   ├── juegos.cpython-314.pyc
│   │   │   ├── resultados.cpython-314.pyc
│   │   │   └── usuarios.cpython-314.pyc
│   │   ├── resultados.py
│   │   └── usuarios.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── juego.py
│   │   ├── __pycache__/
│   │   │   ├── __init__.cpython-314.pyc
│   │   │   ├── juego.cpython-314.pyc
│   │   │   ├── resultado.cpython-314.pyc
│   │   │   └── usuario.cpython-314.pyc
│   │   ├── resultado.py
│   │   └── usuario.py
│   ├── __pycache__/
│   │   └── main.cpython-314.pyc
│   └── router/
│       ├── __pycache__/
│       │   └── router.cpython-314.pyc
│       └── router.py
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
├── README.md
└── XD


```
#(Las carpetas `__pycache__` no se incluyen aquí porque son generadas
automáticamente por Python y no forman parte del código fuente versionado.)

## Descripción de los directorios y archivos

* **`Backend/`** — Contiene el código del backend del proyecto.

  * **`connection/`** — Módulos relacionados con la conexión a la base de datos.
    * `BD.py` — Configuración y conexión a la base de datos MySQL.
  * **`controllers/`** — Controladores con la lógica de las rutas del backend.
    * `usuarios.py` — Registro, consulta y autenticación (login) de usuarios.
    * `juegos.py` — Listado, consulta, creación y actualización del catálogo de juegos.
    * `resultados.py` — Registro y consulta de puntajes obtenidos por los usuarios.
  * `main.py` — Punto de entrada de la aplicación FastAPI; incluye el router principal y la configuración de CORS.
  * **`models/`** — Modelos de datos usados por el backend (funciones de acceso a la base de datos).
    * `usuario.py` — Consultas SQL relacionadas con usuarios (crear, obtener, verificar credenciales).
    * `juego.py` — Consultas SQL relacionadas con el catálogo de juegos.
    * `resultado.py` — Consultas SQL relacionadas con los resultados de las partidas.
  * `requirements.txt` — Lista de dependencias de Python del backend.
  * **`router/`** — Router central de la aplicación.
    * `router.py` — Agrupa los routers de `usuarios`, `juegos` y `resultados` en uno solo, que es el que se incluye en `main.py`.

* **`Frontend/`** — Contiene los archivos relacionados con la interfaz del proyecto.

  * **`assets/`** — Contiene recursos utilizados por el frontend.
    * `Logo.jpeg` — Imagen del logo del proyecto.
    * `diferencias.jpg`, `img de diferencias/elefantante813x610.png` — Recursos gráficos del juego de diferencias.
    * `nivel_memoria.png` — Imagen del nivel de memoria en el mapa de niveles.
    * `tangram.png` — Imagen del nivel de tangram en el mapa de niveles.
  * **`views/`** — Contiene las vistas HTML del proyecto.
    * **`css/`** — Contiene los archivos de estilos CSS.
      * `styles.css` — Hoja de estilos general del frontend (index, navbar, modal de autenticación).
      * `styles_diferencias.css` — Hoja de estilos del juego de diferencias.
      * `styles_memoria.css` — Hoja de estilos del juego de memoria.
      * `styles_tangram.css` — Hoja de estilos del juego de tangram.
    * **`js/`** — Contiene los archivos JavaScript.
      * `autenticacion.js` — Lógica del modal de login/registro, reconocimiento facial, navbar dinámico según sesión, y conexión con la API para crear cuentas, iniciar sesión y cerrar sesión.
      * `cuestionario.js` — Lógica de la evaluación inicial interactiva (cuestionario guiado con la mascota Nimi).
      * `pantalla-inicio.js` — Lógica de la pantalla de carga que se desvanece al iniciar `index.html`.
      * `diferencias.js` — Lógica del juego de diferencias, incluyendo el envío del resultado a la API al completar el juego.
      * `memoria.js` — Lógica del juego de memoria (parejas), incluyendo el envío del resultado a la API al completar el juego.
      * `tangram.js` — Lógica del juego de tangram (pendiente).
    * `cuestionario_inicial.html` — Vista de la evaluación inicial que clasifica al usuario en un nivel (básico, medio o alto).
    * `mapa_niveles.html` — Vista correspondiente al mapa de niveles.
    * `diferencias.html` — Vista correspondiente al juego de diferencias.
    * `memoria.html` — Vista correspondiente al juego de memoria.
    * `tangram.html` — Vista correspondiente al juego de tangram.

* **`index.html`** — Página principal del proyecto (presentación, misión, visión, objetivos y acceso al modal de autenticación).

* **`README.md`** — Archivo de documentación del proyecto.

## Backend

El backend está construido en **Python** con **FastAPI**. Las librerías
principales usadas en `Backend/requirements.txt` son:

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
# Desde la carpeta Backend/
cd Backend

# Crear el entorno virtual
python -m venv venv

# Activar en Linux / macOS
source venv/bin/activate

# Activar en Windows (CMD)

venv\Scripts\activate.bat

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
DB_PASSWORD=""
DB_NAME=juego_memoria
```

Con MySQL encendido, ejecuta desde la carpeta raíz del proyecto:

```bash
python -m Backend.connection.BD
```

El módulo crea la base de datos, sus tablas y los catálogos iniciales si aún
no existen.

### CORS

Como el frontend y el backend se ejecutan en orígenes distintos (por ejemplo
`http://localhost:3000` para el frontend y `http://127.0.0.1:8000` para la
API), `main.py` incluye `CORSMiddleware` de FastAPI para permitir que el
navegador acepte las peticiones `fetch` del frontend hacia la API.

### Endpoints disponibles

Con el backend iniciado, la documentación interactiva queda disponible en
`http://127.0.0.1:8000/docs`.

| Método | Ruta                                | Función                                |
|--------|-------------------------------------|-----------------------------------------|
| `POST` | `/usuarios/`                        | Registrar un usuario                    |
| `GET`  | `/usuarios/{usuario_id}`            | Consultar un usuario                    |
| `POST` | `/usuarios/login`                   | Iniciar sesión (verificar credenciales) |
| `GET`  | `/juegos/`                          | Listar juegos                           |
| `GET`  | `/juegos/{juego_id}`                | Consultar un juego                      |
| `POST` | `/resultados/`                      | Guardar un puntaje                      |
| `GET`  | `/resultados/usuario/{usuario_id}`  | Consultar puntajes de un usuario        |
### Arrancar el backend

```bash
uvicorn main:app --reload
```

> Se ejecuta desde dentro de `Backend/`, ya que `main.py` está en la raíz de esa carpeta.

## Frontend

El frontend se compone de archivos HTML, CSS y JavaScript planos (sin
framework). No requiere instalación de dependencias, pero para evitar
restricciones del navegador con `fetch` y módulos, se recomienda servirlo con
un servidor local en vez de abrir los archivos `.html` directamente (por
ejemplo con la extensión "Live Server" de VS Code, o `python -m http.server`
desde la raíz del proyecto).

Cada minijuego guarda su puntaje llamando a `POST /resultados` una vez el
usuario lo completa, usando el `usuario_id` guardado en `localStorage` tras el
inicio de sesión.