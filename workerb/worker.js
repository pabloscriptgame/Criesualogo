// worker/worker.js — Cloudflare Worker para salvar dados em um repositório GitHub por IP
// Configure Secrets no Worker:
// - GITHUB_TOKEN  (fine-grained PAT com permissão 'contents: write' ao repo)
// - GH_OWNER      (ex.: 'seu-usuario')
// - GH_REPO       (ex.: 'apostador-dados')
// - GH_BRANCH     (ex.: 'main')
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') return new Response(null,{headers:cors()});
    if (url.pathname === '/submit' && request.method === 'POST') {
      try {
        const form = await request.formData();
        const ip = request.headers.get('cf-connecting-ip') || 'unknown';
        const ts = new Date().toISOString().replace(/[:.]/g,'-');
        const basePath = `data/${ip}/${ts}`;

        const files = [];
        for (const [name, value] of form.entries()) {
          if (value instanceof File) {
            files.push({ path: `${basePath}/${value.name}`, content: await value.arrayBuffer(), type: value.type });
          } else if (name.endsWith('.json')) {
            const blob = form.get(name);
            const buf = await blob.arrayBuffer();
            files.push({ path: `${basePath}/${name}`, content: buf, type: 'application/json' });
          }
        }

        // salva também um index.json com info geral
        const resumo = { ip, ts, ua: request.headers.get('user-agent') };
        files.push({ path: `${basePath}/index.json`, content: new TextEncoder().encode(JSON.stringify(resumo,null,2)), type:'application/json' });

        const results = [];
        for (const f of files) {
          const res = await githubPut(env, f.path, f.content, `Aposta ${ip} ${ts}`);
          if (!res.ok) throw new Error(`GitHub PUT falhou: ${res.status}`);
          results.push(await res.json());
        }
        const commit = results[results.length-1]?.commit?.sha || null;
        return new Response(JSON.stringify({ ok:true, commit }), { headers: { 'content-type':'application/json', ...cors() }});
      } catch (err) {
        return new Response(JSON.stringify({ ok:false, error: String(err) }), { status: 500, headers: { 'content-type':'application/json', ...cors() }});
      }
    }
    return new Response(JSON.stringify({ ok:true, msg:'Aponte POST /submit' }), { headers: { 'content-type':'application/json', ...cors() }});
  }
};

function cors(){ return { 'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'GET,POST,OPTIONS' }; }

async function githubPut(env, path, contentBuf, message){
  const api = `https://api.github.com/repos/${env.GH_OWNER}/${env.GH_REPO}/contents/${encodeURIComponent(path)}`;
  const body = {
    message,
    branch: env.GH_BRANCH || 'main',
    content: btoa(String.fromCharCode(...new Uint8Array(contentBuf)))
  };
  return fetch(api, {
    method:'PUT',
    headers:{
      'authorization': `Bearer ${env.GITHUB_TOKEN}`,
      'user-agent': 'apostador-worker',
      'accept': 'application/vnd.github+json'
    },
    body: JSON.stringify(body)
  });
}
