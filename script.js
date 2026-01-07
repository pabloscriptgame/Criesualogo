// AOS
AOS.init({ duration: 1000, once: true });

// Tema claro/escuro
document.querySelector('.theme-toggle').onclick = () => {
    document.body.classList.toggle('light');
    const icon = document.querySelector('.theme-toggle i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
};

// Menu mobile
document.querySelector('.hamburger').onclick = () => {
    document.querySelector('.nav').classList.toggle('active');
};

// Smooth scroll + fechar menu mobile ao clicar em link
document.querySelectorAll('.nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
        // Fecha menu mobile
        document.querySelector('.nav').classList.remove('active');
    });
});

// Player de rádio
const audio = new Audio('https://stream.zeno.fm/si5xey7akartv.mp3');
const playPause = document.getElementById('playPause');
const volume = document.getElementById('volume');

playPause.onclick = () => {
    if (audio.paused) {
        audio.play().catch(e => console.log("Autoplay bloqueado:", e));
        playPause.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        audio.pause();
        playPause.innerHTML = '<i class="fas fa-play"></i>';
    }
};

volume.oninput = () => audio.volume = volume.value;

// GERADOR IA – Pollinations.AI + FLUX
document.getElementById('generateIA').onclick = async () => {
    const promptInput = document.getElementById('promptIA');
    const prompt = promptInput.value.trim();
    
    if (!prompt) {
        alert('Digite um prompt pra gerar a imagem, irmão! 🔥');
        return;
    }

    const loading = document.getElementById('loadingIA');
    const img = document.getElementById('generatedIA');
    const generateBtn = document.getElementById('generateIA');

    loading.style.display = 'block';
    img.style.display = 'none';
    generateBtn.disabled = true;
    generateBtn.innerHTML = 'Gerando Imagen...';

    const enhancedPrompt = `${prompt}, logomarca 3D profissional, alta resolução, ultra detalhado, fundo escuro infinito, iluminação cinematográfica volumétrica, foco nítido, estilo clean e futurista, octane render, ray tracing, simetria perfeita, sem distorção de texto`;

    try {
        const encodedPrompt = encodeURIComponent(enhancedPrompt);
        const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=flux&width=1024&height=1024&seed=random&nologo=true&enhance=true`;

        const response = await fetch(url, { method: 'HEAD' });
        if (!response.ok) throw new Error('Serviço temporário indisponível');

        img.src = url + `&t=${Date.now()}`;
        img.style.display = 'block';

    } catch (e) {
        console.error(e);
        alert('Deu um probleminha temporário 😔\nTenta de novo em 10 segundos ou simplifica o prompt.\nDica: descreva bem o nome da marca e o estilo desejado!');
    } finally {
        loading.style.display = 'none';
        generateBtn.disabled = false;
        generateBtn.innerHTML = 'Gerar Imagem';
    }
};

// Portfólio
const images = [
    { src: "https://i.ibb.co/XRrVpch/logo-segura.png", cat: "logos" },
    { src: "https://i.ibb.co/DPDZb4W1/Gemini-Generated-Image-40opkn40opkn40op-Photoroom.png", cat: "logos" },
    { src: "https://i.ibb.co/ksq33qGv/20250911-135505.png", cat: "logos" },
    { src: "https://i.ibb.co/1GVPXDrS/20251022-124747.png", cat: "logos" },
    { src: "https://i.ibb.co/MD2d4Rf7/LOGOMARCA-Rafaela-Oliveira-Store-2025.png", cat: "logos" },
    { src: "https://i.ibb.co/7t25mYfx/480470cba7087d7de97fd77cfe2d62c0-high-Photoroom.png", cat: "logos" },
    { src: "https://i.ibb.co/fYbmj9q4/5.png", cat: "sites" },
    { src: "https://i.ibb.co/yncNjVkY/123123.png", cat: "sites" }
];

const gallery = document.getElementById('gallery');
images.forEach(item => {
    const div = document.createElement('div');
    div.className = `item ${item.cat}`;
    div.innerHTML = `<img src="${item.src}" alt="Portfólio" loading="lazy">`;
    div.onclick = () => {
        document.getElementById('lightbox-img').src = item.src;
        document.getElementById('lightbox').classList.add('active');
    };
    gallery.appendChild(div);
});

// Filtros portfólio
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.gallery .item').forEach(el => {
            el.style.display = (filter === 'all' || el.classList.contains(filter)) ? 'block' : 'none';
        });
    };
});

// Lightbox
document.querySelector('.close-lightbox').onclick = () => {
    document.getElementById('lightbox').classList.remove('active');
};

// CHAT INTELIGENTE
const chatBody = document.getElementById('chatBody');
const chatInput = document.getElementById('chatMsg');
const sendBtn = document.getElementById('sendMsg');
const chatWindow = document.querySelector('.chat-window');
const chatToggle = document.querySelector('.chat-toggle');
const closeChat = document.querySelector('.close-chat');

let conversationStarted = false;
let context = {
    nomeMarca: null,
    tipoServico: null,
    cores: null,
    vibe: null,
    nomeCliente: null,
    jaPediuOrcamento: false
};

function addMsg(text, isUser = false) {
    const div = document.createElement('div');
    div.className = `msg ${isUser ? 'user' : 'ai'}`;
    div.innerHTML = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'msg ai typing';
    typing.id = 'typing-indicator';
    typing.innerHTML = 'Pablo tá digitando<span class="dots"></span>';
    chatBody.appendChild(typing);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function removeTyping() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
}

function getResponse(userText) {
    const text = userText.toLowerCase().trim();

    if (!conversationStarted) {
        conversationStarted = true;
        return `Fala, meu parceiro! 🔥🔥<br><br>
        Eu sou o assistente do <strong>Pablo Designer</strong>, especialista em logomarcas 3D profissionais que impactam.<br><br>
        Hoje tu veio atrás de quê?<br>
        • Logomarca 3D<br>
        • Site que vende<br>
        • Pack de posts<br>
        • Gerar imagem IA<br><br>
        Manda aí que eu te ajudo! ❓`;
    }

    if (!context.nomeMarca) {
        const match = userText.match(/(?:marca|nome|chama|é|se chama)\s*["']?([^"',\.?!]{2,30})/i);
        if (match) context.nomeMarca = match[1].trim();
    }

    if (text.includes('logo') || text.includes('logomarca') || text.includes('marca')) {
        context.tipoServico = 'logo';
        let resp = `Logomarca 3D profissional é minha especialidade, irmão! 🔥<br><br>Estilo clean, alta qualidade, impacto visual forte.<br><br>`;
        if (context.nomeMarca) resp += `Já anotei que a marca é <strong>${context.nomeMarca}</strong>. Perfeito!<br><br>`;
        else resp += `Me fala o nome da marca?<br><br>`;
        resp += `<strong>Valores 2026:</strong><br>• Logo 3D estático → R$ 70–120<br>• Logo animado → R$ 150–250<br>• Pacote completo → R$ 350–500<br><br>Qual estilo tu quer? (minimalista, metálico, dourado, colorido...)`;
        return resp;
    }

    return `Entendi! 👊<br><br>Me dá mais detalhes da marca ou projeto que eu te oriento melhor 🔥`;
}

function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMsg(text, true);
    chatInput.value = '';

    showTyping();

    const delay = 1000 + Math.random() * 2000;

    setTimeout(() => {
        removeTyping();
        addMsg(getResponse(text));
    }, delay);
}

sendBtn.onclick = sendMessage;
chatInput.onkeypress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
};

chatToggle.onclick = () => {
    chatWindow.classList.toggle('active');
    if (chatWindow.classList.contains('active') && !conversationStarted) {
        setTimeout(() => {
            addMsg(`Yo! 🔥 Bem-vindo ao chat do <strong>Pablo Designer</strong>.<br><br>Especialista em logomarcas 3D profissionais.<br><br>Qual é a boa hoje? 💻`);
            conversationStarted = true;
        }, 500);
    }
};

closeChat.onclick = () => {
    chatWindow.classList.remove('active');
};

// ========================
// BANNER PUBLICITÁRIO DINÂMICO
// ========================

function createBanner() {
    const banner = document.createElement('div');
    banner.classList.add('banner');
    banner.setAttribute('data-aos', 'fade-up');

    const content = document.createElement('div');
    content.classList.add('content');

    const h1 = document.createElement('h1');
    h1.textContent = 'DELÍCIAS QUE VOCÊ MERECE!';

    const subtitle = document.createElement('p');
    subtitle.classList.add('subtitle');
    subtitle.textContent = 'Sabor caseiro com muito capricho';

    const sites = document.createElement('div');
    sites.classList.add('sites');

    const link1 = document.createElement('a');
    link1.href = 'https://www.degusto.store';
    link1.classList.add('site-link');
    link1.target = '_blank';
    link1.textContent = 'www.degusto.store';

    const separator = document.createElement('span');
    separator.textContent = ' • ';

    const link2 = document.createElement('a');
    link2.href = 'https://www.batatarecheada.shop';
    link2.classList.add('site-link');
    link2.target = '_blank';
    link2.textContent = 'www.batatarecheada.shop';

    sites.appendChild(link1);
    sites.appendChild(separator);
    sites.appendChild(link2);

    content.appendChild(h1);
    content.appendChild(subtitle);
    content.appendChild(sites);
    banner.appendChild(content);

    return banner;
}

// Insere o banner após a seção de serviços
document.addEventListener('DOMContentLoaded', () => {
    const servicosSection = document.getElementById('servicos');
    if (servicosSection) {
        const banner = createBanner();
        servicosSection.after(banner);
        AOS.refresh(); // Atualiza AOS para animar o elemento dinâmico
    }
})

// AJUSTE DINÂMICO DO PLAYER FIXO E BOTÃO DE CHAT
document.addEventListener('DOMContentLoaded', () => {
    const radioPlayer = document.querySelector('.radio-player');
    const chatToggle = document.querySelector('.chat-toggle');

    if (radioPlayer) {
        function ajustarLayout() {
            const alturaPlayer = radioPlayer.offsetHeight;

            // Adiciona padding no body para não sobrepor conteúdo
            document.body.style.paddingBottom = `${alturaPlayer + 30}px`;

            // Posiciona o botão de chat acima do player
            if (chatToggle) {
                chatToggle.style.bottom = `${alturaPlayer + 20}px`;
            }
        }

        // Executa na carga, redimensionamento e mudança de orientação
        ajustarLayout();
        window.addEventListener('resize', ajustarLayout);
        window.addEventListener('orientationchange', () => {
            setTimeout(ajustarLayout, 300); // Pequeno delay para recalcular após rotação
        });
    }
});