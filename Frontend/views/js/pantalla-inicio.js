/* --------------------------------------------------------------------------
   PANTALLA DE CARGA / INICIO
   Controla la aparición y el desvanecimiento de la pantalla de bienvenida
   que se muestra antes de mostrar el contenido del index.
   -------------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
    const pantallaCarga = document.getElementById("pantallaCarga");

    // Si por alguna razón el elemento no existe en la página, no hacemos nada.
    if (!pantallaCarga) return;

    // Tiempo mínimo (en milisegundos) que la pantalla permanece visible,
    // aunque el resto de la página cargue más rápido. Esto evita un
    // parpadeo si todo carga casi instantáneo. Se puede ajustar libremente.
    const TIEMPO_MINIMO_VISIBLE = 1200;

    const inicio = Date.now();

    const ocultarPantallaCarga = () => {
        const tiempoTranscurrido = Date.now() - inicio;
        const esperaRestante = Math.max(TIEMPO_MINIMO_VISIBLE - tiempoTranscurrido, 0);

        setTimeout(() => {
            // Dispara la transición de desvanecido definida en el CSS.
            pantallaCarga.classList.add("pantalla-carga--oculta");
            document.body.classList.remove("pantalla-carga-activa");

            // Cuando termina la transición, se elimina del DOM por completo
            // para que no quede interceptando clics ni el foco del teclado.
            pantallaCarga.addEventListener(
                "transitionend",
                () => pantallaCarga.remove(),
                { once: true }
            );
        }, esperaRestante);
    };

    // "load" espera a que también terminen de cargar imágenes y fuentes,
    // para que el desvanecido ocurra cuando el index ya se ve completo.
    if (document.readyState === "complete") {
        ocultarPantallaCarga();
    } else {
        window.addEventListener("load", ocultarPantallaCarga);
    }
});