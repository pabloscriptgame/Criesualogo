// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Hamburger Menu (Mobile) - Melhorado para overlay completo e animação suave
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active'); // Animação no hamburger
        document.body.classList.toggle('menu-open'); // Bloqueia scroll quando menu aberto
    });

    // Fecha menu ao clicar em um link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Fecha menu ao clicar fora (overlay)
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

// Toggle Chatbot
function toggleChat() {
    const chat = document.getElementById('chatbot');
    if (chat) {
        chat.style.display = chat.style.display === 'flex' ? 'none' : 'flex';
    }
}

// AI Chat Mais Inteligente (Respostas Avançadas com Contexto e Variações)
let chatHistory = []; // Para manter contexto da conversa

const responses = {
    // Saudações e boas-vindas
    'olá|oi|ei|hello|hi': [
        'Olá! Bem-vindo ao Pablo Studio. Conte-me sobre sua ideia: um logo 3D dourado ou um site elegante?',
        'Oi! Sou o assistente do Pablo Studio. O que te traz aqui hoje? Um projeto de design ou algo mais criativo?'
    ],

    // Sobre sites
    'site|website|página|web': [
        'Perfeito! Nossos sites são responsivos, com temas gold como este, integrações Google e chat IA. Qual funcionalidade prioriza? E-commerce, portfólio ou blog?',
        'Sites modernos e otimizados para SEO. Posso criar algo personalizado. Qual o foco do seu negócio?'
    ],

    // Sobre logos
    'logo|marca|branding|identidade': [
        'Logos 3D premium com acabamento gold para impacto máximo. Envie detalhes da sua marca para um esboço inicial. Qual o nome da empresa?',
        'Crio logos que capturam a essência da sua marca. Prefere estilo minimalista ou mais elaborado?'
    ],

    // Sobre vídeos
    'vídeo|video|edição|animação': [
        'Edição de vídeo profissional com transições suaves e áudio customizado. Qual o tema do seu conteúdo? Corporativo, promocional ou social?',
        'Vídeos que engajam! Conte mais sobre o script ou duração desejada.'
    ],

    // Sobre música
    'música|musica|trilha|som|audio': [
        'Criação de trilhas originais, harmonizadas para branding. Prefere estilo clássico ou moderno? Jazz, eletrônica ou orquestral?',
        'Músicas personalizadas para elevar seu vídeo ou site. Qual o mood que você busca?'
    ],

    // Sobre artes e imagens
    'arte|imagem|design|gráfico|promocional': [
        'Artes visuais impactantes para redes sociais e materiais de marketing. Qual o formato? Banner, post ou flyer?',
        'Design gráfico premium com toques dourados. Descreva o conceito para eu sugerir ideias!'
    ],

    // Preços e orçamentos
    'preço|quanto|custa|orçamento|valor': [
        'Orçamentos personalizados! Para logos 3D, a partir de R$ 500. Sites completos a partir de R$ 2.000. Vamos agendar uma call para detalhes exatos?',
        'Valores variam pelo escopo: simples ou premium. Me diga o serviço e eu estimo rapidinho.'
    ],

    // Projetos gerais
    'projeto|ideia|criar|desenvolver': [
        'Adoro transformar ideias em realidade! Qual o seu conceito inicial? Logo, site ou vídeo completo?',
        'Vamos planejar! Descreva o que imagina e eu ajudo a refinar.'
    ],

    // Contato e próximos passos
    'contato|whatsapp|email|telefone': [
        'Entre em contato via WhatsApp: (34) 99811-0946. Ou me diga mais para eu te guiar!',
        'Posso te conectar direto com o Pablo. Qual o melhor canal para você?'
    ],

    // Despedidas
    'tchau|bye|obrigado|valeu|até logo': [
        'Até breve! Qualquer dúvida, é só voltar. Seu projeto vai brilhar! 🚀',
        'Obrigado pela conversa! Estou aqui quando precisar.'
    ],

    // Default com sugestões baseadas em histórico
    'default': [
        'Entendi! Para mais precisão, descreva seu projeto: logo, site, vídeo ou arte? Estou aqui para refinar ideias.',
        'Hmm, me conte mais. Qual serviço te interessa mais? Ou tem uma ideia específica em mente?'
    ]
};

// Função para gerar resposta inteligente com contexto
function generateResponse(message) {
    const lowerMessage = message.toLowerCase().trim();
    chatHistory.push({ sender: 'user', text: message });

    // Procura por match exato ou parcial nos keys
    for (let key in responses) {
        if (key === 'default') continue;
        const keywords = key.split('|');
        if (keywords.some(kw => lowerMessage.includes(kw))) {
            const options = responses[key];
            let response = options[Math.floor(Math.random() * options.length)]; // Variação aleatória

            // Adiciona contexto baseado no histórico recente
            if (chatHistory.length > 1) {
                const lastUserMsg = chatHistory[chatHistory.length - 2].text.toLowerCase();
                if (lastUserMsg.includes('logo') && lowerMessage.includes('preço')) {
                    response = 'Para logos 3D, partindo de R$ 500. Mas depende do nível de detalhe. Quer um orçamento rápido?';
                } else if (lastUserMsg.includes('site') && lowerMessage.includes('funcionalidade')) {
                    response = 'Integrações como chat IA, formulários e e-commerce. Qual você prioriza?';
                }
            }

            chatHistory.push({ sender: 'bot', text: response });
            return response;
        }
    }

    // Default com sugestão baseada no histórico
    const defaultOptions = responses['default'];
    let defaultResponse = defaultOptions[Math.floor(Math.random() * defaultOptions.length)];
    if (chatHistory.length > 1) {
        const recentTopics = chatHistory.slice(-3).filter(msg => msg.sender === 'user').map(msg => msg.text.toLowerCase());
        if (recentTopics.some(topic => topic.includes('logo'))) {
            defaultResponse = 'Falando em logos, quer ver exemplos de 3D gold? Ou prefere outro serviço?';
        } else if (recentTopics.some(topic => topic.includes('site'))) {
            defaultResponse = 'Sobre sites, posso integrar ferramentas como Google Analytics. O que acha?';
        }
    }

    chatHistory.push({ sender: 'bot', text: defaultResponse });
    return defaultResponse;
}

function sendMessage(event) {
    if ((event && event.keyCode === 13) || event.target.tagName === 'BUTTON') {
        const input = document.getElementById('chat-input');
        if (input) {
            const message = input.value.trim();
            if (message) {
                addMessage(message, 'user');
                input.value = '';

                // Resposta IA Mais Inteligente
                setTimeout(() => {
                    const response = generateResponse(message);
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
console.log('Chat IA aprimorado: Mais respostas variadas, contexto de conversa e sugestões inteligentes. Hospede em HTTPS para integrações plenas.');