// Gerador de logos
function generateLogo() {
  const canvas = document.getElementById("logoCanvas");
  const ctx = canvas.getContext("2d");
  const text = document.getElementById("logoText").value || "Minha Marca";
  const style = document.getElementById("styleSelect").value;
  const bg = document.getElementById("bgSelect").value;

  if (bg === "white") {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
  } else if (bg === "black") {
    ctx.fillStyle = "#000";
    ctx.fillRect(0,0,canvas.width,canvas.height);
  } else {
    ctx.clearRect(0,0,canvas.width,canvas.height);
  }

  ctx.font = "40px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowBlur = 0;

  if (style === "clean") {
    ctx.fillStyle = "#111";
  } else if (style === "neon") {
    ctx.fillStyle = "#0ff";
    ctx.shadowColor = "#0ff";
    ctx.shadowBlur = 10;
  } else if (style === "gradiente") {
    const gradient = ctx.createLinearGradient(0,0,canvas.width,0);
    gradient.addColorStop(0,"#ff5f6d");
    gradient.addColorStop(1,"#ffc371");
    ctx.fillStyle = gradient;
  } else if (style === "selo") {
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, 90, 0, Math.PI*2);
    ctx.stroke();
    ctx.fillStyle = "#111";
  }

  ctx.fillText(text, canvas.width/2, canvas.height/2);

  saveToGallery(canvas.toDataURL());
}

function downloadLogo() {
  const canvas = document.getElementById("logoCanvas");
  const link = document.createElement("a");
  link.download = "logo.png";
  link.href = canvas.toDataURL();
  link.click();
}

function saveToGallery(dataUrl) {
  let gallery = JSON.parse(localStorage.getItem("logos")) || [];
  gallery.push(dataUrl);
  localStorage.setItem("logos", JSON.stringify(gallery));
  loadGallery();
}

function loadGallery() {
  let gallery = JSON.parse(localStorage.getItem("logos")) || [];
  const container = document.getElementById("logoGallery");
  container.innerHTML = "";
  gallery.forEach(src => {
    let img = document.createElement("img");
    img.src = src;
    container.appendChild(img);
  });
}

// Formulário de contato (simulação)
document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();
  alert("Mensagem enviada para: pablobass034@gmail.com");
});

// Gerar QR Code Pix
function generatePixQR() {
  new QRCode(document.getElementById("qrcode"), {
    text: "00020126580014BR.GOV.BCB.PIX0131117786576995204000053039865802BR5920PabloDesigners6009BRASIL62070503***6304ABCD",
    width: 200,
    height: 200
  });
}
window.onload = function() {
  loadGallery();
  generatePixQR();
};
