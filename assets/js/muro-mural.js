(() => {
  const NETLIFY_BASE = "https://insolentes-project.netlify.app";
  // Obtener comentarios desde Netlify Function
  async function obtenerComentarios() {
    try {
      const response = await fetch(`${NETLIFY_BASE}/.netlify/functions/getComentarios`);
      if (!response.ok) throw new Error("Error al obtener comentarios");
      const comentarios = await response.json();
      console.log("Comentarios recibidos:", comentarios);
      return Object.values(comentarios);
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
      throw error;
    }
  }

  // Mostrar comentarios en el mural
  async function pintarComentariosMural() {
    const mural = document.getElementById("muro-mural");
    mural.innerHTML = "Cargando comentarios...";
    try {
      const comentarios = await obtenerComentarios();
      mural.innerHTML = "";
      if (!comentarios || comentarios.length === 0) {
        mural.innerHTML = '<div class="muro-mural-vacio">No hay comentarios aún.</div>';
        return;
      }
      comentarios.forEach((c) => {
        const div = document.createElement("div");
        div.className = "muro-mural-comentario";
        div.innerHTML =
          (c.nombre ? `<div class=\"muro-mural-nombre\">${c.nombre}</div>` : "") +
          `<div class=\"muro-mural-texto\">${c.texto}</div>`;
        mural.appendChild(div);
      });
    } catch (error) {
      mural.innerHTML = '<div class="muro-mural-error">Error al cargar comentarios. Revisa la consola.</div>';
    }
  }

  document.addEventListener("DOMContentLoaded", pintarComentariosMural);
})();