(() => {
  const NETLIFY_BASE = "https://insolentes-project.netlify.app";
  
  // Datos de prueba para desarrollo local
  const COMENTARIOS_PRUEBA = {
    "-O_XL9jrpeULqg6XehTv": { nombre: "Cristian", texto: "Esto comienza ya!🍻" },
    "-O_YCHQp00OBSI_arWKC": { nombre: "x", texto: "hola lorena" },
    "-O_YGMmnpcRPM0lN5apy": { nombre: "Garmendia", texto: "Se de quién está enamorado Alberto Herrero Arias" },
    "-O_Yj1GVW_qkbNBjrFoY": { nombre: "Clau", texto: "Muy currado !!! Gracias por los juegos BUEN SAN MATEO ❤️" },
    "-O_Yj1SM2gMTZRnMciYv": { nombre: "Clau", texto: "Muy currado !!! Gracias por los juegos BUEN SAN MATEO ❤️" },
    "-O_debug1": { nombre: "Debug User 1", texto: "Este es un comentario de prueba para desarrollo local" },
    "-O_debug2": { nombre: "Debug User 2", texto: "Otro comentario de prueba con texto más largo para ver cómo se comporta el layout cuando hay más contenido" },
    "-O_debug3": { nombre: "", texto: "Comentario anónimo de prueba" }
  };

  // Obtener comentarios desde Netlify Function
  async function obtenerComentarios() {
    // Detectar si estamos en desarrollo local
    const isLocal = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' || 
                   window.location.hostname.includes('file://');
    
    if (isLocal) {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));
      return Object.values(COMENTARIOS_PRUEBA);
    }

    try {
      const response = await fetch(`${NETLIFY_BASE}/.netlify/functions/getComentarios`);
      if (!response.ok) {
        throw new Error(`Error al obtener comentarios: ${response.status}`);
      }
      
      const comentarios = await response.json();
      return Object.values(comentarios);
    } catch (error) {
      // Fallback: usar datos de prueba locales si falla Netlify
      return Object.values(COMENTARIOS_PRUEBA);
    }
  }

  // Mostrar comentarios en el mural
  async function pintarComentariosMural() {
    const mural = document.getElementById("muro-mural");
    
    if (!mural) {
      return;
    }
    
    mural.innerHTML = "Cargando comentarios...";
    
    try {
      const comentarios = await obtenerComentarios();
      mural.innerHTML = "";
      
      if (!comentarios || comentarios.length === 0) {
        mural.innerHTML = '<div class="muro-mural-vacio">No hay comentarios aún.</div>';
        return;
      }
      
      // Verificar si es móvil
      const isMobile = window.innerWidth <= 700;
      
      if (!isMobile) {
        // Obtener dimensiones del mural para desktop
        const muralWidth = mural.offsetWidth;
        const muralHeight = Math.max(mural.offsetHeight, 400);
        
        comentarios.forEach((c, index) => {
          const div = document.createElement("div");
          div.className = "muro-mural-comentario";
          div.innerHTML =
            (c.nombre ? `<div class=\"muro-mural-nombre\">${c.nombre}</div>` : "") +
            `<div class=\"muro-mural-texto\">${c.texto}</div>`;
          
          // Posicionamiento aleatorio pero más distribuido
          const maxWidth = 320; // max-width del comentario
          const maxHeight = 150; // altura estimada del comentario
          const x = Math.random() * Math.max(0, muralWidth - maxWidth);
          const y = Math.random() * Math.max(0, muralHeight - maxHeight);
          const rotation = (Math.random() - 0.5) * 15; // Rotación entre -7.5 y 7.5 grados
          
          // Aplicar estilos de posición
          div.style.setProperty('--x', `${x}px`);
          div.style.setProperty('--y', `${y}px`);
          div.style.setProperty('--rot', `${rotation}deg`);
          
          mural.appendChild(div);
        });
      } else {
        // Para móvil, simplemente añadir sin posicionamiento absoluto
        comentarios.forEach((c, index) => {
          const div = document.createElement("div");
          div.className = "muro-mural-comentario";
          div.innerHTML =
            (c.nombre ? `<div class=\"muro-mural-nombre\">${c.nombre}</div>` : "") +
            `<div class=\"muro-mural-texto\">${c.texto}</div>`;
          
          mural.appendChild(div);
        });
      }
      
    } catch (error) {
      mural.innerHTML = '<div class="muro-mural-error">Error al cargar comentarios. Revisa la consola.</div>';
    }
  }

  document.addEventListener("DOMContentLoaded", pintarComentariosMural);
})();