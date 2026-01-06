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

// Animação das barras do player
const waveBars = document.querySelectorAll('.wave-bar');
function animateWaves() {
    waveBars.forEach(bar => {
        const height = Math.random() * 20 + 8;
        bar.style.height = `${height}px`;
    });
}
setInterval(animateWaves, 180);

// ───────────────────────────────────────────────
// GERADOR IA – FLUX via Pollinations.AI (gratuito, sem API key, qualidade TOP 2026) 🔥
// ───────────────────────────────────────────────
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
    generateBtn.innerHTML = 'Gerando com FLUX...';

    // Prompt aprimorado automaticamente pro teu estilo neon trap 3D
    const enhancedPrompt = `${prompt}, 3D render, neon cyan and purple metallic glowing letters, trap style logo, dark infinite black background, ultra sharp focus, cinematic volumetric lighting, high detail, professional studio quality, octane render, ray tracing, dramatic glow, futuristic vibe, perfect text, no distortion, symmetry`;

    try {
        // Pollinations.AI + FLUX – endpoint público e estável
        const url = `https://pollinations.ai/p/${encodeURIComponent(enhancedPrompt)}?model=flux&width=1024&height=1024&seed=-1&nologo=true&enhance=true`;

        // Verifica se a URL está acessível (evita erro)
        const response = await fetch(url, { method: 'HEAD' });
        if (!response.ok) throw new Error('Serviço temporariamente indisponível');

        img.src = url + `&t=${Date.now()}`; // evita cache
        img.style.display = 'block';

    } catch (e) {
        console.error(e);
        alert('Deu um probleminha temporário na geração 😔\nTenta de novo em 10 segundos ou simplifica o prompt.\nDica: prompts em português ou inglês funcionam perfeitamente!');
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
    { src: "https://i.ibb.co/cSj7z7fs/480470cba7087d7de97fd77cfe2d62c0-high.webp", cat: "logos" },
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

// Filtros do portfólio
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

// Fechar lightbox
document.querySelector('.close-lightbox').onclick = () => {
    document.getElementById('lightbox').classList.remove('active');
};

// ───────────────────────────────────────────────
// CHAT SUPER INTELIGENTE 2026 – Versão ULTRA Conversacional
// ───────────────────────────────────────────────
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
        Eu sou o assistente do <strong>Pablo Designer</strong>, o cara que deixa marca brilhando no modo neon trap.<br><br>
        Hoje tu veio atrás de quê?<br>
        • Logo 3D insano que brilha<br>
        • Site que vende sozinho<br>
        • Pack de posts que bomba no Insta<br>
        • Imagem IA rapidinha<br>
        • Só bater papo sobre design?<br><br>
        Manda a real que eu já te coloco no caminho certo! 😈`;
    }

    // Captura nome da marca
    if (!context.nomeMarca) {
        const match = userText.match(/(?:marca|nome|chama|é|se chama)\s*["']?([^"',\.?!]{2,30})/i);
        if (match) context.nomeMarca = match[1].trim();
    }

    if (text.includes('logo') || text.includes('logomarca') || text.includes('marca')) {
        context.tipoServico = 'logo';
        let resp = `Logo 3D neon trap é minha especialidade, irmão! 🔥<br><br>Fico brabo nesse estilo metálico com glow violento e fundo preto infinito.<br><br>`;
        if (context.nomeMarca) resp += `Já anotei que a marca é <strong>${context.nomeMarca}</strong>. Top!<br><br>`;
        else resp += `Me fala o nome da marca que tu quer?<br><br>`;
        resp += `<strong>Valores 2026:</strong><br>• Logo 3D estático → R$ 70–120<br>• Logo animado (pra Reels) → R$ 150–250<br>• Pacote trap completo → R$ 350–500<br><br>Qual vibe tu curte mais? Cyan + pink? Roxo? Dourado metálico?`;
        return resp;
    }

    if (text.includes('site') || text.includes('website') || text.includes('loja') || text.includes('página')) {
        context.tipoServico = 'site';
        let resp = `Sites que convertem de verdade eu entrego no ponto!<br><br>Responsivo, rápido e com a identidade da tua marca.<br><br>`;
        if (text.includes('quanto') || text.includes('preço')) resp += `<strong>Preços 2026:</strong><br>• Landing page → R$ 150–300<br>• Site completo + domínio → R$ 1.200–1.800<br><br>`;
        resp += `Qual o ramo do projeto? Quer com carrinho de compras ou só lead pro Zap?`;
        return resp;
    }

    if (text.includes('post') || text.includes('story') || text.includes('artes')) {
        return `Pack de posts eu faço pra explodir o engajamento!<br><br>• 10 posts + 10 stories → R$ 450<br>• 20 posts + 15 stories + capas → R$ 750<br><br>Tema da campanha? Lançamento, promo, Black Friday?<br>Tudo no estilo neon trap se tu quiser 😈`;
    }

    if (text.includes('gerar') || text.includes('ia') || text.includes('imagem')) {
        let exemplo = context.nomeMarca ? context.nomeMarca : "TUA MARCA AQUI";
        return `Bora gerar imagem insana agora?<br><br>Copia e cola esse prompt pronto na seção <strong>Gerador IA</strong>:<br><br><em>"${exemplo} logo 3D neon cyan purple metallic glowing trap style, dark background, ultra detailed, cinematic lighting"</em><br><br>Clica em gerar que sai coisa braba em segundos! 🔥`;
    }

    if (text.includes('quanto') || text.includes('preço') || text.includes('valor') || text.includes('orçamento')) {
        if (!context.jaPediuOrcamento) {
            context.jaPediuOrcamento = true;
            return `Tabela rápida 2026:<br><br>• Logo 3D → R$ 70–120<br>• Logo animado → R$ 150–250<br>• Pack trap completo → R$ 350–500<br>• Landing page → R$ 150–300<br>• Site completo → R$ 1.200+<br><br>Fala exatamente o que tu quer que eu monto o orçamento na hora! 🚀`;
        }
    }

    if (text.includes('zap') || text.includes('whatsapp') || text.includes('falar') || text.includes('fechar')) {
        return `Perfeito, irmão! 🔥<br><br>Melhor continuar no WhatsApp pra eu te mandar mockups, opções e fechar tudo direitinho.<br><br>Clica no ícone do Zap ou <a href="https://wa.me/55SEUNUMERO" target="_blank">clica aqui</a> e manda "Vi no site" que eu te atendo voando! 😈`;
    }

    if (text.includes('oi') || text.includes('olá') || text.includes('salve') || text.includes('fala')) {
        return `Salve, meu consagrado! 🔥<br>Pronto pra deixar tua marca no modo Deus?<br><br>Manda o que tu precisa hoje que eu já te ajudo! 😈`;
    }

    return `Entendi a visão! 👊<br><br>Pra eu te ajudar melhor:<br>• Qual o nome da marca/projeto?<br>• Quer logo, site, posts ou pacote?<br>• Qual a vibe (trap, cyber, street, funk...)?<br><br>Quanto mais detalhe, mais brabo fica o resultado 🔥`;
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
            addMsg(`Yo! 🔥 Bem-vindo ao chat do <strong>Pablo Designer</strong>.<br><br>Tô aqui pra te colocar no jogo com design que brilha de verdade.<br><br>Qual é a boa hoje, irmão? Manda aí que eu já te ajudo 😈`);
            conversationStarted = true;
        }, 500);
    }
};

closeChat.onclick = () => {
    chatWindow.classList.remove('active');
};