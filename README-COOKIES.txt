====================================================
BANNER DE COOKIES (LGPD/GDPR) — Instruções rápidas
====================================================

Arquivos adicionados na raiz do seu site:
  - cookie-consent.css
  - cookie-consent.js

O que o banner faz?
- Exibe um aviso simples e acessível informando o uso de cookies essenciais.
- Permite ao visitante "Aceitar" ou "Recusar".
- Grava a decisão no navegador (localStorage).
- Opcional: só ativa scripts de terceiros marcados para consentimento após "Aceitar".

Como usar (já automatizado nas páginas .html):
1) Em cada página .html/.htm, foi inserido:
   <link rel="stylesheet" href="cookie-consent.css">
   <script src="cookie-consent.js" defer></script>

2) Se você tiver scripts de análise/marketing que só devem rodar após o consentimento,
   altere-os para:
     <script type="text/plain" data-consent="analytics" src="URL_DO_SCRIPT"></script>
   Ou para scripts inline:
     <script type="text/plain" data-consent="analytics">
       // código do script aqui
     </script>
   O arquivo cookie-consent.js ativará esses scripts apenas se o usuário aceitar.

Observações de segurança e conformidade:
- Este banner NÃO carrega bibliotecas externas e não envia dados a terceiros.
- "100% seguro" é impossível de garantir em tecnologia; este pacote é simples e
  reduz a superfície de ataque por não usar CDNs. A conformidade legal total depende
  de como você trata dados em seu site (política de privacidade, inventário de cookies, etc.).
- Recomendado: crie/atualize uma página "politica-de-privacidade.html" e ajuste o link no banner
  se necessário.

Gerado em: 2025-08-20 16:27:26
