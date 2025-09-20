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
    console.log("🔍 Iniciando obtenerComentarios()...");
    
    // Detectar si estamos en desarrollo local
    const isLocal = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' || 
                   window.location.hostname.includes('file://');
    
    console.log("🌐 Entorno detectado:", isLocal ? "LOCAL" : "PRODUCCIÓN");
    
    if (isLocal) {
      console.log("🏠 Usando datos de prueba locales...");
      console.log("📊 Datos de prueba:", COMENTARIOS_PRUEBA);
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));
      return Object.values(COMENTARIOS_PRUEBA);
    }

    try {
      console.log("🌐 Haciendo petición a:", `${NETLIFY_BASE}/.netlify/functions/getComentarios`);
      const response = await fetch(`${NETLIFY_BASE}/.netlify/functions/getComentarios`);
      console.log("📡 Respuesta recibida:", response.status, response.statusText);
      
      if (!response.ok) {
        console.error("❌ Error en la respuesta:", response.status, response.statusText);
        throw new Error(`Error al obtener comentarios: ${response.status}`);
      }
      
      const comentarios = await response.json();
      console.log("✅ Comentarios recibidos desde Netlify:", comentarios);
      console.log("📊 Tipo de datos recibidos:", typeof comentarios);
      console.log("🔢 Cantidad de comentarios:", Object.keys(comentarios).length);
      
      return Object.values(comentarios);
    } catch (error) {
      console.error("💥 Error al obtener comentarios desde Netlify:", error);
      console.log("🔄 Fallback: usando datos de prueba locales...");
      return Object.values(COMENTARIOS_PRUEBA);
    }
  }

  // Mostrar comentarios en el mural
  async function pintarComentariosMural() {
    console.log("🎨 Iniciando pintarComentariosMural()...");
    const mural = document.getElementById("muro-mural");
    
    if (!mural) {
      console.error("❌ No se encontró el elemento #muro-mural");
      return;
    }
    
    console.log("📏 Dimensiones iniciales del mural:", {
      width: mural.offsetWidth,
      height: mural.offsetHeight,
      clientWidth: mural.clientWidth,
      clientHeight: mural.clientHeight
    });
    
    mural.innerHTML = "Cargando comentarios...";
    
    try {
      const comentarios = await obtenerComentarios();
      console.log("📝 Comentarios obtenidos:", comentarios);
      console.log("🔢 Total de comentarios:", comentarios.length);
      console.log("📊 Estructura de cada comentario:", comentarios.map((c, i) => `${i}: ${JSON.stringify(c)}`));
      
      mural.innerHTML = "";
      
      if (!comentarios || comentarios.length === 0) {
        console.log("📭 No hay comentarios para mostrar");
        mural.innerHTML = '<div class="muro-mural-vacio">No hay comentarios aún.</div>';
        return;
      }
      
      // Verificar si es móvil
      const isMobile = window.innerWidth <= 700;
      console.log("📱 ¿Es móvil?", isMobile, "- Ancho ventana:", window.innerWidth);
      
      if (!isMobile) {
        console.log("🖥️ Modo DESKTOP: Posicionamiento absoluto aleatorio");
        // Obtener dimensiones del mural para desktop
        const muralWidth = mural.offsetWidth;
        const muralHeight = Math.max(mural.offsetHeight, 400);
        console.log("📐 Área de trabajo:", { muralWidth, muralHeight });
        
        comentarios.forEach((c, index) => {
          console.log(`🏗️ Procesando comentario ${index + 1}/${comentarios.length}:`, c);
          
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
          
          console.log(`📍 Posición calculada para comentario ${index + 1}:`, { x: x.toFixed(2), y: y.toFixed(2), rotation: rotation.toFixed(2) });
          
          // Aplicar estilos de posición
          div.style.setProperty('--x', `${x}px`);
          div.style.setProperty('--y', `${y}px`);
          div.style.setProperty('--rot', `${rotation}deg`);
          
          // Debug: añadir atributos para inspección
          div.setAttribute('data-debug-x', x);
          div.setAttribute('data-debug-y', y);
          div.setAttribute('data-debug-rot', rotation);
          div.setAttribute('data-debug-index', index);
          
          mural.appendChild(div);
          console.log(`✅ Comentario ${index + 1} añadido al DOM`);
        });
      } else {
        console.log("📱 Modo MÓVIL: Layout vertical con flexbox");
        // Para móvil, simplemente añadir sin posicionamiento absoluto
        comentarios.forEach((c, index) => {
          console.log(`🏗️ Procesando comentario móvil ${index + 1}/${comentarios.length}:`, c);
          
          const div = document.createElement("div");
          div.className = "muro-mural-comentario";
          div.innerHTML =
            (c.nombre ? `<div class=\"muro-mural-nombre\">${c.nombre}</div>` : "") +
            `<div class=\"muro-mural-texto\">${c.texto}</div>`;
          
          // Debug: añadir atributos para inspección
          div.setAttribute('data-debug-mobile', 'true');
          div.setAttribute('data-debug-index', index);
          
          mural.appendChild(div);
          console.log(`✅ Comentario móvil ${index + 1} añadido al DOM`);
        });
      }
      
      console.log("🎉 FINALIZADO: Total de comentarios mostrados en DOM:", mural.children.length);
      console.log("🔍 Elementos creados:", Array.from(mural.children).map((el, i) => ({
        index: i,
        className: el.className,
        innerHTML: el.innerHTML.substring(0, 50) + '...',
        position: isMobile ? 'relative' : `x:${el.getAttribute('data-debug-x')}, y:${el.getAttribute('data-debug-y')}`
      })));
      
    } catch (error) {
      console.error("💥 Error en pintarComentariosMural:", error);
      console.error("📋 Stack trace:", error.stack);
      mural.innerHTML = '<div class="muro-mural-error">Error al cargar comentarios. Revisa la consola.</div>';
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 DOM cargado, iniciando aplicación del mural...");
    console.log("🌍 URL actual:", window.location.href);
    console.log("🏠 Hostname:", window.location.hostname);
    console.log("📱 User Agent:", navigator.userAgent);
    console.log("🖥️ Resolución de pantalla:", `${window.innerWidth}x${window.innerHeight}`);
    
    pintarComentariosMural();
  });
})();