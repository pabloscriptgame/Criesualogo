// script.js
// Tab Functionality
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;

        // Update active tab btn
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update active content
        tabContents.forEach(content => content.classList.remove('active'));
        document.getElementById(targetTab)?.classList.add('active');
    });
});

// Smooth scroll for nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href.includes('#')) {
            const targetId = href.substring(href.indexOf('#') + 1);
            document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.location.href = href;
        }
    });
});

// Particle Canvas for Hero
function initParticles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const numParticles = 100;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.color = Math.random() > 0.5 ? '#00ffff' : '#ff00ff';
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
            if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Enhanced Parallax on Hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Header Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
        header.style.boxShadow = '0 0 40px rgba(0, 255, 255, 0.2)';
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.85)';
        header.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.1)';
    }
});

// Auth Functionality (using localStorage as a simple DB simulation)
const usersDB = 'users'; // Key for localStorage
const loggedInUserKey = 'loggedInUser';

function getUsers() {
    return JSON.parse(localStorage.getItem(usersDB)) || [];
}

function saveUsers(users) {
    localStorage.setItem(usersDB, JSON.stringify(users));
}

function setLoggedInUser(user) {
    localStorage.setItem(loggedInUserKey, JSON.stringify(user));
}

function getLoggedInUser() {
    return JSON.parse(localStorage.getItem(loggedInUserKey));
}

function clearLoggedInUser() {
    localStorage.removeItem(loggedInUserKey);
}

// Register Form
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        const users = getUsers();
        if (users.find(u => u.email === email)) {
            document.getElementById('register-message').textContent = 'Email já registrado!';
            return;
        }

        users.push({ username, email, password }); // In production, hash password!
        saveUsers(users);
        document.getElementById('register-message').textContent = 'Conta criada com sucesso! Faça login.';
        registerForm.reset();
    });
}

// Login Form
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            setLoggedInUser(user);
            document.getElementById('login-message').textContent = `Bem-vindo, ${user.username}!`;
            updateAuthUI();
            loginForm.reset();
        } else {
            document.getElementById('login-message').textContent = 'Credenciais inválidas!';
        }
    });
}

// Logout Functionality
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        clearLoggedInUser();
        updateAuthUI();
    });
}

// Update UI based on login status
function updateAuthUI() {
    const user = getLoggedInUser();
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const panelSection = document.getElementById('panel-section');
    const panelUsername = document.getElementById('panel-username');

    if (user) {
        loginSection.style.display = 'none';
        registerSection.style.display = 'none';
        panelSection.style.display = 'block';
        panelUsername.textContent = `Olá, ${user.username}!`;
    } else {
        loginSection.style.display = 'block';
        registerSection.style.display = 'block';
        panelSection.style.display = 'none';
    }
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    updateAuthUI();
});