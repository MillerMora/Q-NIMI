
// 1. Definimos las parejas de emojis (6 parejas = 12 tarjetas en total)
const emojis = ['🦁', '🦁', '🐵', '🐵', '🦊', '🦊', '🐼', '🐼', '🐸', '🐸', '🐷', '🐷'];

// 2. Mezclamos las tarjetas de forma aleatoria cada vez que inicia
emojis.sort(() => Math.random() - 0.5);

const tablero = document.getElementById('tablero');
const mensajeVictoria = document.getElementById('mensaje-victoria');

let tarjetasVolteadas = [];
let parejasEncontradas = 0;

// 3. Creamos dinámicamente las tarjetas en el HTML
emojis.forEach((emoji) => {
    const tarjeta = document.createElement('div');
    tarjeta.classList.add('tarjeta2');
    tarjeta.dataset.valor = emoji;
    tarjeta.textContent = emoji;

    tarjeta.addEventListener('click', voltearTarjeta);
    tablero.appendChild(tarjeta);
});

// 4. Lógica para voltear e inspeccionar las tarjetas
function voltearTarjeta() {
    // Evitar voltear más de 2 tarjetas a la vez
    if (tarjetasVolteadas.length === 2) return;

    this.classList.add('volteada');
    tarjetasVolteadas.push(this);

    if (tarjetasVolteadas.length === 2) {
        verificarPareja();
    }
}

// 5. Comprobar si las dos tarjetas seleccionadas son iguales
function verificarPareja() {
    const [tarjeta1, tarjeta2] = tarjetasVolteadas;

    if (tarjeta1.dataset.valor === tarjeta2.dataset.valor) {
        // ¡Es una pareja correcta!
        tarjeta1.classList.add('emparejada');
        tarjeta2.classList.add('emparejada');
        parejasEncontradas++;

        tarjetasVolteadas = [];

        // Verificar condición de victoria
        if (parejasEncontradas === emojis.length / 2) {
            mensajeVictoria.style.display = 'block';
            guardarResultado(2); // juego_id de "Memoria parejas"
        }
    } else {
        // No son iguales: Esperar un segundo y volver a ocultarlas
        setTimeout(() => {
            tarjeta1.classList.remove('volteada');
            tarjeta2.classList.remove('volteada');
            tarjetasVolteadas = [];
        }, 1000); // 1000 milisegundos = 1 segundo (ideal para nivel fácil)
    }
}
async function guardarResultado(juego_id) {
    const usuario_id = localStorage.getItem('usuario_id');
    if (!usuario_id) return; // no hay sesión activa, no se guarda

    const puntaje = 100; // define tu propia fórmula de puntaje si aplica

    try {
        await fetch('http://127.0.0.1:8000/resultados/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: Number(usuario_id), juego_id, puntaje })
        });
    } catch (error) {
        console.error('No se pudo guardar el resultado:', error);
    }
}