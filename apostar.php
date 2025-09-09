<?php
// Página principal das apostas
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Apostas — Números da Sorte</title>
  <meta name="color-scheme" content="light dark">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          boxShadow: {
            glow: "0 0 0 2px rgb(59 130 246 / 0.15), 0 0 0 6px rgb(59 130 246 / 0.08)"
          }
        }
      }
    }
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
</head>
<body class="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">

  <header class="tw-gradient text-white shadow-lg">
    <div class="max-w-6xl mx-auto px-4 py-6">
      <h1 class="text-2xl font-extrabold">🎲 Números da Sorte</h1>
      <p class="opacity-90">Escolha seu número, faça o Pix e anexe o comprovante.</p>
    </div>
  </header>

  <main class="max-w-6xl mx-auto px-4 py-6">
    <section class="grid sm:grid-cols-3 gap-4 mb-6">
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow">
        <div class="text-sm text-slate-500">Valor da aposta</div>
        <div class="text-2xl font-extrabold text-blue-600">R$ 2,00</div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow">
        <div class="text-sm text-slate-500">Prêmio do ganhador</div>
        <div class="text-2xl font-extrabold text-emerald-600">R$ 150,00</div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow">
        <div class="text-sm text-slate-500">Próximo sorteio</div>
        <div class="text-xl font-bold" id="contador">calculando…</div>
      </div>
    </section>

    <form id="form" action="salvar.php" method="POST" enctype="multipart/form-data" class="bg-white dark:bg-slate-800 rounded-2xl shadow p-4 space-y-3">
      <h3 class="text-lg font-semibold">Finalize sua participação</h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="text-sm text-slate-500">Nome</label>
          <input required name="nome" class="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200" placeholder="Seu nome">
        </div>
        <div>
          <label class="text-sm text-slate-500">WhatsApp</label>
          <input required name="whats" class="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200" placeholder="DDD + número">
        </div>
      </div>

      <div>
        <label class="text-sm text-slate-500">Número escolhido</label>
        <input required name="numero" type="number" min="1" max="100" class="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200" placeholder="Escolha de 1 a 100">
      </div>

      <div>
        <label class="text-sm text-slate-500">Comprovante (imagem ou PDF)</label>
        <input required name="file" type="file" accept="image/*,.pdf" class="w-full mt-1 block text-sm file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-slate-100">
      </div>

      <button class="w-full px-4 py-3 rounded-xl bg-emerald-600 text-white font-extrabold">✅ Enviar participação</button>
      <div id="resultado" class="mt-2 text-sm"></div>
    </form>
  </main>

  <script>
    const form = document.getElementById("form");
    const resultado = document.getElementById("resultado");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const response = await fetch("salvar.php", {
        method: "POST",
        body: formData
      });
      const result = await response.json();
      if (result.status === "ok") {
        resultado.innerHTML = '<span class="text-green-600">✅ ' + result.msg + '</span>';
        form.reset();
      } else {
        resultado.innerHTML = '<span class="text-red-600">❌ ' + result.msg + '</span>';
      }
    });

    // contador do sorteio para sábado 11:00
    function proximoSabado11() {
      const agora = new Date();
      const dia = agora.getDay();
      const prox = new Date(agora);
      prox.setDate(agora.getDate() + ((6 - dia + 7) % 7));
      prox.setHours(11,0,0,0);
      return prox;
    }
    function atualizarContador() {
      const agora = new Date();
      const alvo = proximoSabado11();
      const diff = alvo - agora;
      const el = document.getElementById("contador");
      if (diff <= 0) {
        el.textContent = "Sorteio em andamento!";
      } else {
        const h = Math.floor(diff/3600000);
        const m = Math.floor((diff%3600000)/60000);
        const s = Math.floor((diff%60000)/1000);
        el.textContent = h + "h " + m + "m " + s + "s";
      }
    }
    setInterval(atualizarContador, 1000);
    atualizarContador();
  </script>

</body>
</html>
