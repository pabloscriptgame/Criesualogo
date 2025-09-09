// ===== Config =====
const REPO_OWNER = "SeuUsuario";
const REPO_NAME  = "nome-do-repositorio";
const BRANCH     = "main";
const GITHUB_TOKEN = "SEU_TOKEN_AQUI";
const ADMIN_PASSWORD = "SENHA_ADMIN_AQUI"; // ⚠️ Simples, apenas para uso rápido

// ===== Elements =====
const gridEl = document.getElementById('grid');
const loginBtn = document.getElementById('btnLogin');
const passEl = document.getElementById('adminPass');
const loginMsg = document.getElementById('loginMsg');
const adminArea = document.getElementById('adminArea');
const msgEl = document.getElementById('msg');

// ===== Utils =====
function ghHeaders(){ return { "Accept":"application/vnd.github+json", "Authorization":`token ${GITHUB_TOKEN}` }; }

loginBtn.addEventListener('click', () => {
  if (passEl.value === ADMIN_PASSWORD) {
    adminArea.classList.remove('hidden');
    loginMsg.textContent = "";
    renderGrid();
  } else {
    loginMsg.textContent = "Senha incorreta.";
  }
});

async function listParticipacoes() {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/participacoes?ref=${BRANCH}`;
  const r = await fetch(url, { headers: ghHeaders() });
  if (r.status === 404) return {};
  const items = await r.json();
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
  btn.className = "num border p-2 rounded text-center bg-white hover:bg-blue-50";
  if (status === 'reservado') btn.className = "num border p-2 rounded text-center bg-yellow-400 text-white";
  if (status === 'pago')      btn.className = "num border p-2 rounded text-center bg-green-500 text-white";
  btn.addEventListener('click', () => onClickNumero(btn));
  return btn;
}

async function renderGrid() {
  gridEl.innerHTML = "";
  const estados = await listParticipacoes();
  for (let i=1;i<=100;i++) {
    gridEl.appendChild(numeroBtn(i, estados[i] || 'livre'));
  }
}

async function onClickNumero(btn) {
  const n = btn.dataset.num;
  const st = btn.dataset.status;
  if (st === 'livre') { msgEl.textContent = "Número livre. Nada a fazer."; return; }
  if (st === 'reservado') {
    // Muda para pago
    await updateStatus(n, 'pago');
  } else if (st === 'pago') {
    // Liberar: remove JSON
    await liberarNumero(n);
  }
  await renderGrid();
  msgEl.textContent = "Atualizado.";
}

async function getFile(path) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`;
  const r = await fetch(url, { headers: ghHeaders() });
  if (!r.ok) return null;
  return r.json();
}

async function saveFile(path, contentBase64, message, sha=null) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;
  const body = { message, content: contentBase64, branch: BRANCH };
  if (sha) body.sha = sha;
  const r = await fetch(url, { method:"PUT", headers:{...ghHeaders(),"Content-Type":"application/json"}, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

async function deleteFile(path, message, sha) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;
  const body = { message, sha, branch: BRANCH };
  const r = await fetch(url, { method:"DELETE", headers:{...ghHeaders(),"Content-Type":"application/json"}, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

async function updateStatus(numero, novoStatus) {
  const path = `participacoes/${numero}.json`;
  const file = await getFile(path);
  if (!file) { msgEl.textContent = "Arquivo não encontrado."; return; }
  const content = atob(file.content.replace(/\n/g,''));
  const data = JSON.parse(content);
  data.status = novoStatus;
  const updated64 = btoa(JSON.stringify(data, null, 2));
  await saveFile(path, updated64, `Status -> ${novoStatus}`, file.sha);
}

async function liberarNumero(numero) {
  const path = `participacoes/${numero}.json`; 
  const file = await getFile(path);
  if (!file) { msgEl.textContent = "Arquivo não encontrado."; return; }
  await deleteFile(path, "Liberar número", file.sha);
}
