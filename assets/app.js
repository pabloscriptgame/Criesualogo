// app.js — lógica do site Apostador
const WORKER_URL = 'https://SEU_WORKER.subdomain.workers.dev'; // <- troque pelo seu endpoint

// ------ Util: CRC16 CCITT (EMV) ------
function crc16ccitt(str) {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) crc = (crc << 1) ^ 0x1021;
      else crc = crc << 1;
      crc &= 0xFFFF;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

// ------ Gera BR Code PIX (cópia e cola) ------
function emv(k, v) {
  const val = String(v);
  return k + String(val.length).padStart(2,'0') + val;
}

function gerarPix(brCode) {
  // Acrescenta CRC no fim (ID 63)
  const semCRC = brCode + '6304';
  const crc = crc16ccitt(semCRC);
  return semCRC + crc;
}

function montarPix({chave, nome, cidade='BRASIL', valor='0.00', txid='APOSTADOR'}) {
  // Baseado no padrão BR Code (EMVCo) simplificado
  const merchantAccount = emv('00','BR.GOV.BCB.PIX') + emv('01', chave);
  const gui = emv('26', merchantAccount);
  const merchant = emv('59', nome.slice(0,25) || 'RECEBEDOR') + emv('60', cidade.slice(0,15));
  const tx = emv('05', txid.slice(0,25));
  const amount = parseFloat(valor) > 0 ? emv('54', String(parseFloat(valor).toFixed(2))) : '';
  const payload = emv('00','01') + emv('01','12') + gui + merchant + amount + emv('52','0000') + emv('53','986') + tx;
  return gerarPix(payload);
}

// ------ Interface ------
const numbersDiv = document.getElementById('numbers');
const hiddenNumeros = document.getElementById('numeros');
const btnGerarPix = document.getElementById('btnGerarPix');
const btnEnviar = document.getElementById('btnEnviar');
const btnCopiar = document.getElementById('btnCopiar');
const pixCodeEl = document.getElementById('pixCode');
const pixKeyEl = document.getElementById('pixKey');
document.getElementById('year').textContent = new Date().getFullYear();

// cria botões 0-99
let selecionados = new Set();
for (let i=0; i<100; i++){
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = String(i).padStart(2,'0');
  b.addEventListener('click', () => {
    if (selecionados.has(i)) { selecionados.delete(i); b.classList.remove('active'); }
    else {
      if (selecionados.size >= 6) return;
      selecionados.add(i); b.classList.add('active');
    }
    hiddenNumeros.value = Array.from(selecionados).sort((a,b)=>a-b).map(n=>String(n).padStart(2,'0')).join(',');
  });
  numbersDiv.appendChild(b);
}

// PIX
btnGerarPix.addEventListener('click', () => {
  const nome = 'APOSTADOR';
  const chave = pixKeyEl.textContent.trim(); // 11778657699
  const valor = '2.00'; // ajuste se quiser preço dinâmico
  const txid = 'AP' + Math.random().toString(36).slice(2,10).toUpperCase();
  const code = montarPix({chave, nome, valor, txid});
  pixCodeEl.value = code;

  // Renderiza um "QR" na área (biblioteca reduzida de exemplo)
  const container = document.getElementById('qrcode');
  new QRCode(container, code);
});

btnCopiar.addEventListener('click', async () => {
  pixCodeEl.select();
  try { await navigator.clipboard.writeText(pixCodeEl.value); btnCopiar.textContent = 'Copiado!'; setTimeout(()=>btnCopiar.textContent='Copiar código PIX',1500);} catch(e){ alert('Copie manualmente'); }
});

// Envio da aposta
document.getElementById('betForm').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const fd = new FormData(ev.target);
  if (!fd.get('numeros')) { alert('Selecione ao menos 1 número.'); return; }

  // Metadados locais
  const payload = {
    nome: fd.get('nome'),
    telefone: fd.get('telefone'),
    numeros: fd.get('numeros'),
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  };

  const jsonBlob = new Blob([JSON.stringify(payload,null,2)], {type:'application/json'});
  const out = new FormData();
  out.append('aposta.json', jsonBlob, 'aposta.json');
  if (fd.get('comprovante') && fd.get('comprovante').size > 0) {
    out.append('comprovante', fd.get('comprovante'));
  }

  try {
    const r = await fetch(WORKER_URL + '/submit', { method:'POST', body: out });
    if (!r.ok) throw new Error('Falha ao salvar');
    const data = await r.json();
    alert('Aposta salva! Commit: ' + (data.commit || 'ok'));
    ev.target.reset(); selecionados.clear(); hiddenNumeros.value=''; document.querySelectorAll('.numbers button.active').forEach(b=>b.classList.remove('active'));
  } catch(err) {
    console.error(err);
    alert('Erro ao enviar. Verifique o Worker/Token.');
  }
});
