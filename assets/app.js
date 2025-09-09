
// ===== Configurações =====
const REPO_OWNER = "SeuUsuario";      // Seu usuário GitHub
const REPO_NAME  = "nome-do-repositorio"; // Nome do repositório
const BRANCH     = "main";            // Branch do Pages
const GITHUB_TOKEN = "SEU_TOKEN_AQUI"; // ⚠️ Token com acesso somente a ESTE repositório

// ===== Elementos =====
const gridEl   = document.getElementById('grid');
const numeroEl = document.getElementById('numero');
const msgEl    = document.getElementById('msg');

// ===== Área de debug =====
const debugBox = document.createElement('div');
debugBox.style.background = '#111';
debugBox.style.color = '#0f0';
debugBox.style.fontSize = '12px';
debugBox.style.padding = '10px';
debugBox.style.margin = '10px 0';
debugBox.style.whiteSpace = 'pre-wrap';
debugBox.innerText = 'DEBUG ATIVO:\n';
document.body.prepend(debugBox);
function debug(msg){ debugBox.innerText += msg + "\n"; console.log(msg); }

// ===== Funções GitHub =====
function ghHeaders() {
  return {
    "Accept": "application/vnd.github+json",
    "Authorization": `token ${GITHUB_TOKEN}`
  };
}

async function listParticipacoes() {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/participacoes?ref=${BRANCH}`;
  debug("URL chamada: " + url);
  const r = await fetch(url, { headers: ghHeaders() });
  debug("Status da resposta: " + r.status);
  if (r.status === 404) { 
    debug("Pasta participacoes NÃO encontrada.");
    return {}; 
  }
  if (!r.ok) {
    const err = await r.text();
    debug("Erro ao listar: " + err);
    return {};
  }
  const items = await r.json();
  debug("Itens recebidos: " + JSON.stringify(items.map(i=>i.name)));
  const estados = {};
  for (const it of items) {
    if (!it.name.endsWith('.json')) continue;
    const num = parseInt(it.name.replace('.json',''));
    const file = await fetch(it.url, { headers: ghHeaders() }).then(r=>r.json());
    const content = atob(file.content.replace(/\n/g,''));
    try {
      const data = JSON.parse(content);
      estados[num] = (data.status || 'reservado').toLowerCase();
    } catch(e) {
      estados[num] = 'reservado';
    }
  }
  return estados;
}

function numeroBtn(n, status) {
  const btn = document.createElement('button');
  btn.textContent = n;
  btn.dataset.num = n;
  btn.dataset.status = status || 'livre';
  btn.className = "num border p-2 rounded text-center bg-white hover:bg-blue-50 relative";
  if (status === 'reservado') btn.className = "num border p-2 rounded text-center bg-yellow-400 text-white relative";
  if (status === 'pago')      btn.className = "num border p-2 rounded text-center bg-green-500 text-white relative";
  btn.addEventListener('click', () => {
    if (btn.dataset.status !== 'livre') { alert('Este número não está disponível.'); return; }
    numeroEl.value = n;
    [...gridEl.children].forEach(el => el.classList.remove('ring','ring-blue-500'));
    btn.classList.add('ring','ring-blue-500');
  });
  return btn;
}

async function renderGrid() {
  gridEl.innerHTML = "";
  debug("Carregando grid...");
  const estados = await listParticipacoes();
  for (let i=1;i<=100;i++) {
    const st = estados[i] || 'livre';
    gridEl.appendChild(numeroBtn(i, st));
  }
  debug("Grid renderizado com sucesso.");
}

// Inicializa
renderGrid().catch(err => debug("ERRO GERAL: " + err));
