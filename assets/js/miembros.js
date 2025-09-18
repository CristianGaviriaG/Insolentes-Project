// Miembros (igual que en main.js)
const miembros = [
  { nombre: "Nerea", img: "assets/img/miembros/nerea.png" },
  { nombre: "Lidia", img: "assets/img/miembros/lidia.png" },
  { nombre: "Sara", img: "assets/img/miembros/sara_lo.png" },
  { nombre: "Lorena", img: "assets/img/miembros/lorena.png" },
  { nombre: "Marta", img: "assets/img/miembros/marta.png" },
  { nombre: "Default 6", img: "https://randomuser.me/api/portraits/women/6.jpg" },
  { nombre: "Default 7", img: "https://randomuser.me/api/portraits/men/7.jpg" },
  { nombre: "Default 8", img: "https://randomuser.me/api/portraits/women/8.jpg" },
  { nombre: "Default 8", img: "https://randomuser.me/api/portraits/women/9.jpg" },
  { nombre: "Default 8", img: "https://randomuser.me/api/portraits/women/10.jpg" },
  { nombre: "Default 8", img: "https://randomuser.me/api/portraits/women/11.jpg" },
];

function mostrarMiembrosGrid() {
  const grid = document.querySelector('.miembros-grid, .miembros-scroll');
  if (!grid) return;
  grid.innerHTML = '';
  miembros.forEach(m => {
    const card = document.createElement('div');
    card.className = 'miembro-card';
    card.innerHTML = `
      <div class="img-container">
        <img src="${m.img}" alt="${m.nombre}">
      </div>
      <div class="nombre">${m.nombre}</div>
    `;
    grid.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', mostrarMiembrosGrid);
