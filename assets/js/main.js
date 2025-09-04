// Modal para galería mosaico
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('galeria-modal');
  const modalImg = document.getElementById('galeria-modal-img');
  if (modal && modalImg) {
    document.querySelectorAll('.mosaico-img').forEach(img => {
      img.addEventListener('click', () => {
        modal.style.display = 'flex';
        modalImg.src = img.src;
        modalImg.alt = img.alt;
      });
    });
  }
});

// Modal galería ampliada
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('galeria-modal');
  const modalImg = document.getElementById('galeria-modal-img');
  const cerrar = document.querySelector('.galeria-modal-cerrar');
  const carruselImgs = document.querySelectorAll('.galeria-carrusel .galeria-img');
  carruselImgs.forEach(img => {
    img.addEventListener('click', () => {
      modal.style.display = 'flex';
      modalImg.src = img.src;
      modalImg.alt = img.alt;
    });
  });
  cerrar.addEventListener('click', () => {
    modal.style.display = 'none';
    modalImg.src = '';
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      modalImg.src = '';
    }
  });
});
// Galería carrusel
document.addEventListener('DOMContentLoaded', () => {
  const galeriaImgs = document.querySelectorAll('.galeria-carrusel .galeria-img');
  const galeriaBtns = document.querySelectorAll('.galeria-btn');
  let idx = 0;
  function actualizarCarrusel() {
    galeriaImgs.forEach((img, i) => {
      img.classList.remove('carrusel-activa', 'carrusel-left', 'carrusel-right');
      if (i === idx) {
        img.classList.add('carrusel-activa');
      } else if (i === (idx + 1) % galeriaImgs.length) {
        img.classList.add('carrusel-right');
      } else if (i === (idx - 1 + galeriaImgs.length) % galeriaImgs.length) {
        img.classList.add('carrusel-left');
      }
    });
    galeriaBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i === idx);
    });
  }
  galeriaBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      idx = i;
      actualizarCarrusel();
    });
  });
  actualizarCarrusel();
});

// Navbar responsive
document.addEventListener("DOMContentLoaded", function() {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.querySelector(".navbar ul");
  hamburger.addEventListener("click", function() {
    navMenu.classList.toggle("active");
    hamburger.classList.toggle("open");
  });
  // Opcional: cerrar menú al hacer clic en un enlace
  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      hamburger.classList.remove("open");
    });
  });
});

// Miembros (ejemplo)
const miembros = [
  { nombre: "Default 1", img: "https://randomuser.me/api/portraits/men/1.jpg" },
  { nombre: "Default 2", img: "https://randomuser.me/api/portraits/women/2.jpg" },
  { nombre: "Default 3", img: "https://randomuser.me/api/portraits/men/3.jpg" },
  { nombre: "Default 4", img: "https://randomuser.me/api/portraits/women/4.jpg" },
  { nombre: "Default 5", img: "https://randomuser.me/api/portraits/men/5.jpg" },
  { nombre: "Default 6", img: "https://randomuser.me/api/portraits/women/6.jpg" },
  { nombre: "Default 7", img: "https://randomuser.me/api/portraits/men/7.jpg" },
  { nombre: "Default 8", img: "https://randomuser.me/api/portraits/women/8.jpg" },
];

function mostrarMiembrosAleatorios(num = 5) {
  const contenedor = document.querySelector('.miembros-scroll');
  if (!contenedor) return;
  // Mezclar array
  const mezclados = miembros.slice().sort(() => Math.random() - 0.5);
  contenedor.innerHTML = '';
  mezclados.slice(0, num).forEach(m => {
    const card = document.createElement('div');
    card.className = 'miembro-card';
    card.innerHTML = `
      <img src="${m.img}" alt="${m.nombre}">
      <div class="nombre">${m.nombre}</div>
    `;
    contenedor.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  mostrarMiembrosAleatorios();
  const verTodosBtn = document.getElementById('ver-todos-miembros');
  if (verTodosBtn) {
    verTodosBtn.addEventListener('click', () => {
      window.location.href = 'miembros.html';
    });
  }
});

// Ruleta
const retos = [
  "Bebe un chupito",
  "Cuenta una anécdota graciosa",
  "Reto de baile durante 30 segundos",
  "Di 'yo nunca' y los demás beben si lo hicieron",
  "Haz una imitación de otro miembro"
];

function girarRuleta() {
  const random = Math.floor(Math.random() * retos.length);
  document.getElementById("resultado").innerText = retos[random];
}

// Comentarios (solo en memoria, ejemplo sin backend)
const form = document.getElementById("form-comentario");
const comentariosDiv = document.getElementById("comentarios");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value || "Anónimo";
  const texto = document.getElementById("comentario").value;
  if (texto.trim() === "") return;

  const comentario = document.createElement("p");
  comentario.innerHTML = `<strong>${nombre}:</strong> ${texto}`;
  comentariosDiv.prepend(comentario);

  form.reset();
});
