// ===== Configurações =====
const REPO_OWNER = "pabloscriptgame";      // Seu usuário GitHub
const REPO_NAME  = "Criesualogo"; // Nome do repositório
const BRANCH     = "main";            // Branch do Pages
const GITHUB_TOKEN = "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"; // ⚠️ Fine-grained token com acesso somente a ESTE repositório

// ===== Elementos =====
const gridEl   = document.getElementById('grid');
const numeroEl = document.getElementById('numero');
const msgEl    = document.getElementById('msg');

// ===== Util =====
function ghHeaders() {
  return {
    "Accept": "application/vnd.github+json",
    "Authorization": `token ${GITHUB_TOKEN}`
  };
}
async function listParticipacoes() {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/participacoes?ref=${BRANCH}`;
  const r = await fetch(url, { headers: ghHeaders() });
  if (r.status === 404) return {}; // Sem pastas ainda
  const items = await r.json();
  const estados = {}; // { numero: 'reservado'|'pago' }
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
  const estados = await listParticipacoes();
  for (let i=1;i<=100;i++) {
    const st = estados[i] || 'livre';
    gridEl.appendChild(numeroBtn(i, st));
  }
}
async function getFileSha(path) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${encodeURIComponent(path)}?ref=${BRANCH}`;
  const r = await fetch(url, { headers: ghHeaders() });
  if (!r.ok) return null;
  const data = await r.json();
  return data.sha || null;
}
async function saveFile(path, contentBase64, message, sha=null) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;
  const body = { message, content: contentBase64, branch: BRANCH };
  if (sha) body.sha = sha;
  const r = await fetch(url, {
    method: "PUT",
    headers: { ...ghHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!r.ok) {
    const err = await r.json();
    throw new Error(JSON.stringify(err));
  }
  return r.json();
}

// ===== Inicializa grid =====
renderGrid().catch(console.error);

// ===== Envio do formulário =====
document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  msgEl.textContent = "Enviando…";
  const fd = new FormData(e.target);
  const numero = fd.get('numero');
  if (!numero) { msgEl.textContent = "Selecione um número no grid."; return; }

  try {
    // Verifica se já existe participação para este número
    const existSha = await getFileSha(`participacoes/${numero}.json`);
    if (existSha) { msgEl.textContent = "Este número já foi escolhido."; return; }

    // Arquivo
    const file = fd.get('file');
    const fileBase64 = await fileToBase64(file);
    const uploadPath = `uploads/${Date.now()}_${sanitizeName(file.name)}`;
    await saveFile(uploadPath, fileBase64, "Comprovante enviado");

    // JSON
    const dados = {
      ref: "P" + Date.now().toString(16).toUpperCase(),
      nome: fd.get('nome'),
      whats: fd.get('whats'),
      numero: parseInt(numero),
      comprovante: uploadPath,
      status: "reservado",
      data: new Date().toISOString()
    };
    const json64 = btoa(JSON.stringify(dados, null, 2));
    await saveFile(`participacoes/${numero}.json`, json64, "Nova participação");

    msgEl.innerHTML = "<span class='text-green-600'>✅ Participação registrada!</span>";
    e.target.reset();
    numeroEl.value = "";
    await renderGrid();
  } catch (err) {
    console.error(err);
    msgEl.innerHTML = "<span class='text-red-600'>❌ Erro ao enviar. Veja o console.</span>";
  }
});

function sanitizeName(name){ return name.replace(/[^a-zA-Z0-9_.-]/g,'_'); }
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
