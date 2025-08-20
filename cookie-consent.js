/*! Cookie Consent minimalista (LGPD/GDPR-friendly). Nenhuma dependência. */
(function(){
  var STORAGE_KEY = "cookieConsent"; // "accepted" | "rejected"
  var POLICY_URL = (function(){
    // Tente detectar uma página de política
    var candidates = ["politica-de-privacidade.html","politica-privacidade.html","privacidade.html","privacy.html","/politica-de-privacidade","/privacy"];
    for(var i=0;i<candidates.length;i++){
      var path = candidates[i];
      // Se o link existir no DOM, use-o; senão, apenas retorne o primeiro candidato como fallback
    }
    return "politica-de-privacidade.html";
  })();

  function hasDecision(){
    try{
      return localStorage.getItem(STORAGE_KEY) === "accepted" || localStorage.getItem(STORAGE_KEY) === "rejected";
    }catch(e){ return false; }
  }
  function setDecision(val){
    try{ localStorage.setItem(STORAGE_KEY, val); }catch(e){}
    var ev = new CustomEvent("cookie-consent", { detail: { status: val }});
    window.dispatchEvent(ev);
  }

  function createBanner(){
    var banner = document.createElement("div");
    banner.id = "cookie-consent-banner";
    banner.setAttribute("role","dialog");
    banner.setAttribute("aria-live","polite");
    banner.setAttribute("aria-label","Aviso de cookies");
    banner.innerHTML = ''
      + '<div class="cc-wrap">'
      +   '<div class="cc-text">'
      +     '<strong>Usamos cookies essenciais</strong> para melhorar sua experiência e manter o site funcionando. '
      +     'Nós <em>não</em> ativamos cookies não-essenciais sem sua permissão. '
      +     'Consulte nossa <a href="'+POLICY_URL+'" target="_blank" rel="noopener">Política de Privacidade</a>.'
      +   '</div>'
      +   '<div class="cc-actions">'
      +     '<button id="cookie-consent-decline" type="button">Recusar</button>'
      +     '<button id="cookie-consent-accept" type="button">Aceitar</button>'
      +   '</div>'
      + '</div>';
    document.body.appendChild(banner);
    return banner;
  }

  function showBanner(){
    var el = document.getElementById("cookie-consent-banner") || createBanner();
    el.style.display = "block";
    document.getElementById("cookie-consent-accept").addEventListener("click", function(){
      setDecision("accepted");
      el.style.display = "none";
    });
    document.getElementById("cookie-consent-decline").addEventListener("click", function(){
      setDecision("rejected");
      el.style.display = "none";
    });
  }

  function init(){
    if(!hasDecision()){
      if(document.readyState === "loading"){
        document.addEventListener("DOMContentLoaded", showBanner);
      } else{
        showBanner();
      }
    }
  }

  // Caso você queira adiar scripts não essenciais no site:
  // Adicione type="text/plain" e data-consent="analytics" (ou "marketing") em <script> de terceiros.
  // Ao aceitar, eles serão ativados automaticamente.
  function enableDeferredScripts(){
    if(localStorage.getItem(STORAGE_KEY) !== "accepted") return;
    var nodes = document.querySelectorAll('script[type="text/plain"][data-consent]');
    nodes.forEach(function(s){
      var newS = document.createElement("script");
      // Copia atributos comuns
      ["src","async","defer","crossorigin","integrity","referrerpolicy"].forEach(function(attr){
        if(s.hasAttribute(attr)) newS.setAttribute(attr, s.getAttribute(attr));
      });
      // Copia conteúdo inline
      if(s.textContent) newS.textContent = s.textContent;
      // Ajusta tipo padrão
      newS.type = "text/javascript";
      // Insere e remove o placeholder
      s.parentNode.insertBefore(newS, s);
      s.remove();
    });
  }

  window.addEventListener("cookie-consent", enableDeferredScripts);
  document.addEventListener("DOMContentLoaded", enableDeferredScripts);

  init();
})();
