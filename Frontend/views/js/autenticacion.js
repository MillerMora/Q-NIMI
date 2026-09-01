// ==================== REFERENCIAS Y ESTADO ====================

const authModal = document.querySelector('#authModal');
const authPanels = document.querySelectorAll('[data-auth-panel]');
const facePanel = document.querySelector('[data-face-panel]');
const faceVideo = document.querySelector('[data-face-video]');
const faceStatus = document.querySelector('[data-face-status]');
const questionsPanel = document.querySelector('[data-questions-panel]');
const questionsContainer = document.querySelector('.questions-container');

let cameraStream;
let currentMode = 'login'; // 'login', 'register', o 'register-face'
let currentQuestionIndex = 0;
const questionsAnswers = {};

// ==================== FUNCIONES DE MODAL ====================

// Muestra solo el formulario solicitado y actualiza el nombre accesible del dialogo.
function showAuthPanel(panelName) {
    facePanel.hidden = true;
    questionsPanel.hidden = true;
    authPanels.forEach((panel) => {
        panel.hidden = panel.dataset.authPanel !== panelName;
    });
    authModal.setAttribute('aria-labelledby', panelName === 'register' ? 'registerTitle' : 'authTitle');
}

// Abre el modal, bloquea el desplazamiento de la pagina y enfoca el primer campo.
function openAuthModal(panelName) {
    currentMode = panelName;
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
    currentQuestionIndex = 0;
}

// ==================== FUNCIONES DEL PANEL DE PREGUNTAS ====================

function showQuestionsPanel() {
    authPanels.forEach((panel) => { panel.hidden = true; });
    questionsPanel.hidden = false;
    currentQuestionIndex = 0;
    Object.keys(questionsAnswers).forEach(key => delete questionsAnswers[key]);
    
    // Limpiar selecciones previas
    questionsPanel.querySelectorAll('.question__option.selected').forEach((opt) => {
        opt.classList.remove('selected');
    });
    
    // Agregar listeners a las opciones
    questionsPanel.querySelectorAll('.question__option').forEach((option) => {
        option.removeEventListener('click', handleOptionClick);
        option.addEventListener('click', handleOptionClick);
    });
    
    // Asignar listeners directamente a los botones
    const btnNext = questionsPanel.querySelector('[data-questions-next]');
    const btnSkip = questionsPanel.querySelector('[data-questions-skip]');
    
    // Usar onclick en lugar de addEventListener para evitar múltiples listeners
    if (btnNext) {
        btnNext.onclick = function() {
            nextQuestion();
        };
    }
    
    if (btnSkip) {
        btnSkip.onclick = function() {
            skipQuestions();
        };
    }
    
    updateQuestionsPanel();
}

function handleOptionClick(e) {
    const option = e.currentTarget;
    const question = option.closest('.question');
    question.querySelectorAll('.question__option').forEach((opt) => opt.classList.remove('selected'));
    option.classList.add('selected');
}

function updateQuestionsPanel() {
    const questions = questionsPanel.querySelectorAll('.question');
    const totalQuestions = questions.length;

    questions.forEach((question, index) => {
        if (index === currentQuestionIndex) {
            question.style.opacity = '1';
            question.style.pointerEvents = 'auto';
            question.style.transform = 'translateX(0)';
        } else if (index < currentQuestionIndex) {
            question.style.opacity = '0';
            question.style.pointerEvents = 'none';
            question.style.transform = 'translateX(-100%)';
        } else {
            question.style.opacity = '0';
            question.style.pointerEvents = 'none';
            question.style.transform = 'translateX(100%)';
        }
    });

    // Actualiza la barra de progreso
    const progressFill = questionsPanel.querySelector('[data-progress-fill]');
    const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    progressFill.style.width = progressPercent + '%';

    // Actualiza el contador
    questionsPanel.querySelector('[data-current-question]').textContent = currentQuestionIndex + 1;
    questionsPanel.querySelector('[data-total-questions]').textContent = totalQuestions;
}

function nextQuestion() {
    const questions = questionsPanel.querySelectorAll('.question');
    const currentQuestion = questions[currentQuestionIndex];
    const selectedOption = currentQuestion.querySelector('.question__option.selected');

    if (!selectedOption) {
        alert('Por favor, selecciona una opción antes de continuar.');
        return;
    }

    const questionNumber = currentQuestion.dataset.question;
    questionsAnswers[questionNumber] = selectedOption.dataset.option;

    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        updateQuestionsPanel();
    } else {
        // Todas las preguntas completadas
        completeQuestions();
    }
}

function skipQuestions() {
    alert('Registro completado. Las preguntas se pueden responder más tarde.');
    closeAuthModal();
}

function completeQuestions() {
    alert('¡Gracias por completar tu perfil! Tus preferencias se han guardado.');
    closeAuthModal();
    console.log('Respuestas guardadas:', questionsAnswers);
}

// ==================== RECONOCIMIENTO FACIAL ====================

// Para login - Solicita acceso a la camara del dispositivo
document.querySelector('[data-face-start]')?.addEventListener('click', async () => {
    currentMode = 'login-face';
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

// Para registro - Solicita acceso a la camara del dispositivo
document.querySelector('[data-face-start-register]')?.addEventListener('click', async () => {
    currentMode = 'register-face';
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
document.querySelector('[data-face-scan]')?.addEventListener('click', async () => {
    if (!cameraStream) return;
    if (!('FaceDetector' in window)) {
        faceStatus.textContent = 'La cámara funciona, pero este navegador no incluye detección facial.';
        return;
    }

    const faces = await new FaceDetector().detect(faceVideo);
    if (faces.length) {
        faceStatus.textContent = 'Rostro detectado. Redirigiendo...';
        if (currentMode === 'register-face') {
            showQuestionsPanel();
        } else {
            alert('Autenticación facial completada. Redirigiendo al juego...');
            closeAuthModal();
        }
    } else {
        faceStatus.textContent = 'No detectamos un rostro. Ajusta la posición e inténtalo de nuevo.';
    }
});

// Regresa al panel anterior y detiene la camara.
document.querySelector('[data-face-cancel]')?.addEventListener('click', () => {
    stopCamera();
    if (currentMode === 'register-face') {
        showAuthPanel('register');
    } else {
        showAuthPanel('login');
    }
});

// ==================== ESCUCHADORES DE EVENTOS ====================

// Conecta los accesos de la barra de navegacion con el modal.
document.querySelectorAll('[data-auth-open]').forEach((button) => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        openAuthModal(button.dataset.authOpen);
    });
});

// Permite cerrar y alternar entre los formularios sin recargar la pagina.
document.querySelector('[data-auth-close]')?.addEventListener('click', closeAuthModal);

document.querySelectorAll('[data-auth-switch]').forEach((button) => {
    button.addEventListener('click', () => openAuthModal(button.dataset.authSwitch));
});

authModal?.addEventListener('click', (event) => {
    if (event.target === authModal) closeAuthModal();
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && authModal?.classList.contains('is-visible')) closeAuthModal();
});

// Manejo del formulario de login
document.querySelector('#loginForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('El formulario está listo para conectarse con el backend.');
});

// Manejo del formulario de registro - mostrar preguntas al crear cuenta
document.querySelector('[data-create-account]')?.addEventListener('click', (event) => {
    event.preventDefault();
    const registerForm = document.querySelector('#registerForm');
    if (registerForm.checkValidity()) {
        showQuestionsPanel();
    } else {
        registerForm.reportValidity();
    }
});

// Opción de recuperar contraseña
document.querySelector('[data-recover-password]')?.addEventListener('click', (event) => {
    event.preventDefault();
    alert('Función de recuperar contraseña: Pronto podrás recuperar tu contraseña mediante correo electrónico.');
});