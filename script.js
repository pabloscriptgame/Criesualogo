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
        audio.play();
        playPause.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        audio.pause();
        playPause.innerHTML = '<i class="fas fa-play"></i>';
    }
};

volume.oninput = () => audio.volume = volume.value;

// Gerador IA
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
    } finally {
        loading.style.display = 'none';
    }
};

// Portfólio (suas imagens originais)
const images = [
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

// Chat
const chatBody = document.getElementById('chatBody');
const chatInput = document.getElementById('chatMsg');
const sendBtn = document.getElementById('sendMsg');

function addChatMsg(text, isUser = false) {
    const div = document.createElement('div');
    div.className = `msg ${isUser ? 'user' : 'ai'}`;
    div.textContent = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
}

sendBtn.onclick = () => {
    const text = chatInput.value.trim();
    if (!text) return;
    addChatMsg(text, true);
    chatInput.value = '';

    setTimeout(() => {
        addChatMsg("Estou analisando sua ideia... Pode mandar mais detalhes do que você quer!");
    }, 900);
};

chatInput.onkeypress = e => { if (e.key === 'Enter') sendBtn.click(); };

document.querySelector('.chat-toggle').onclick = () => {
    document.querySelector('.chat-window').classList.toggle('active');
};

document.querySelector('.close-chat').onclick = () => {
    document.querySelector('.chat-window').classList.remove('active');
};