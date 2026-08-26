// Referencias a los elementos del modal y al panel de reconocimiento facial.
const authModal = document.querySelector('#authModal');
const authPanels = document.querySelectorAll('[data-auth-panel]');
const facePanel = document.querySelector('[data-face-panel]');
const faceVideo = document.querySelector('[data-face-video]');
const faceStatus = document.querySelector('[data-face-status]');
let cameraStream;

// Muestra solo el formulario solicitado y actualiza el nombre accesible del dialogo.
function showAuthPanel(panelName) {
    facePanel.hidden = true;
    authPanels.forEach((panel) => {
        panel.hidden = panel.dataset.authPanel !== panelName;
    });
    authModal.setAttribute('aria-labelledby', panelName === 'register' ? 'registerTitle' : 'authTitle');
}

// Abre el modal, bloquea el desplazamiento de la pagina y enfoca el primer campo.
function openAuthModal(panelName) {
    showAuthPanel(panelName);
    authModal.classList.add('is-visible');
    authModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    authModal.querySelector(`[data-auth-panel="${panelName}"] input`)?.focus();
}

// Libera la camara para evitar que siga activa al salir del panel facial.
function stopCamera() {
    cameraStream?.getTracks().forEach((track) => track.stop());
    cameraStream = undefined;
    faceVideo.srcObject = null;
}

// Cierra el modal y restaura el estado normal de la pagina.
function closeAuthModal() {
    stopCamera();
    authModal.classList.remove('is-visible');
    authModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Conecta los accesos de la barra de navegacion con el modal.
document.querySelectorAll('[data-auth-open]').forEach((button) => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        openAuthModal(button.dataset.authOpen);
    });
});

// Permite cerrar y alternar entre los formularios sin recargar la pagina.
document.querySelector('[data-auth-close]').addEventListener('click', closeAuthModal);
document.querySelectorAll('[data-auth-switch]').forEach((button) => {
    button.addEventListener('click', () => openAuthModal(button.dataset.authSwitch));
});

authModal.addEventListener('click', (event) => {
    if (event.target === authModal) closeAuthModal();
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && authModal.classList.contains('is-visible')) closeAuthModal();
});

// Estos formularios son de demostracion hasta que se conecte el backend.
document.querySelectorAll('.auth-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('El formulario está listo para conectarse con el backend.');
    });
});

// Solicita acceso a la camara del dispositivo para iniciar el reconocimiento facial.
document.querySelector('[data-face-start]').addEventListener('click', async () => {
    authPanels.forEach((panel) => { panel.hidden = true; });
    facePanel.hidden = false;
    faceStatus.textContent = 'Solicitando permiso para usar la cámara...';

    if (!navigator.mediaDevices?.getUserMedia) {
        faceStatus.textContent = 'Este navegador no permite usar la cámara aquí.';
        return;
    }

    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        faceVideo.srcObject = cameraStream;
        faceStatus.textContent = 'Coloca tu rostro frente a la cámara y pulsa Reconocer rostro.';
    } catch {
        faceStatus.textContent = 'No se pudo acceder a la cámara. Revisa el permiso del navegador.';
    }
});

// Detecta si hay un rostro en la imagen; la validacion de identidad requiere backend.
document.querySelector('[data-face-scan]').addEventListener('click', async () => {
    if (!cameraStream) return;
    if (!('FaceDetector' in window)) {
        faceStatus.textContent = 'La cámara funciona, pero este navegador no incluye detección facial.';
        return;
    }

    const faces = await new FaceDetector().detect(faceVideo);
    faceStatus.textContent = faces.length
        ? 'Rostro detectado. La validación de identidad debe conectarse al backend.'
        : 'No detectamos un rostro. Ajusta la posición e inténtalo de nuevo.';
});

// Regresa al inicio de sesion y detiene la camara.
document.querySelector('[data-face-cancel]').addEventListener('click', () => {
    stopCamera();
    showAuthPanel('login');
});