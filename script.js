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
        document.querySelector('.nav').classList.remove('active');
    });
});

// Player de rádio (agora só o player do topo)
const audio = new Audio('https://stream.zeno.fm/si5xey7akartv.mp3');
const topPlayPause = document.getElementById('topPlayPause');
const topRadioPlayer = document.querySelector('.top-radio-player');

function updatePlayIcons(playing) {
    const icon = playing ? 'fa-pause' : 'fa-play';
    if (topPlayPause) topPlayPause.innerHTML = `<i class="fas ${icon}"></i>`;
}

function togglePlay() {
    if (audio.paused) {
        audio.play().catch(e => console.log("Autoplay bloqueado:", e));
        updatePlayIcons(true);
    } else {
        audio.pause();
        updatePlayIcons(false);
    }
}

if (topPlayPause) topPlayPause.onclick = togglePlay;

// Posiciona o player fino logo abaixo do header
document.addEventListener('DOMContentLoaded', () => {
    if (topRadioPlayer) {
        function posicionarTopPlayer() {
            const headerHeight = document.querySelector('.header').offsetHeight;
            topRadioPlayer.style.top = `${headerHeight}px`;
            topRadioPlayer.style.display = 'block';
        }
        posicionarTopPlayer();
        window.addEventListener('resize', posicionarTopPlayer);
        window.addEventListener('orientationchange', () => setTimeout(posicionarTopPlayer, 300));
    }
});

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

// CHAT INTELIGENTE (VERSÃO MELHORADA 2026)
const chatBody = document.getElementById('chatBody');
const chatInput = document.getElementById('chatMsg');
const sendBtn = document.getElementById('sendMsg');
const chatWindow = document.querySelector('.chat-window');
const chatToggle = document.querySelector('.chat-toggle');
const closeChat = document.querySelector('.close-chat');

let conversationStarted = false;

const context = {
    nomeCliente: null,
    nomeMarca: null,
    tipoServico: null,
    cores: null,
    vibe: null,
    detalhesExtras: null,
    etapa: 'inicio' // controla o fluxo
};

const SEU_NUMERO_WHATSAPP = "559999999999"; // ⚠️ TROQUE AQUI PELO SEU NÚMERO REAL

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

function gerarLinkWhatsApp() {
    let mensagem = `Olá Pablo! 🔥%0a%0aGostaria de um orçamento para:`;

    if (context.tipoServico) mensagem += `%0a• Serviço: ${context.tipoServico}`;
    if (context.nomeMarca) mensagem += `%0a• Nome da marca: ${context.nomeMarca}`;
    if (context.nomeCliente) mensagem += `%0a• Meu nome: ${context.nomeCliente}`;
    if (context.cores) mensagem += `%0a• Cores desejadas: ${context.cores}`;
    if (context.vibe) mensagem += `%0a• Estilo/Vibe: ${context.vibe}`;
    if (context.detalhesExtras) mensagem += `%0a• Detalhes extras: ${context.detalhesExtras}`;

    mensagem += `%0a%0aPode me passar os valores e prazos? 😎`;

    return `https://wa.me/${SEU_NUMERO_WHATSAPP}?text=${mensagem}`;
}

function enviarParaWhatsApp() {
    const link = gerarLinkWhatsApp();
    addMsg(`Perfeito, irmão! 🔥<br><br>
             Já organizei tudo pra você falar direto comigo no WhatsApp.<br><br>
             <a href="${link}" target="_blank" class="whatsapp-btn">
             <i class="fab fa-whatsapp"></i> Falar com Pablo no WhatsApp
             </a><br><br>
             Clica aí que já abre o chat com todos os seus detalhes preenchidos! 🚀`);

    window.open(link, '_blank');
}

function getResponse(userText) {
    const text = userText.toLowerCase().trim();

    // Extração automática de nome da marca e cliente
    if (!context.nomeMarca) {
        const matchMarca = userText.match(/(?:marca|loja|nome|chama|é|se chama)\s*["']?([^"',\.?!]{2,40})/i);
        if (matchMarca) context.nomeMarca = matchMarca[1].trim();
    }
    if (!context.nomeCliente) {
        const matchCliente = userText.match(/(?:eu sou|meu nome|chamo|sou)\s*["']?([^"',\.?!]{2,30})/i);
        if (matchCliente) context.nomeCliente = matchCliente[1].trim();
    }

    // Fluxo guiado (mantido exatamente igual)
    if (context.etapa === 'inicio') {
        context.etapa = 'servico';
        conversationStarted = true;
        return `Fala, meu parceiro! 🔥🔥<br><br>
                Eu sou o assistente do <strong>Pablo Designer</strong>, especialista em logomarcas 3D que convertem de verdade.<br><br>
                Hoje tu tá querendo o quê?<br><br>
                • Logomarca 3D (estática ou animada)<br>
                • Site profissional que vende<br>
                • Pack de posts pra redes<br>
                • Identidade visual completa<br><br>
                Manda aí que eu já te ajudo! 💬`;
    }

    // ... resto da função getResponse exatamente como estava no original ...
    // (omitido aqui por brevidade, mas deve ser mantido idêntico)

    return `Entendi! 👊<br><br>
            Pode mandar mais detalhes que eu ajusto.<br><br>
            Quando quiser, só falar "quero orçamento" ou "vamos pro WhatsApp" que eu te levo direto pro Pablo! 🔥`;
}

// ... resto do chat exatamente igual ...

// BANNER PUBLICITÁRIO DINÂMICO - APENAS ESTA PARTE FOI ALTERADA
function createBanner() {
    const banner = document.createElement('div');
    banner.classList.add('promo-banner');
    banner.setAttribute('data-aos', 'fade-up');
    banner.setAttribute('data-aos-delay', '150');

    banner.innerHTML = `
        <div class="banner-glow-layer"></div>
        
        <div class="banner-content">
            <h2 class="banner-title">
                <span class="highlight-word">DELÍCIAS</span><br>
                QUE VOCÊ <span class="highlight-word">MERECE</span>!
            </h2>

            <p class="banner-subtitle">
                Sabor caseiro, muito capricho e aquele carinho que só a gente sabe fazer ❤️
            </p>

            <div class="banner-links">
                <a href="https://www.degusto.store" target="_blank" class="site-button">
                    <i class="fas fa-utensils"></i> degusto.store
                </a>
                
                <span class="links-separator">•</span>
                
                <a href="https://www.batatarecheada.shop" target="_blank" class="site-button">
                    <i class="fas fa-cheese"></i> batatarecheada.shop
                </a>
            </div>

            <a href="https://www.degusto.store" target="_blank" class="neon-btn banner-cta">
                Conhecer<i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `;

    return banner;
}

document.addEventListener('DOMContentLoaded', () => {
    const servicosSection = document.getElementById('servicos');
    if (servicosSection) {
        const banner = createBanner();
        servicosSection.after(banner);
        AOS.refresh();
    }

});
