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

// Gerador IA
document.getElementById('generateIA').addEventListener('click', async() => {
    const prompt = document.getElementById('promptIA').value.trim();
    if (!prompt) return alert('Digite um prompt para gerar a imagem!');

    document.getElementById('loadingIA').style.display = 'block';
    document.getElementById('generatedIA').style.display = 'none';

    try {
        const img = await puter.ai.txt2img(prompt);
        document.getElementById('generatedIA').src = img.src;
        document.getElementById('generatedIA').style.display = 'block';
    } catch (err) {
        alert('Erro ao gerar imagem. Tente novamente!');
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
    div.innerHTML = `<img src="${item.src}" alt="Trabalho Pablo Designer">`;
    div.onclick = () => {
        document.getElementById('lightbox-img').src = item.src;
        document.getElementById('lightbox').style.display = 'flex';
    };
    gallery.appendChild(div);
});

// Filtros do Portfólio
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

// Lightbox fechar
document.querySelector('.close-lightbox').onclick = () => {
    document.getElementById('lightbox').style.display = 'none';
};

// Chat IA
const chatBody = document.getElementById('chatBody');

function addMsg(text, isUser = false) {
    const p = document.createElement('p');
    p.textContent = text;
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

    if (msg.toLowerCase().includes('gerar') || msg.toLowerCase().includes('imagem') || msg.toLowerCase().includes('logo')) {
        addMsg('IA: Gerando imagem pra você...', false);
        try {
            const clean = msg.replace(/gerar|imagem|logo|ia/gi, '').trim() || 'Logo 3D neon cyan trap metálico';
            const img = await puter.ai.txt2img(clean);
            const el = document.createElement('img');
            el.src = img.src;
            el.style.maxWidth = '100%';
            el.style.borderRadius = '20px';
            el.style.marginTop = '15px';
            el.style.boxShadow = 'var(--neon)';
            chatBody.appendChild(el);
            chatBody.scrollTop = chatBody.scrollHeight;
        } catch (err) {
            addMsg('IA: Erro ao gerar imagem. Tente de novo!', false);
        }
    } else {
        const respostas = [
            "Fala aí! Posso criar um logo 3D neon incrível pra sua marca.",
            "Sites modernos como degusto.store e batatarecheada.shop são minha praia!",
            "Quer orçamento? Me chama no WhatsApp (34) 99811-0946",
            "Dica: no gerador use palavras como 'neon', 'cyan', 'metálico', 'trap' pra ficar top!"
        ];
        setTimeout(() => addMsg('IA: ' + respostas[Math.floor(Math.random() * respostas.length)]), 1200);
    }
}

// Toggle Chat
document.querySelector('.chat-toggle').onclick = () => {
    document.querySelector('.chat-fixed').classList.toggle('active');
};
document.querySelector('.close-chat').onclick = () => {
    document.querySelector('.chat-fixed').classList.remove('active');
};