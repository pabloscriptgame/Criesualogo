// Animações AOS
AOS.init({ duration: 1200 });

// Menu Hamburger
document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.nav').classList.toggle('active');
});

// Modo Claro/Escuro
document.querySelector('.toggle').addEventListener('click', () => {
    document.body.classList.toggle('light');
    const toggleIcon = document.querySelector('.toggle i');
    if (document.body.classList.contains('light')) {
        toggleIcon.classList.remove('fa-sun');
        toggleIcon.classList.add('fa-moon');
    } else {
        toggleIcon.classList.remove('fa-moon');
        toggleIcon.classList.add('fa-sun');
    }
});

// Scroll Suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
        if (window.innerWidth <= 768) {
            document.querySelector('.nav').classList.remove('active');
        }
    });
});

// Gerador IA Melhorado
document.getElementById('generateIA').addEventListener('click', async() => {
    let prompt = document.getElementById('promptIA').value.trim();
    if (!prompt) return alert('Digite um prompt detalhado pra gerar uma imagem top!');

    document.getElementById('loadingIA').style.display = 'block';
    document.getElementById('generatedIA').style.display = 'none';

    try {
        prompt = prompt + " , 3D neon cyan metallic glowing trap style, dark background, professional logo, high detail, futuristic, ultra sharp, cinematic lighting";
        const img = await puter.ai.txt2img(prompt, { quality: "high" });
        document.getElementById('generatedIA').src = img.src;
        document.getElementById('generatedIA').style.display = 'block';
    } catch (err) {
        alert('Erro ao gerar. Verifique conexão ou tente prompt mais simples!');
    } finally {
        document.getElementById('loadingIA').style.display = 'none';
    }
});

// Portfólio
const portfolioImages = [
    { src: "https://i.ibb.co/XRrVpch/logo-segura.png", cat: "logos" },
    { src: "https://i.ibb.co/DPDZb4W1/Gemini-Generated-Image-40opkn40opkn40op-Photoroom.png", cat: "logos" },
    { src: "https://i.ibb.co/KjXYTnyh/20251013-131541.png", cat: "logos" },
    { src: "https://i.ibb.co/ksq33qGv/20250911-135505.png", cat: "logos" },
    { src: "https://i.ibb.co/1GVPXDrS/20251022-124747.png", cat: "logos" },
    { src: "https://i.ibb.co/MD2d4Rf7/LOGOMARCA-Rafaela-Oliveira-Store-2025.png", cat: "logos" },
    { src: "https://i.ibb.co/cSj7z7fs/480470cba7087d7de97fd77cfe2d62c0-high.webp", cat: "logos" },
    { src: "https://assets.justinmind.com/wp-content/uploads/2020/02/website-mockup-examples-travel.png", cat: "sites" },
    { src: "https://assets.justinmind.com/wp-content/uploads/2020/02/free-website-mockups-lawyer.png", cat: "sites" },
    { src: "https://mockuptree.com/wp-content/uploads/2020/07/free-website-mockup-3d-perspective.jpg", cat: "sites" }
];

const gallery = document.getElementById('gallery');
portfolioImages.forEach(item => {
    const div = document.createElement('div');
    div.className = 'item ' + item.cat;
    div.innerHTML = `<img src="${item.src}" alt="Trabalho Pablo Designer Monte Carmelo MG">`;
    div.onclick = () => {
        document.getElementById('lightbox-img').src = item.src;
        document.getElementById('lightbox').style.display = 'flex';
    };
    gallery.appendChild(div);
});

// Filtros Portfólio
document.querySelectorAll('.filters button').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.gallery .item').forEach(item => {
            if (filter === 'all' || item.classList.contains(filter)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Lightbox
document.querySelector('.close-lightbox').onclick = () => {
    document.getElementById('lightbox').style.display = 'none';
};

// Chat IA Inteligente
const chatBody = document.getElementById('chatBody');

function addMsg(text, isUser = false) {
    const p = document.createElement('p');
    p.innerHTML = text;
    p.classList.add(isUser ? 'user-msg' : 'ai-msg');
    chatBody.appendChild(p);
    chatBody.scrollTop = chatBody.scrollHeight;
}

document.getElementById('sendMsg').onclick = sendChat;
document.getElementById('chatMsg').addEventListener('keypress', e => {
    if (e.key === 'Enter') sendChat();
});

async function sendChat() {
    const input = document.getElementById('chatMsg');
    const msg = input.value.trim();
    if (!msg) return;

    addMsg('Você: ' + msg, true);
    input.value = '';

    const lower = msg.toLowerCase();

    if (lower.includes('gerar') || lower.includes('imagem') || lower.includes('logo') || lower.includes('criar') || lower.includes('fazer') || lower.includes('desenhar')) {
        addMsg('IA: Gerando uma imagem incrível pra você... Aguenta aí! 🔥', false);
        try {
            let clean = msg.replace(/gerar|imagem|logo|ia|criar|fazer|por favor|please/gi, '').trim() || 'Logo 3D neon cyan metálico trap glowing';
            clean += " , 3D neon glowing cyan metallic trap style logo, dark background, high detail, professional, futuristic, ultra sharp";
            const img = await puter.ai.txt2img(clean, { quality: "high" });
            const el = document.createElement('img');
            el.src = img.src;
            el.style.maxWidth = '100%';
            el.style.borderRadius = '20px';
            el.style.marginTop = '15px';
            el.style.boxShadow = 'var(--neon)';
            chatBody.appendChild(el);
            chatBody.scrollTop = chatBody.scrollHeight;
        } catch (err) {
            addMsg('IA: Ops, erro ao gerar. Tenta de novo ou descreve melhor!', false);
        }
    } else if (lower.includes('orçamento') || lower.includes('preço') || lower.includes('valor') || lower.includes('quanto')) {
        addMsg('IA: Orçamentos variam conforme complexidade. Me chama no WhatsApp (34) 99811-0946 que eu te passo o valor certinho rapidinho! 🚀', false);
    } else if (lower.includes('monte carmelo') || lower.includes('mg') || lower.includes('minas')) {
        addMsg('IA: Sou de <strong>Monte Carmelo - MG</strong>! Atendo todo o Brasil remotamente. Como posso ajudar você hoje?', false);
    } else {
        const respostas = [
            "Fala aí! Sou especialista em logos 3D neon cyan incríveis. Descreve sua ideia que eu gero na hora!",
            "Sites modernos e responsivos como degusto.store são minha especialidade. Quer um orçamento?",
            "Me chama no WhatsApp (34) 99811-0946 pra fechar projeto rapidinho!",
            "Dica top: pra logos ficarem insanos, usa palavras como 'neon cyan', 'metálico', 'glowing', 'trap' no prompt!",
            "Trabalho em Monte Carmelo/MG - Brasil 🇧🇷. Atendo todo o país remotamente!",
            "Precisa de propaganda que vende? Posts, banners, motion graphics... Eu faço tudo!",
            "Olá de Monte Carmelo/MG! Como posso ajudar no seu projeto hoje?",
            "Quer ver exemplos reais? Dá uma olhada no portfólio aqui em cima!",
            "Posso gerar um logo 3D neon agora mesmo. Só descrever o que você quer!"
        ];
        setTimeout(() => addMsg('IA: ' + respostas[Math.floor(Math.random() * respostas.length)], false), 800);
    }
}

// Toggle Chat
document.querySelector('.chat-toggle').onclick = () => {
    document.querySelector('.chat-fixed').classList.toggle('active');
};
document.querySelector('.close-chat').onclick = () => {
    document.querySelector('.chat-fixed').classList.remove('active');
};