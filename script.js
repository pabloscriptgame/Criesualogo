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

// Animação visual das barras do player
const waveBars = document.querySelectorAll('.wave-bar');

function animateWaves() {
    waveBars.forEach(bar => {
        const height = Math.random() * 20 + 8;
        bar.style.height = `${height}px`;
    });
}
setInterval(animateWaves, 180);

// Gerador IA (mantido igual)
document.getElementById('generateIA').onclick = async() => {
    const prompt = document.getElementById('promptIA').value.trim();
    if (!prompt) return alert('Digite um prompt!');

    const loading = document.getElementById('loadingIA');
    const img = document.getElementById('generatedIA');

    loading.style.display = 'block';
    img.style.display = 'none';

    try {
        const full = prompt + " , 3D neon cyan metallic glowing trap style, dark background, professional logo, high detail, futuristic, ultra sharp, cinematic lighting";
        const result = await puter.ai.txt2img(full, { quality: "high" });
        img.src = result.src;
        img.style.display = 'block';
    } catch (e) {
        alert('Erro ao gerar. Tente novamente.');
        console.error(e);
    } finally {
        loading.style.display = 'none';
    }
};

// Portfólio (mantido igual)
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

// ───────────────────────────────────────────────
// CHAT SUPER INTELIGENTE – versão melhorada 2026
// ───────────────────────────────────────────────
const chatBody = document.getElementById('chatBody');
const chatInput = document.getElementById('chatMsg');
const sendBtn = document.getElementById('sendMsg');
const chatWindow = document.querySelector('.chat-window');
const chatToggle = document.querySelector('.chat-toggle');
const closeChat = document.querySelector('.close-chat');

let conversationStarted = false;

function addMsg(text, isUser = false) {
    const div = document.createElement('div');
    div.className = `msg ${isUser ? 'user' : 'ai'}`;
    div.innerHTML = text; // permite <br>, <strong>, etc.
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'msg ai typing';
    typing.innerHTML = 'Digitando<span class="dots"></span>';
    chatBody.appendChild(typing);
    chatBody.scrollTop = chatBody.scrollHeight;
    return typing;
}

function removeTyping(typingEl) {
    if (typingEl && typingEl.parentNode) typingEl.remove();
}

// Respostas inteligentes
function getResponse(userText) {
    const text = userText.toLowerCase().trim();

    if (!conversationStarted) {
        conversationStarted = true;
        return `Fala meu parceiro! 🔥 Sou o assistente neon do <strong>Pablo Designer</strong>.<br><br>
        O que tu tá precisando hoje?<br>
        • Logo 3D trap neon<br>• Site que vende<br>• Pack de posts que bomba<br>• Gerar imagem IA foda<br>• Preço / prazo<br><br>
        Manda aí que eu te coloco no caminho certo! 😈`;
    }

    // Palavras-chave principais
    if (text.includes('logo') || text.includes('logomarca') || text.includes('marca')) {
        return `Logos 3D neon trap / metallic glowing é o que eu mais faço!<br><br>
        <strong>Valores reais 2026:</strong><br>
        • Logo 3D simples → R$ 50 a 100<br>
        • Logo animação curta → R$ 100 a 200<br>
        • Pacote trap completo (logo + capa + 8 posts) → R$ 200 <br><br>
        Me fala o nome da marca, cores principais e a vibe (trap, funk, streetwear, rap, etc) que eu já começo a montar o conceito na cabeça! 🚀`;
    }

    if (text.includes('site') || text.includes('website') || text.includes('página')) {
        if (text.includes('quanto') || text.includes('preço') || text.includes('valor') || text.includes('orçamento')) {
            return `Sites modernos eu entrego no ponto:<br><br>
            • Landing page one-page → R$ 120<br>
            • Site 3–5 páginas + domínio + hospedagem 1 ano → R$ 1.000<br>
            • Site completo + SEO inicial + manutenção 3 meses → sob consulta<br><br>
            Qual o ramo do negócio? (barbearia, moda, estúdio musical, etc) e quantas páginas você imagina?`;
        }
        return `Sites rápidos, responsivos e com identidade neon/futurista são comigo mesmo.<br>
        Já fiz pra marcas de trap, barbearias, moda street, academias... Qual o seu projeto? Me conta a ideia!`;
    }

    if (text.includes('gerar') || text.includes('ia') || text.includes('imagem') || text.includes('foto')) {
        return `Bora gerar imagem matadora com IA?<br><br>
        1. Vai na seção <strong>Gerador IA</strong> ali em cima<br>
        2. Digita o prompt (quanto mais detalhado, melhor)<br>
        3. Clica em "Gerar Imagem"<br><br>
        Quer um prompt poderoso pra copiar e colar? Exemplo:<br>
        <em>"Logotipo 3D para marcas, metal escovado, fundo preto infinito, glow intenso, ultra detalhado"</em><br><br>
        Só pedir que eu te mando vários! 😈`;
    }

    if (text.includes('quanto') || text.includes('preço') || text.includes('valor') || text.includes('orçamento') || text.includes('quanto custa')) {
        return `Tabela rápida real 2026:<br><br>
        • Logo 3D  → R$ 50–100<br>
        • Logo + animação → R$ 100–200<br>
        • Site com carrinho de compra via zap → R$ 200–400 Mensal<br>
        • Pack 10 posts/stories propaganda → R$ 450<br>
        • Pacote trap (logo + site + posts) → sob consulta<br><br>
        Me fala exatamente o que você precisa que eu monto um orçamento na hora!`;
    }

    if (text.includes('portfolio') || text.includes('portfólio') || text.includes('trabalhos') || text.includes('exemplos')) {
        return `Meu portfólio tá logo ali na seção <strong>Portfólio</strong> ↑<br>
        Tem vários logos 3D neon trap, mockups e alguns sites.<br>
        Pode filtrar por "Logos 3D" ou "Sites".<br><br>
        Quer que eu te indique qual estilo combina mais com o que você tá pensando? (mais cyan, mais pink, mais dark metal...)`;
    }

    if (text.includes('oi') || text.includes('olá') || text.includes('e aí') || text.includes('fala') || text === 'opa') {
        return `Fala meu consagrado! 🔥<br>
        Pronto pra deixar sua marca brilhando no modo neon trap? 😈<br>
        Manda o que tu precisa hoje!`;
    }

    // Resposta genérica inteligente
    return `Entendi a vibe! 🔥<br>
    Me dá mais detalhes do que você quer (logo, site, posts, animação, preço, prazo...).<br><br>
    Exemplos que ajudam muito:<br>
    • "quero logo trap neon pro meu canal de funk 150 bpm"<br>
    • "quanto fica site pra barbearia com 4 páginas?"<br>
    • "gera banner neon pra promoção de Black Friday"<br><br>
    Quanto mais específico, mais rápido eu te entrego algo insano!`;
}

// Evento de envio
function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMsg(text, true);
    chatInput.value = '';

    const typing = showTyping();

    setTimeout(() => {
        removeTyping(typing);
        addMsg(getResponse(text));
    }, 800 + Math.random() * 1200); // tempo realista de resposta
}

sendBtn.onclick = sendMessage;
chatInput.onkeypress = e => {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
    }
};

// Abre chat com mensagem inicial
chatToggle.onclick = () => {
    chatWindow.classList.toggle('active');
    if (chatWindow.classList.contains('active') && !conversationStarted) {
        setTimeout(() => {
            addMsg(`Yo! 🔥 Bem-vindo ao chat do <strong>Pablo Designer</strong>.<br><br>
            Tô aqui pra te ajudar com:<br>
            • Logos 3D neon trap<br>• Sites que convertem<br>• Propaganda visual matadora<br>• Imagens IA instantâneas<br><br>
            Qual é a boa hoje? Manda aí! 😈`);
        }, 400);
    }
};

closeChat.onclick = () => {
    chatWindow.classList.remove('active');

};


