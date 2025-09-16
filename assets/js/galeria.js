// Galería dinámica optimizada
document.addEventListener('DOMContentLoaded', () => {
  // Configuración de la galería
  const configuracionGaleria = {
    totalImagenes: 74, // Cambia este número según cuántas imágenes tengas
    nombreBase: "insolentes_galeria",
    extension: ".jpeg",
    carpeta: "assets/img/galeria/",
    // Números de imágenes que NO existen (opcional)
    imagenesExcluidas: [], // Por ejemplo, si faltan estas imágenes
    // Descripciones personalizadas para imágenes específicas (opcional)
    descripcionesEspeciales: {
      1: "Primera aventura de la peña",
      5: "Momento especial de celebración",
      15: "Recuerdo inolvidable",
      25: "Aventura épica",
      35: "Experiencias inolvidables",
      50: "Medio siglo de diversión",
      74: "La última gran aventura"
    }
  };

  // Descripciones por defecto
  const descripcionesPorDefecto = [
    "Momentos increíbles de la peña",
    "Aventuras inolvidables", 
    "Grandes momentos juntos",
    "Diversión garantizada",
    "Recuerdos especiales",
    "Momentos únicos",
    "Experiencias compartidas",
    "Aventuras de la peña",
    "Momentos de alegría",
    "Recuerdos inolvidables",
    "Diversión sin límites",
    "Grandes aventuras",
    "Momentos especiales",
    "Experiencias únicas",
    "Recuerdos preciados",
    "Aventuras memorables",
    "Momentos de amistad",
    "Diversión compartida",
    "Experiencias increíbles",
    "Recuerdos entrañables"
  ];

  // Generar array de imágenes dinámicamente
  function generarListaImagenes() {
    const imagenes = [];
    
    for (let i = 1; i <= configuracionGaleria.totalImagenes; i++) {
      // Saltar imágenes excluidas
      if (configuracionGaleria.imagenesExcluidas.includes(i)) {
        continue;
      }
      
      // Determinar descripción
      let descripcion;
      if (configuracionGaleria.descripcionesEspeciales[i]) {
        descripcion = configuracionGaleria.descripcionesEspeciales[i];
      } else {
        // Usar descripción por defecto de manera cíclica
        const indiceDescripcion = (i - 1) % descripcionesPorDefecto.length;
        descripcion = descripcionesPorDefecto[indiceDescripcion];
      }
      
      imagenes.push({
        nombre: `${configuracionGaleria.nombreBase} (${i})${configuracionGaleria.extension}`,
        descripcion: descripcion,
        numero: i
      });
    }
    
    return imagenes;
  }

  // Generar la lista de imágenes
  const imagenesGaleria = generarListaImagenes();

  // Generar galería dinámicamente
  function generarGaleria() {
    const grid = document.querySelector('.mosaico-grid');
    if (!grid) return;

    grid.innerHTML = '';
    
    imagenesGaleria.forEach((img, index) => {
      const imgElement = document.createElement('img');
      imgElement.src = `${configuracionGaleria.carpeta}${img.nombre}`;
      imgElement.alt = img.descripcion;
      imgElement.className = 'mosaico-img';
      imgElement.loading = 'lazy'; // Lazy loading para mejor rendimiento
      imgElement.dataset.index = index;
      
      // Click para abrir modal
      imgElement.addEventListener('click', () => abrirModal(img, index));
      
      // Manejo de errores de carga
      imgElement.addEventListener('error', () => {
        console.warn(`No se pudo cargar la imagen: ${img.nombre}`);
        imgElement.style.display = 'none'; // Ocultar imágenes que no existen
      });
      
      grid.appendChild(imgElement);
    });

    // Mostrar información en consola
    console.log(`✅ Galería generada: ${imagenesGaleria.length} imágenes cargadas`);
  }

  // Modal para ampliar imágenes
  function crearModal() {
    const modal = document.createElement('div');
    modal.id = 'galeria-modal';
    modal.className = 'galeria-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="modal-close">&times;</span>
        <img id="modal-img" src="" alt="">
        <div class="modal-navigation">
          <button id="modal-prev" class="modal-nav-btn">&#8249;</button>
          <button id="modal-next" class="modal-nav-btn">&#8250;</button>
        </div>
        <div class="modal-info">
          <h3 id="modal-title"></h3>
          <p id="modal-counter"></p>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Event listeners del modal
    const closeBtn = modal.querySelector('.modal-close');
    const prevBtn = modal.querySelector('#modal-prev');
    const nextBtn = modal.querySelector('#modal-next');

    closeBtn.addEventListener('click', cerrarModal);
    prevBtn.addEventListener('click', () => navegarModal(-1));
    nextBtn.addEventListener('click', () => navegarModal(1));
    
    // Cerrar al hacer click fuera de la imagen
    modal.addEventListener('click', (e) => {
      if (e.target === modal) cerrarModal();
    });

    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
      if (modal.style.display === 'flex') {
        if (e.key === 'Escape') cerrarModal();
        if (e.key === 'ArrowLeft') navegarModal(-1);
        if (e.key === 'ArrowRight') navegarModal(1);
      }
    });
  }

  let currentImageIndex = 0;

  function abrirModal(img, index) {
    currentImageIndex = index;
    const modal = document.getElementById('galeria-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalCounter = document.getElementById('modal-counter');

    modalImg.src = `${configuracionGaleria.carpeta}${img.nombre}`;
    modalImg.alt = img.descripcion;
    modalTitle.textContent = img.descripcion;
    modalCounter.textContent = `${index + 1} de ${imagenesGaleria.length}`;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Evitar scroll del body
  }

  function cerrarModal() {
    const modal = document.getElementById('galeria-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaurar scroll del body
  }

  function navegarModal(direction) {
    currentImageIndex += direction;
    
    if (currentImageIndex >= imagenesGaleria.length) {
      currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
      currentImageIndex = imagenesGaleria.length - 1;
    }

    const img = imagenesGaleria[currentImageIndex];
    abrirModal(img, currentImageIndex);
  }

  // Navbar responsive (reutilizado)
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.querySelector("nav ul");
  
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function() {
      navMenu.classList.toggle("active");
      hamburger.classList.toggle("open");
    });

    navMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        hamburger.classList.remove("open");
      });
    });
  }

  // Inicializar
  generarGaleria();
  crearModal();
});
