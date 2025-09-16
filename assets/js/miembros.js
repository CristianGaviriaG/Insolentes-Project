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
// Miembros (igual que en main.js)
const miembros = [
  { nombre: "Default 1", img: "assets/img/miembros/nerea.png" },
  { nombre: "Default 2", img: "https://randomuser.me/api/portraits/women/2.jpg" },
  { nombre: "Default 3", img: "https://randomuser.me/api/portraits/men/3.jpg" },
  { nombre: "Default 4", img: "https://randomuser.me/api/portraits/women/4.jpg" },
  { nombre: "Default 5", img: "https://randomuser.me/api/portraits/men/5.jpg" },
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
