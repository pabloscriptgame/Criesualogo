// Inicializa animações AOS
AOS.init({ duration: 1200 });

// Menu Hamburger Mobile
document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.nav').classList.toggle('active');
});

// Dark / Light Mode Toggle
document.querySelector('.toggle').addEventListener('click', () => {
    document.body.classList.toggle('light');
    document.querySelector('.toggle').textContent = document.body.classList.contains('light') ? '☀️' : '🌙';
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        if (window.innerWidth <= 768) {
            document.querySelector('.nav').classList.remove('active');
        }
    });
});

// Gerador de Imagens Lite
const iaImages = [
    "https://img.freepik.com/free-photo/3d-render-vs-company-metal-letter-logo-pen-tool-created-clipping-path-included-jpeg-easy-composite_460848-10423.jpg",
    "https://img.freepik.com/free-psd/sale-object-3d-render-isolated-illustration_47987-27569.jpg",
    "https://thumbs.dreamstime.com/b/industrial-metal-letter-h-sculpture-modern-design-textured-grey-background-410926229.jpg",
    "https://thumbs.dreamstime.com/z/metallic-emblem-close-up-blue-orange-neon-lights-tech-branding-futuristic-design-metallic-emblem-close-up-blue-orange-neon-326813279.jpg",
    "https://www.logoground.com/uploads14/dv14y2025105792025-05-212697476lg-ortegagraphics-futuristic-science-fiction-stylized-letter-o-3d.jpg",
    "https://i.etsystatic.com/44403991/r/il/5022c5/7061873066/il_570xN.7061873066_g0z4.jpg",
    "https://img.freepik.com/free-psd/golden-logo-mockup-facade-sign_145008-113.jpg"
];

document.getElementById('generateIA').addEventListener('click', () => {
    const prompt = document.getElementById('promptIA').value.trim();
    if (!prompt) return alert('Por favor, digite um prompt!');

    document.getElementById('loadingIA').style.display = 'block';
    document.getElementById('generatedIA').style.display = 'none';

    setTimeout(() => {
        const randomImg = iaImages[Math.floor(Math.random() * iaImages.length)];
        document.getElementById('generatedIA').src = randomImg;
        document.getElementById('generatedIA').style.display = 'block';
        document.getElementById('loadingIA').style.display = 'none';
    }, 3000);
});

// Portfólio - Imagens (com categorias)
const portfolioImages = [
    { src: "https://img.freepik.com/free-photo/3d-render-vs-company-metal-letter-logo-pen-tool-created-clipping-path-included-jpeg-easy-composite_460848-10423.jpg", cat: "logos" },
    { src: "https://img.freepik.com/free-psd/sale-object-3d-render-isolated-illustration_47987-27569.jpg", cat: "logos" },
    { src: "https://thumbs.dreamstime.com/b/industrial-metal-letter-h-sculpture-modern-design-textured-grey-background-410926229.jpg", cat: "logos" },
    { src: "https://www.logoground.com/uploads14/dv14y2025105792025-05-212697476lg-ortegagraphics-futuristic-science-fiction-stylized-letter-o-3d.jpg", cat: "logos" },
    { src: "https://assets.justinmind.com/wp-content/uploads/2020/02/free-website-mockups-lawyer.png", cat: "sites" },
    { src: "https://assets.justinmind.com/wp-content/uploads/2020/02/website-mockup-examples-travel.png", cat: "sites" },
    { src: "https://mockuptree.com/wp-content/uploads/2020/07/free-website-mockup-3d-perspective.jpg", cat: "sites" },
    { src: "https://i.fbcd.co/products/resized/resized-750-500/99b4ca5940bee2858eb4e7bb1e5dbb3ec2999b981d0353fb75db454b1ef3bd75.jpg", cat: "ads" },
    { src: "https://mir-s3-cdn-cf.behance.net/project_modules/hd/8ff963104656881.5f82e8c1e47c8.jpg", cat: "ads" },
    { src: "https://cdn.dribbble.com/userupload/4514699/file/original-4f1399ad75732772e09cbc0d132b839b.png", cat: "ads" },
    { src: "https://cdn.dribbble.com/userupload/10927019/file/original-79276582809a41708e28251e1c5a0a9d.jpg", cat: "motion" },
    { src: "https://www.visme.co/wp-content/uploads/2024/10/youtube-thumbnail-maker-collage.jpg", cat: "motion" }
];

const gallery = document.getElementById('gallery');
portfolioImages.forEach(item => {
    const div = document.createElement('div');
    div.className = 'item ' + item.cat;
    div.innerHTML = `<img src="${item.src}" alt="Trabalho Pablo Designer">`;
    gallery.appendChild(div);
});

// Filtro do Portfólio
document.querySelectorAll('.filters button').forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        document.querySelectorAll('.gallery .item').forEach(item => {
            if (filter === 'all') {
                item.style.display = 'block';
            } else {
                item.style.display = item.classList.contains(filter) ? 'block' : 'none';
            }
        });
    });
});

// Chat IA Avançado
const chatBody = document.getElementById('chatBody');
const responsesAI = [
    "Olá! Posso ajudar com ideias de logos 3D metálicos ou sites modernos.",
    "O gerador lite é 100% grátis! Experimente prompts como 'cidade futurista neon'.",
    "Precisa de orçamento? Fale direto no WhatsApp: (34) 99811-0946",
    "Trabalho com branding completo, motion graphics e propagandas de alto impacto.",
    "Dica: Descreva cores, estilo e elementos para melhores resultados no gerador!"
];

function addMessage(text, isUser = false) {
    const p = document.createElement('p');
    p.textContent = isUser ? `Você: ${text}` : `IA: ${text}`;
    chatBody.appendChild(p);
    chatBody.scrollTop = chatBody.scrollHeight;
}

document.getElementById('sendMsg').addEventListener('click', sendChat);
document.getElementById('chatMsg').addEventListener('keypress', e => {
    if (e.key === 'Enter') sendChat();
});

function sendChat() {
    const input = document.getElementById('chatMsg');
    const msg = input.value.trim();
    if (!msg) return;
    addMessage(msg, true);
    input.value = '';
    setTimeout(() => {
        const response = responsesAI[Math.floor(Math.random() * responsesAI.length)];
        addMessage(response);
    }, 1000);
}

// Toggle Chat
document.querySelector('.chat-toggle').addEventListener('click', () => {
    document.querySelector('.chat-fixed').classList.toggle('active');
});
document.querySelector('.close-chat').addEventListener('click', () => {
    document.querySelector('.chat-fixed').classList.remove('active');
});