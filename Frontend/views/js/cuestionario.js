/* ==========================================================================
   EVALUACIÓN INTERACTIVA - Q'NIMI
   Experiencia guiada por Nimi: una pregunta a la vez, avance automático
   al responder y celebración constante en lugar de marcar "correcto/incorrecto".
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. DATOS DE LAS PREGUNTAS
// --------------------------------------------------------------------------
const preguntas = [
    {
        texto: "¿Cuántos días tiene una semana?",
        opciones: ["7", "8", "5", "6"],
        correcta: 0
    },
    {
        texto: "¿Cuál número es mayor?",
        opciones: ["3", "7", "5", "2"],
        correcta: 1
    },
    {
        texto: "Si tienes 3 manzanas y te dan 2 más, ¿cuántas tienes?",
        opciones: ["4", "5", "6", "7"],
        correcta: 1
    },
    {
        texto: "¿Cuál de estos animales puede volar?",
        opciones: ["🐶 Perro", "🐟 Pez", "🐦 Pájaro", "🐱 Gato"],
        correcta: 2
    },
    {
        texto: "Si hoy es lunes, ¿qué día será mañana?",
        opciones: ["Domingo", "Martes", "Miércoles", "Viernes"],
        correcta: 1
    }
];

const LETRAS = ["A", "B", "C", "D"];
const respuestasUsuario = new Array(preguntas.length).fill(null);
let preguntaActual = 0;

// Mensajes de aliento variados, para que no se repita siempre lo mismo
const mensajesAnimo = [
    "¡Muy bien! Sigamos.",
    "¡Genial! Vamos con la siguiente.",
    "¡Lo hiciste muy bien!",
    "¡Excelente! Un paso más.",
    "¡Así se hace!"
];

// --------------------------------------------------------------------------
// 2. REFERENCIAS AL DOM
// --------------------------------------------------------------------------
const pantallaIntro = document.getElementById("pantalla-intro");
const pantallaJuego = document.getElementById("pantalla-juego");
const pantallaResultado = document.getElementById("pantalla-resultado");

const btnEmpezar = document.getElementById("btn-empezar");
const btnVolver = document.getElementById("btn-volver");
const btnContinuar = document.getElementById("btn-continuar");

const caminoProgreso = document.getElementById("camino-progreso");
const textoMensaje = document.getElementById("texto-mensaje");
const preguntaTexto = document.getElementById("pregunta-texto");
const opcionesGrid = document.getElementById("opciones-grid");
const tarjetaPregunta = document.getElementById("tarjeta-pregunta");
const mascotaJuego = document.getElementById("mascota-juego");


const resultadoNivel = document.getElementById("resultado-nivel");
const resultadoDescripcion = document.getElementById("resultado-descripcion");
const confetiContenedor = document.getElementById("confeti-contenedor");

const prefiereMovimientoReducido =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// --------------------------------------------------------------------------
// 3. CAMBIO DE PANTALLA
// --------------------------------------------------------------------------
function mostrarPantalla(pantalla) {
    [pantallaIntro, pantallaJuego, pantallaResultado].forEach(seccion => {
        seccion.hidden = seccion !== pantalla;
    });
}

// --------------------------------------------------------------------------
// 4. CAMINO DE PROGRESO
// --------------------------------------------------------------------------
function construirCamino() {
    preguntas.forEach((_, indice) => {
        const nodo = document.createElement("div");
        nodo.className = "nodo-progreso";
        nodo.dataset.indice = indice;
        nodo.textContent = indice + 1;
        caminoProgreso.appendChild(nodo);
    });
}

function actualizarCamino(indiceActivo) {
    document.querySelectorAll(".nodo-progreso").forEach((nodo, indice) => {
        nodo.classList.toggle("nodo-progreso--activo", indice === indiceActivo);
        nodo.classList.toggle("nodo-progreso--completado", indice < indiceActivo);
        if (indice < indiceActivo) {
            nodo.textContent = "★";
        }
    });
}

// --------------------------------------------------------------------------
// 5. MOSTRAR UNA PREGUNTA
// --------------------------------------------------------------------------
function mostrarPregunta(indice) {
    const pregunta = preguntas[indice];

    textoMensaje.textContent = `Pregunta ${indice + 1} de ${preguntas.length}`;
    preguntaTexto.textContent = pregunta.texto;
    opcionesGrid.innerHTML = "";

    pregunta.opciones.forEach((opcion, indiceOpcion) => {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "opcion-boton";
        boton.dataset.opcion = indiceOpcion;
        boton.innerHTML = `
            <span class="opcion-boton__letra">${LETRAS[indiceOpcion]}</span>
            <span>${opcion}</span>
        `;
        boton.addEventListener("click", () => manejarRespuesta(indice, indiceOpcion));
        opcionesGrid.appendChild(boton);
    });

    btnVolver.disabled = indice === 0;
    actualizarCamino(indice);
}

// --------------------------------------------------------------------------
// 6. MANEJO DE UNA RESPUESTA
// Se guarda la respuesta, se celebra siempre (refuerzo positivo constante,
// sin remarcar si fue correcta o no) y se avanza automáticamente.
// --------------------------------------------------------------------------
function manejarRespuesta(indicePregunta, indiceOpcion) {
    respuestasUsuario[indicePregunta] = indiceOpcion;

    // Marca visualmente la opción elegida
    document.querySelectorAll(".opcion-boton").forEach(boton => {
        boton.classList.toggle("seleccionada", Number(boton.dataset.opcion) === indiceOpcion);
        boton.disabled = true;
    });

    // Mensaje de ánimo aleatorio + celebración breve de Nimi
    textoMensaje.textContent = mensajesAnimo[Math.floor(Math.random() * mensajesAnimo.length)];
    celebrarMascota(mascotaJuego);

    // Espera un momento para que el niño vea la selección y el mensaje
    // antes de pasar a la siguiente pregunta.
    setTimeout(() => avanzar(indicePregunta), 900);
}

function celebrarMascota(elementoMascota) {
    elementoMascota.classList.add("mascota--feliz", "mascota--rebote");
    setTimeout(() => {
        elementoMascota.classList.remove("mascota--feliz", "mascota--rebote");
    }, 700);
}

// --------------------------------------------------------------------------
// 7. AVANZAR O TERMINAR
// --------------------------------------------------------------------------
function avanzar(indiceActual) {
    const esUltimaPregunta = indiceActual === preguntas.length - 1;

    if (esUltimaPregunta) {
        finalizarEvaluacion();
        return;
    }

    // Animación de salida y entrada de la tarjeta de pregunta
    tarjetaPregunta.classList.add("saliendo");
    setTimeout(() => {
        preguntaActual = indiceActual + 1;
        mostrarPregunta(preguntaActual);
        tarjetaPregunta.classList.remove("saliendo");
    }, 250);
}

btnVolver.addEventListener("click", () => {
    if (preguntaActual > 0) {
        preguntaActual--;
        mostrarPregunta(preguntaActual);
    }
});

// --------------------------------------------------------------------------
// 8. CALIFICACIÓN Y PANTALLA FINAL
// --------------------------------------------------------------------------
function finalizarEvaluacion() {
    let puntaje = 0;
    preguntas.forEach((pregunta, indice) => {
        if (respuestasUsuario[indice] === pregunta.correcta) {
            puntaje++;
        }
    });

    let nivel, descripcion;
    if (puntaje === 5) {
        nivel = "Nivel 3: Alto";
        descripcion = "¡Wow! Resolviste todo muy bien. Vamos con retos más grandes.";
    } else if (puntaje >= 3) {
        nivel = "Nivel 2: Medio";
        descripcion = "¡Buen trabajo! Vamos a seguir practicando juntos.";
    } else {
        nivel = "Nivel 1: Básico";
        descripcion = "¡Empezamos con buen pie! Iremos paso a paso.";
    }

    resultadoNivel.textContent = nivel;
    resultadoDescripcion.textContent = descripcion;
    mostrarPantalla(pantallaResultado);

    if (!prefiereMovimientoReducido) {
        lanzarConfeti();
    }

    // Guarda el nivel calculado para usarlo al presionar "Continuar"
    btnContinuar.dataset.nivel = nivel;
}


// --------------------------------------------------------------------------
// 9. CONFETI (decorativo, se omite si el usuario prefiere menos movimiento)
// --------------------------------------------------------------------------
function lanzarConfeti() {
    const colores = ["#4E8098", "#F2B84B", "#E4756B", "#386577"];

    for (let i = 0; i < 40; i++) {
        const pieza = document.createElement("div");
        pieza.className = "confeti-pieza";
        pieza.style.left = `${Math.random() * 100}vw`;
        pieza.style.backgroundColor = colores[Math.floor(Math.random() * colores.length)];
        pieza.style.animationDuration = `${1.5 + Math.random() * 1.5}s`;
        confetiContenedor.appendChild(pieza);

        // Limpieza: elimina cada pieza cuando termina su animación
        pieza.addEventListener("animationend", () => pieza.remove());
    }
}

// --------------------------------------------------------------------------
// 10. NAVEGACIÓN DE PANTALLAS PRINCIPALES
// --------------------------------------------------------------------------
btnEmpezar.addEventListener("click", () => {
    mostrarPantalla(pantallaJuego);
    mostrarPregunta(preguntaActual);
});

btnContinuar.addEventListener("click", () => {
    // Ajusta estas rutas a los archivos reales de tu proyecto.
    const destinos = {
        "Nivel 1: Básico": "diferencias.html",
        "Nivel 2: Medio": "memoria.html",
        "Nivel 3: Alto": "tangram.html"
    };
    window.location.href = destinos[btnContinuar.dataset.nivel];
});

// --------------------------------------------------------------------------
// 11. INICIO
// --------------------------------------------------------------------------
construirCamino();