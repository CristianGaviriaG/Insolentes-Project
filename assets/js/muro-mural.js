// Mostrar comentarios por defecto SOLO si no hay nada en localStorage
let comentarios = [];
const comentariosStorage = localStorage.getItem('muroComentarios');
if (comentariosStorage && JSON.parse(comentariosStorage).length > 0) {
    comentarios = JSON.parse(comentariosStorage);
} else {
    comentarios = [
        { nombre: 'Fran', texto: '¡Viva la Peña Insolentes!' },
        { nombre: 'Anónimo', texto: 'Gran noche la del sábado pasado 🍻' },
        { nombre: 'Chevi', texto: 'No olvidéis traer la baraja para el próximo evento.' },
        { nombre: 'Fran', texto: '¡Viva la Peña Insolentes!' },
        { nombre: 'Anónimo', texto: 'Gran noche la del sábado pasado 🍻' },
        { nombre: 'Chevi', texto: 'No olvidéis traer la baraja para el próximo evento.' },
        { nombre: 'Fran', texto: '¡Viva la Peña Insolentes!' },
        { nombre: 'Anónimo', texto: 'Gran noche la del sábado pasado 🍻' },
        { nombre: 'Chevi', texto: 'No olvidéis traer la baraja para el próximo evento.' },
        { nombre: 'Fran', texto: '¡Viva la Peña Insolentes!' },
        { nombre: 'Anónimo', texto: 'Gran noche la del sábado pasado 🍻' },
        { nombre: 'Chevi', texto: 'No olvidéis traer la baraja para el próximo evento.' },
        { nombre: 'Fran', texto: '¡Viva la Peña Insolentes!' },
        { nombre: 'Anónimo', texto: 'Gran noche la del sábado pasado 🍻' },
        { nombre: 'Chevi', texto: 'No olvidéis traer la baraja para el próximo evento.' },
        { nombre: 'Fran', texto: '¡Viva la Peña Insolentes!' },
        { nombre: 'Anónimo', texto: 'Gran noche la del sábado pasado 🍻' },
        { nombre: 'Chevi', texto: 'No olvidéis traer la baraja para el próximo evento.' },
        { nombre: 'Fran', texto: '¡Viva la Peña Insolentes!' },
        { nombre: 'Anónimo', texto: 'Gran noche la del sábado pasado 🍻' },
        { nombre: 'Chevi', texto: 'No olvidéis traer la baraja para el próximo evento.' },
        { nombre: 'Cristian', texto: '¡A seguir sumando recuerdos juntos!' },
        { nombre: 'Chevi', texto: 'No olvidéis traer la baraja para el próximo evento.' },
        { nombre: 'Cristian', texto: '¡A seguir sumando recuerdos juntos!' },
        { nombre: 'Chevi', texto: 'No olvidéis traer la baraja para el próximo evento.' },
        { nombre: 'Cristian', texto: '¡A seguir sumando recuerdos juntos!' },
        { nombre: 'Chevi', texto: 'No olvidéis traer la baraja para el próximo evento.' },
        { nombre: 'Cristian', texto: '¡A seguir sumando recuerdos juntos!' },
        { nombre: 'Chevi', texto: 'No olvidéis traer la baraja para el próximo evento.' },
        { nombre: 'Cristian', texto: '¡A seguir sumando recuerdos juntos!' },
        { nombre: 'Chevi', texto: 'No olvidéis traer la baraja para el próximo evento.' },
        { nombre: 'Cristian', texto: '¡A seguir sumando recuerdos juntos!' },
        { nombre: '', texto: 'El mejor grupo, sin duda.' },
        { nombre: '', texto: 'El mejor grupo, sin duda.' },
        { nombre: '', texto: 'El mejor grupo, sin duda.' },
    ];
}

function randomBetween(a, b) {
    return Math.random() * (b - a) + a;
}

function pintarComentariosMural() {
    const mural = document.getElementById('muro-mural');
    mural.innerHTML = '';
    const isMobile = window.innerWidth <= 700;

    // Primero, renderiza todos los comentarios (sin posición)
    comentarios.forEach((c, i) => {
        const div = document.createElement('div');
        div.className = 'muro-mural-comentario';
        div.innerHTML =
            (c.nombre ? `<div class=\"muro-mural-nombre\">${c.nombre}</div>` : '') +
            `<div class=\"muro-mural-texto\">${c.texto}</div>`;
        mural.appendChild(div);
    });

    // Ajusta la altura del mural si hay muchos comentarios
    if (comentarios.length > 8) {
        mural.style.minHeight = (comentarios.length * (isMobile ? 70 : 90)) + 'px';
    } else {
        mural.style.minHeight = '';
    }

    // Ahora sí, calcula el área real disponible
    const muralW = mural.offsetWidth;
    const muralH = mural.offsetHeight || window.innerHeight * 0.7;
    const nodes = mural.querySelectorAll('.muro-mural-comentario');

    if (isMobile) {
        // Mostrar en una sola columna (vertical), sin posiciones absolutas
        nodes.forEach((div) => {
            div.style.position = 'static';
            div.style.width = '100%';
            div.style.maxWidth = '100vw';
            div.style.minWidth = '0';
            div.style.margin = '0 0 1.2rem 0';
            div.style.wordBreak = 'break-word';
            div.style.overflowWrap = 'anywhere';
            div.style.transform = 'none';
            div.style.left = '';
            div.style.top = '';
        });
    } else {
        // Desktop: dispersión libre
        nodes.forEach((div) => {
            const ancho = muralW - 240;
            const alto = muralH - 120;
            const rot = randomBetween(-18, 18);
            const x = randomBetween(0, Math.max(0, ancho));
            const y = randomBetween(0, Math.max(0, alto));
            div.style.setProperty('--x', `${x}px`);
            div.style.setProperty('--y', `${y}px`);
            div.style.setProperty('--rot', `${rot}deg`);
        });
    }
}

document.addEventListener('DOMContentLoaded', pintarComentariosMural);
window.addEventListener('resize', pintarComentariosMural);
