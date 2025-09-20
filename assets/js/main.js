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
  { nombre: "Saralo", img: "assets/img/miembros/sara_lo.png" },
  { nombre: "Lore", img: "assets/img/miembros/lorena.png" },
  { nombre: "Marta", img: "assets/img/miembros/marta.png" },
  { nombre: "Alba", img: "assets/img/miembros/alba.png" },
  { nombre: "Sara", img: "assets/img/miembros/sarab.png" },
  { nombre: "Adri", img: "assets/img/miembros/adriana.png" },
  { nombre: "Mario", img: "assets/img/miembros/mario.png" },
  { nombre: "Hector", img: "assets/img/miembros/hector.png" },
  { nombre: "Asier", img: "assets/img/miembros/asier.png" },
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
const btnEnviar = document.getElementById("btn-enviar");
const feedbackDiv = document.getElementById("muro-feedback");
const NETLIFY_BASE = "https://insolentes-project.netlify.app";

let isSubmitting = false; // Flag para prevenir envíos múltiples

// Función para mostrar mensajes de feedback
function mostrarFeedback(mensaje, tipo = 'info', duracion = 4000) {
  if (!feedbackDiv) return;
  
  feedbackDiv.textContent = mensaje;
  feedbackDiv.className = `muro-feedback ${tipo} show`;
  
  // Auto-ocultar después de la duración especificada
  setTimeout(() => {
    feedbackDiv.className = 'muro-feedback';
  }, duracion);
}

// Función para cambiar estado del botón
function cambiarEstadoBoton(loading = false, texto = 'Enviar') {
  if (!btnEnviar) return;
  
  btnEnviar.disabled = loading;
  btnEnviar.className = `btn ${loading ? 'loading' : ''}`;
  
  if (!loading) {
    btnEnviar.textContent = texto;
  }
}

async function enviarComentario(nombre, texto) {
  try {
    // Detectar si estamos en desarrollo local
    const isLocal = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' || 
                   window.location.hostname.includes('file://');
    
    if (isLocal) {
      // Simular delay en desarrollo local
      await new Promise(resolve => setTimeout(resolve, 2000));
      mostrarFeedback('✅ Comentario enviado con éxito (modo desarrollo)', 'success');
      return;
    }

    const response = await fetch(`${NETLIFY_BASE}/.netlify/functions/addComentario`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, texto }),
    });
    
    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }
    
    mostrarFeedback('✅ ¡Comentario enviado con éxito! Aparecerá en el mural en unos momentos.', 'success', 5000);
    
  } catch (error) {
    console.error('Error al enviar comentario:', error);
    mostrarFeedback('❌ Error al enviar el comentario. Por favor, inténtalo de nuevo.', 'error', 6000);
    throw error;
  }
}

if (formComentarioMain) {
  formComentarioMain.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Prevenir envíos múltiples
    if (isSubmitting) {
      mostrarFeedback('⏳ Ya hay un envío en proceso, por favor espera...', 'info', 3000);
      return;
    }
    
    const nombre = document.getElementById("nombre").value.trim() || "Anónimo";
    const texto = document.getElementById("comentario").value.trim();
    
    // Validaciones
    if (texto === "") {
      mostrarFeedback('⚠️ Por favor, escribe un mensaje antes de enviar.', 'error', 3000);
      return;
    }
    
    if (texto.length > 500) {
      mostrarFeedback('⚠️ El mensaje es demasiado largo. Máximo 500 caracteres.', 'error', 4000);
      return;
    }
    
    // Iniciar proceso de envío
    isSubmitting = true;
    cambiarEstadoBoton(true);
    mostrarFeedback('📤 Enviando comentario...', 'info');
    
    try {
      await enviarComentario(nombre, texto);
      // Reset del formulario solo si el envío fue exitoso
      formComentarioMain.reset();
    } catch (error) {
      // El error ya se maneja en enviarComentario()
    } finally {
      // Restaurar estado del botón
      isSubmitting = false;
      cambiarEstadoBoton(false);
    }
  });
}
