// Miembros (igual que en main.js)
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
