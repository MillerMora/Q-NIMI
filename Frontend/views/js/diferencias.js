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
                            alert('¡Felicidades! Encontraste todas las diferencias. 🎉');
                        }, 300);
                    }
                }
            });
        });