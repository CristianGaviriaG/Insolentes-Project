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
  if (modal && modalImg && cerrar && carruselImgs.length > 0) {
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
  }
});

// Galería carrusel
document.addEventListener('DOMContentLoaded', () => {
  const galeriaImgs = document.querySelectorAll('.galeria-carrusel .galeria-img');
  const galeriaBtns = document.querySelectorAll('.galeria-btn');
  const carrusel = document.querySelector('.galeria-carrusel');
  let idx = 0;
  let startX = 0;
  let isDragging = false;
  let moved = false;

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

  // Botones
  galeriaBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      idx = i;
      actualizarCarrusel();
    });
  });

  // Touch events
  if (carrusel) {
    carrusel.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        isDragging = true;
        moved = false;
      }
    });
    carrusel.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const deltaX = e.touches[0].clientX - startX;
      if (Math.abs(deltaX) > 40) {
        moved = true;
        if (deltaX < 0) {
          idx = (idx + 1) % galeriaImgs.length;
        } else {
          idx = (idx - 1 + galeriaImgs.length) % galeriaImgs.length;
        }
        actualizarCarrusel();
        isDragging = false;
      }
    });
    carrusel.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Mouse drag events
    carrusel.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      isDragging = true;
      moved = false;
    });
    carrusel.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      if (Math.abs(deltaX) > 40) {
        moved = true;
        if (deltaX < 0) {
          idx = (idx + 1) % galeriaImgs.length;
        } else {
          idx = (idx - 1 + galeriaImgs.length) % galeriaImgs.length;
        }
        actualizarCarrusel();
        isDragging = false;
      }
    });
    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
    // Evita seleccionar imágenes al arrastrar
    carrusel.addEventListener('dragstart', (e) => e.preventDefault());
  }

  actualizarCarrusel();
});

// Miembros (ejemplo)
const miembros = [
  { nombre: "Nerea", img: "assets/img/miembros/nerea.png" },
  { nombre: "Lidia", img: "assets/img/miembros/lidia.png" },
  { nombre: "Sara", img: "assets/img/miembros/sara_lo.png" },
  { nombre: "Lorena", img: "assets/img/miembros/lorena.png" },
  { nombre: "Marta", img: "assets/img/miembros/marta.png" },
  { nombre: "Default 6", img: "https://randomuser.me/api/portraits/women/6.jpg" },
  { nombre: "Default 7", img: "https://randomuser.me/api/portraits/men/7.jpg" },
  { nombre: "Default 8", img: "https://randomuser.me/api/portraits/women/8.jpg" },
  { nombre: "Default 8", img: "https://randomuser.me/api/portraits/women/8.jpg" },
  { nombre: "Default 8", img: "https://randomuser.me/api/portraits/women/8.jpg" },
  { nombre: "Default 8", img: "https://randomuser.me/api/portraits/women/8.jpg" },
];

function mostrarMiembrosAleatorios(num = 7) {
  const contenedor = document.querySelector('.miembros-scroll');
  if (!contenedor) return;
  // Mezclar array
  const mezclados = miembros.slice().sort(() => Math.random() - 0.5);
  contenedor.innerHTML = '';
  mezclados.slice(0, num).forEach(m => {
    const card = document.createElement('div');
    card.className = 'miembro-card';
    card.innerHTML = `
      <div class="img-container">
        <img src="${m.img}" alt="${m.nombre}">
      </div>
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


// Comentarios usando Netlify Functions (solo envío en index)
const formComentarioMain = document.getElementById("form-comentario");
const NETLIFY_BASE = "https://insolentes-project.netlify.app";

async function enviarComentario(nombre, texto) {
  try {
    const response = await fetch(`${NETLIFY_BASE}/.netlify/functions/addComentario`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, texto }),
    });
    if (!response.ok) throw new Error("Error al enviar comentario");
  } catch (error) {
    console.error(error);
    alert("Hubo un problema al enviar tu comentario. Inténtalo de nuevo.");
  }
}

if (formComentarioMain) {
  formComentarioMain.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value || "Anónimo";
    const texto = document.getElementById("comentario").value;
    if (texto.trim() === "") return;
    await enviarComentario(nombre, texto);
    formComentarioMain.reset();
  });
}
