// ==================== REFERENCIAS Y ESTADO ====================

const authModal = document.querySelector('#authModal');
const authPanels = document.querySelectorAll('[data-auth-panel]');
const facePanel = document.querySelector('[data-face-panel]');
const faceVideo = document.querySelector('[data-face-video]');
const faceStatus = document.querySelector('[data-face-status]');
const questionsPanel = document.querySelector('[data-questions-panel]');
const finalRegisterPanel = document.querySelector('[data-register-final-panel]');
const questionsContainer = document.querySelector('.questions-container');

let cameraStream;
let currentMode = 'login'; // 'login', 'register', o 'register-face'
let currentQuestionIndex = 0;
let currentResponderRole = '';
const questionsAnswers = {};

const preguntasAdulto = [
    { q: '¿Cuál es tu posición?', options: ['Tutor', 'Profesional'] },
    { q: '¿Con qué frecuencia utilizas dispositivos como celular, tablet o computador?', options: ['Nunca', 'Algunas veces', 'Casi todos los días', 'Todos los días'] },
    { q: '¿Qué suele hacer el niño cuando termina una actividad?', options: ['Se retira', 'Sigue con la siguiente', 'Busca el resultado para mejorar'] },
    { q: '¿Qué tipo de cosas lo suelen distraer?', options: ['Ruidos', 'Otras personas', 'Imágenes', 'Puede mantener la concentración'] },
    { q: '¿Suele recordar lo que aprendió antes?', options: ['Con facilidad', 'Algunas veces', 'Necesita repasar', 'Le cuesta demasiado'] },
    { q: '¿Puede agrupar o diferenciar objetos/imágenes con características similares?', options: ['Sí', 'Algunas veces', 'Le cuesta', 'Ni idea'] }
];

const preguntasEstudiante = [
    { q: '¿Cuál de estas actividades te parece más divertida?', options: ['Unir imágenes', 'Ordenar elementos', 'Elegir una respuesta', 'Escuchar y responder', 'Juegos de memoria'] },
    { q: '¿Qué te gustaría encontrar en Q’NAMI?', options: ['Imágenes y colores', 'Sonidos', 'Actividades interactivas'] },
    { q: '¿Diferencias y relacionas figuras o sonidos?', options: ['Imágenes y colores', 'Sonidos', 'Actividades interactivas'] },
    { q: '¿Cuál de estos animales vive en el agua?', options: ['🐶 Perro', '🐱 Gato', '🐟 Pez'], isTest: true },
    { q: '¿Cuál de estos va con una cama?', options: ['🛏 Almohada', '⚽ Pelota', '🍽 Plato'], isTest: true },
    { q: '¿Cuántos días tiene una semana?', options: ['7', '8', '5', '6'], isTest: true },
    { q: '¿Cuál es el color del sol en este dibujo? ☀️', options: ['Azul', 'Verde', 'Amarillo', 'Morado'], isTest: true },
    { q: '¿Cuál de estos objetos sirve para escribir?', options: ['🥄 Cuchara', '✏ Lápiz', '👟 Zapato', '🥤 Vaso'], isTest: true }
];

function getPreguntasActuales() {
    return currentResponderRole === 'adulto' ? preguntasAdulto : preguntasEstudiante;
}

function selectRegisterRole(role) {
    currentResponderRole = role;
    const selectedText = document.querySelector('[data-role-selected]');
    if (selectedText) {
        selectedText.textContent = currentResponderRole === 'adulto'
            ? 'Formulario para: Acudiente / Adulto'
            : 'Formulario para: Estudiante';
    }

    showQuestionsPanel();
}

function showFinalRegisterPanel() {
    authPanels.forEach((panel) => { panel.hidden = true; });
    questionsPanel.hidden = true;
    facePanel.hidden = true;
    if (finalRegisterPanel) finalRegisterPanel.hidden = false;
}

async function startFaceRegistrationFlow() {
    currentMode = 'register-face';
    authPanels.forEach((panel) => { panel.hidden = true; });
    questionsPanel.hidden = true;
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
}

function showFinalCompletionState() {
    authPanels.forEach((panel) => { panel.hidden = true; });
    questionsPanel.hidden = true;
    facePanel.hidden = true;
    finalRegisterPanel.hidden = true;

    const completionPanel = document.createElement('div');
    completionPanel.className = 'auth-panel';
    completionPanel.innerHTML = `
        <p class="auth-panel__eyebrow">Proceso completado</p>
        <h2 class="auth-panel__titulo">¡Registro completado!</h2>
        <p class="auth-panel__texto">La información del formulario y del niño quedó registrada en el flujo del frontend.</p>
        <div class="debug-output" style="margin-top: 1rem; text-align: left;">
            <strong>Rol:</strong> ${currentResponderRole === 'adulto' ? 'Acudiente / Adulto' : 'Estudiante'}<br>
            <strong>Respuestas:</strong> ${Object.keys(questionsAnswers).length}<br>
            <strong>Registro facial:</strong> ${currentResponderRole === 'estudiante' ? 'Sí' : 'No requerido'}
        </div>
        <button type="button" class="boton boton--primario" data-auth-close>Volver</button>
    `;

    const existing = authModal.querySelector('[data-final-state]');
    if (existing) existing.remove();
    completionPanel.setAttribute('data-final-state', 'true');
    authModal.querySelector('.modal__contenido').appendChild(completionPanel);
}

// ==================== FUNCIONES DE MODAL ====================

// Muestra solo el formulario solicitado y actualiza el nombre accesible del dialogo.
function showAuthPanel(panelName) {
    facePanel.hidden = true;
    questionsPanel.hidden = true;
    if (finalRegisterPanel) finalRegisterPanel.hidden = true;
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
    if (!currentResponderRole) {
        currentResponderRole = 'estudiante';
    }

    authPanels.forEach((panel) => { panel.hidden = true; });
    questionsPanel.hidden = false;
    facePanel.hidden = true;
    currentQuestionIndex = 0;
    Object.keys(questionsAnswers).forEach(key => delete questionsAnswers[key]);

    const roleBanner = questionsPanel.querySelector('[data-role-banner]');
    if (roleBanner) {
        roleBanner.textContent = currentResponderRole === 'adulto'
            ? 'Formulario para: Acudiente / Adulto'
            : 'Formulario para: Estudiante';
    }

    const questionsContainer = questionsPanel.querySelector('[data-questions-container]');
    questionsContainer.innerHTML = '';

    const preguntasActuales = getPreguntasActuales();
    preguntasActuales.forEach((pregunta, index) => {
        const questionEl = document.createElement('div');
        questionEl.className = 'question';
        questionEl.dataset.question = String(index + 1);

        const contentEl = document.createElement('div');
        contentEl.className = 'question__content';

        const textEl = document.createElement('p');
        textEl.className = 'question__text';
        textEl.textContent = `${index + 1}. ${pregunta.q}`;

        const optionsEl = document.createElement('div');
        optionsEl.className = 'question__options';

        pregunta.options.forEach((option) => {
            const optionBtn = document.createElement('button');
            optionBtn.type = 'button';
            optionBtn.className = 'question__option';
            optionBtn.dataset.option = option;
            optionBtn.textContent = option;
            optionBtn.addEventListener('click', handleOptionClick);
            optionsEl.appendChild(optionBtn);
        });

        contentEl.appendChild(textEl);
        contentEl.appendChild(optionsEl);
        questionEl.appendChild(contentEl);
        questionsContainer.appendChild(questionEl);
    });

    const btnNext = questionsPanel.querySelector('[data-questions-next]');
    const btnSkip = questionsPanel.querySelector('[data-questions-skip]');

    if (btnNext) btnNext.onclick = () => nextQuestion();
    if (btnSkip) btnSkip.onclick = () => skipQuestions();

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
        const isCurrent = index === currentQuestionIndex;
        question.style.opacity = isCurrent ? '1' : '0';
        question.style.pointerEvents = isCurrent ? 'auto' : 'none';
        question.style.transform = isCurrent ? 'translateX(0)' : (index < currentQuestionIndex ? 'translateX(-100%)' : 'translateX(100%)');
        question.style.visibility = isCurrent ? 'visible' : 'hidden';
        question.hidden = !isCurrent;
    });

    const progressFill = questionsPanel.querySelector('[data-progress-fill]');
    const progressPercent = totalQuestions ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
    progressFill.style.width = progressPercent + '%';

    questionsPanel.querySelector('[data-current-question]').textContent = currentQuestionIndex + 1;
    questionsPanel.querySelector('[data-total-questions]').textContent = totalQuestions;
}

function nextQuestion() {
    const questions = questionsPanel.querySelectorAll('.question');
    const currentQuestion = questions[currentQuestionIndex];
    const selectedOption = currentQuestion?.querySelector('.question__option.selected');

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
        if (currentResponderRole === 'estudiante') {
            startFaceRegistrationFlow();
        } else {
            showFinalRegisterPanel();
        }
    }
}

function skipQuestions() {
    if (currentResponderRole === 'estudiante') {
        startFaceRegistrationFlow();
        return;
    }

    showFinalRegisterPanel();
}

function completeQuestions() {
    showFinalCompletionState();
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
    await startFaceRegistrationFlow();
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
        faceStatus.textContent = 'Rostro detectado.';
        if (currentMode === 'register-face') {
            showFinalRegisterPanel();
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

document.querySelectorAll('[data-role-select]').forEach((button) => {
    button.addEventListener('click', () => {
        selectRegisterRole(button.dataset.roleSelect);
    });
});

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
document.querySelector('#loginForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.target;
    const nombre_usuario = form.querySelector('[name="usuario"]').value;
    const password = form.querySelector('[name="contraseña"]').value;

    try {
        const response = await fetch('http://127.0.0.1:8000/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre_usuario, password })
        });

        if (!response.ok) {
            alert('Usuario o contraseña incorrectos');
            return;
        }

        const usuario = await response.json();
        localStorage.setItem('usuario_id', usuario.usuario_id);
        localStorage.setItem('nombre_usuario', usuario.nombre_usuario);
        closeAuthModal();
        actualizarNavbar();
        window.location.href = 'seleccion-niveles.html';
        window.location.href = 'seleccion-niveles.html'; // ajusta a tu vista real
    } catch (error) {
        alert('Error de conexión: ' + error.message);
    }
});

// Manejo del formulario de registro - mostrar preguntas al crear cuenta
document.querySelector('[data-create-account]')?.addEventListener('click', async (event) => {
    event.preventDefault();
    const registerForm = document.querySelector('#registerForm');
    if (!registerForm.checkValidity()) {
        registerForm.reportValidity();
        return;
    }

    const nombre_usuario = registerForm.querySelector('[name="usuario"]').value;
    const password = registerForm.querySelector('[name="contraseña"]').value;

    try {
        const response = await fetch('http://127.0.0.1:8000/usuarios/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre_usuario, password })
        });

        if (!response.ok) throw new Error('No se pudo crear el usuario');

        const usuario = await response.json();
        localStorage.setItem('usuario_id', usuario.usuario_id);
        localStorage.setItem('nombre_usuario', usuario.nombre_usuario);
    } catch (error) {
        console.warn('Backend no disponible, continuando en modo demo:', error.message);
        localStorage.setItem('usuario_id', 'demo-user');
        localStorage.setItem('nombre_usuario', nombre_usuario);
        alert('No se pudo conectar con el servidor, pero puedes continuar con la prueba del registro en la interfaz.');
    }

    actualizarNavbar();

    if (!currentResponderRole) {
        currentResponderRole = 'estudiante';
    }

    showQuestionsPanel();
});

// Opción de recuperar contraseña
document.querySelector('[data-recover-password]')?.addEventListener('click', (event) => {
    event.preventDefault();
    alert('Función de recuperar contraseña: Pronto podrás recuperar tu contraseña mediante correo electrónico.');
});

// ==================== NAVBAR DINÁMICO ====================

const navbarInvitado = document.querySelector('[data-navbar-invitado]');
const navbarSesion = document.querySelector('[data-navbar-sesion]');
const navbarNombre = document.querySelector('[data-navbar-nombre]');

function actualizarNavbar() {
    const usuarioId = localStorage.getItem('usuario_id');

    if (usuarioId) {
        navbarInvitado.hidden = true;
        navbarSesion.hidden = false;
        navbarNombre.textContent = localStorage.getItem('nombre_usuario') || 'Usuario';
    } else {
        navbarInvitado.hidden = false;
        navbarSesion.hidden = true;
    }
}

document.querySelector('[data-logout]')?.addEventListener('click', () => {
    localStorage.removeItem('usuario_id');
    localStorage.removeItem('nombre_usuario');
    actualizarNavbar();
});

// Se ejecuta al cargar la página, para reflejar si ya había sesión guardada
actualizarNavbar();