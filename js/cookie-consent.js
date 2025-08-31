document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("cookieConsent")) {
    const div = document.createElement("div");
    div.id = "cookieConsent";
    div.innerHTML = `
      <span>Este site usa cookies para melhorar sua experiência.</span>
      <div>
        <button class="accept">Aceitar</button>
        <button class="decline">Recusar</button>
      </div>`;
    document.body.appendChild(div);

    div.querySelector(".accept").addEventListener("click", () => {
      localStorage.setItem("cookieConsent", "accepted");
      div.remove();
    });
    div.querySelector(".decline").addEventListener("click", () => {
      localStorage.setItem("cookieConsent", "declined");
      div.remove();
    });
  }
});
