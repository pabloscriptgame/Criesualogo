// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Hamburger Menu (Mobile)
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Toggle Chatbot
function toggleChat() {
    const chat = document.getElementById('chatbot');
    if (chat) {
        chat.style.display = chat.style.display === 'flex' ? 'none' : 'flex';
    }
}

// AI Chat Avançado (Respostas Inteligentes)
const responses = {
    'olá': 'Olá! Bem-vindo ao Pablo Studio. Conte-me sobre sua ideia: um logo 3D dourado ou um site elegante?',
    'site': 'Perfeito! Nossos sites são responsivos, com temas gold como este, integrações Google e chat IA. Qual funcionalidade prioriza?',
    'logo': 'Logos 3D premium com acabamento gold para impacto máximo. Envie detalhes da sua marca para um esboço inicial.',
    'vídeo': 'Edição de vídeo profissional com transições suaves e áudio customizado. Qual o tema do seu conteúdo?',
    'música': 'Criação de trilhas originais, harmonizadas para branding. Prefere estilo clássico ou moderno?',
    'default': 'Entendi! Para mais precisão, descreva seu projeto: logo, site, vídeo ou arte? Estou aqui para refinar ideias.'
};

function sendMessage(event) {
    if ((event && event.keyCode === 13) || event.target.tagName === 'BUTTON') {
        const input = document.getElementById('chat-input');
        if (input) {
            const message = input.value.trim().toLowerCase();
            if (message) {
                addMessage(input.value, 'user');
                input.value = '';

                // Resposta IA Dinâmica
                setTimeout(() => {
                    let response = responses.default;
                    for (let key in responses) {
                        if (message.includes(key)) {
                            response = responses[key];
                            break;
                        }
                    }
                    addMessage(response, 'bot');
                }, 800);
            }
        }
    }
}

function addMessage(text, sender) {
    const messages = document.getElementById('chat-messages');
    if (messages) {
        const div = document.createElement('div');
        div.className = `message ${sender}`;
        div.textContent = text;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }
}

// Animações ao Scroll (Intersection Observer)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationDelay = entry.target.dataset.delay || '0s';
            entry.target.classList.add('fade-in');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Segurança: Validação e HTTPS Recomendado
console.log('Site melhorado: Tema preto e ouro com bordas neon, mais profissional. Hospede em HTTPS para integrações Google plenas.');