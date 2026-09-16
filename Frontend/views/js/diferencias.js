const diferencias = document.querySelectorAll('.diferencia');
const contadorTxt = document.getElementById('encontradas');
let encontradas = 0;
const totalDiferencias = diferencias.length;

diferencias.forEach(zona => {
    zona.addEventListener('click', () => {
        // Verificar si ya fue encontrada para no repetir
        if (!zona.classList.contains('encontrada')) {
            zona.classList.add('encontrada');
            encontradas++;
            contadorTxt.textContent = encontradas;

            // Alerta de victoria
            if (encontradas === totalDiferencias) {
                setTimeout(() => {
                    alert('¡Felicidades! Encontraste todas las diferencias.');
                    guardarResultado(1); // juego_id de "Buscar diferencias"
                }, 300);
            }
        }
    });
});

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