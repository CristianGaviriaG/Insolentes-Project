// Juegos Peña Insolentes - lógica de modales y juegos

document.addEventListener('DOMContentLoaded', async () => {
  // --- Carga de datos desde archivos JSON ---
  let retosRuleta = [];
  let frasesYoNunca = [];
  let verdades = [];
  let retos = [];
  let horoscopos = {};

  // Función para cargar datos JSON
  async function cargarDatosJSON(archivo, fallback = []) {
    try {
      const response = await fetch(`assets/data/${archivo}`);
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      const data = await response.json();
      console.log(`✅ Cargado: ${archivo}`);
      return data;
    } catch (error) {
      console.warn(`⚠️ Error cargando ${archivo}:`, error.message);
      console.log(`📦 Usando datos de fallback para ${archivo}`);
      return fallback;
    }
  }

  // Cargar todos los datos al inicio
  try {
    const [
      datosRetosRuleta,
      datosFrasesYoNunca,
      datosVerdades,
      datosRetos,
      datosHoroscopos
    ] = await Promise.all([
      cargarDatosJSON('retos-ruleta.json', {
        retos: ["Haz un brindis rimado", "Bebe con la mano izquierda", "Canta el himno de la peña"]
      }),
      cargarDatosJSON('frases-yonunca.json', {
        frases: ["Yo nunca he perdido mi vaso en San Mateo", "Yo nunca he bailado encima de una mesa"]
      }),
      cargarDatosJSON('verdades.json', {
        verdades: ["¿Cuál es tu recuerdo más loco de la peña?", "¿A quién retarías a un duelo de chupitos?"]
      }),
      cargarDatosJSON('retos.json', {
        retos: ["Haz una ronda de chistes malos", "Imita a otro miembro de la peña durante 1 minuto"]
      }),
      cargarDatosJSON('horoscopos.json', {
        horoscopos: {
          aries: ["Hoy tu vaso nunca estará vacío", "¡Cuidado con los brindis dobles, Aries!"],
          tauro: ["La resaca no te vencerá esta vez", "Hoy bailas sí o sí, Tauro!"],
          geminis: ["Doble personalidad, doble ronda", "Hoy te toca organizar el próximo plan"]
        }
      })
    ]);

    // Asignar datos cargados
    retosRuleta = datosRetosRuleta.retos || datosRetosRuleta;
    frasesYoNunca = datosFrasesYoNunca.frases || datosFrasesYoNunca;
    verdades = datosVerdades.verdades || datosVerdades;
    retos = datosRetos.retos || datosRetos;
    horoscopos = datosHoroscopos.horoscopos || datosHoroscopos;

    console.log(`🎮 Datos de juegos cargados:`, {
      retosRuleta: retosRuleta.length,
      frasesYoNunca: frasesYoNunca.length,
      verdades: verdades.length,
      retos: retos.length,
      horoscopos: Object.keys(horoscopos).length
    });

  } catch (error) {
    console.error('❌ Error crítico cargando datos de juegos:', error);
  }

  // --- Utilidades modales ---
  function abrirModal(id) {
    document.getElementById(id).style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  function cerrarTodosModales() {
    document.querySelectorAll('.modal-juego').forEach(m => m.style.display = 'none');
    document.body.style.overflow = 'auto';
  }
  document.querySelectorAll('.modal-juego-close').forEach(btn => {
    btn.onclick = cerrarTodosModales;
  });
  window.onclick = function(e) {
    if (e.target.classList.contains('modal-juego')) cerrarTodosModales();
  };

  // --- Ruleta de Retos (Chart.js original) ---
  function loadScript(src, id) {
    return new Promise((resolve, reject) => {
      if (document.getElementById(id)) return resolve();
      const s = document.createElement('script');
      s.src = src;
      s.id = id;
      s.onload = resolve;
      s.onerror = reject;
      document.body.appendChild(s);
    });
  }
  // --- Ruleta de Retos (Chart.js original mejorada) ---
  // Baraja para retos de la ruleta
  function crearBaraja(arr) {
    let baraja = arr.slice();
    let usados = [];
    return function() {
      if (baraja.length === 0) {
        baraja = usados.slice();
        usados = [];
      }
      const idx = Math.floor(Math.random() * baraja.length);
      const val = baraja.splice(idx, 1)[0];
      usados.push(val);
      return val;
    };
  }
  const dameRetoRuleta = crearBaraja(retosRuleta);
  let ruletaChart = null;
  let ruletaInitialized = false;
  let ruletaLabels = [];
  let ruletaData = [];
  let ruletaColors = [];
  document.getElementById('abrir-ruleta').onclick = async e => {
    e.preventDefault(); abrirModal('modal-ruleta');
    // Load Chart.js and plugin if not present
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js', 'chartjs');
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/chartjs-plugin-datalabels/2.1.0/chartjs-plugin-datalabels.min.js', 'chartjs-datalabels');
    // Generar paneles de la ruleta (6 colores rainbow, sin textos)
    ruletaLabels = [];
    ruletaData = [];
    ruletaColors = [];
    window.retosActualesRuleta = [];
    const darkPalette = [
      '#7c1f2c', // burdeos oscuro
      '#3a2a4d', // violeta oscuro
      '#1a2a3a', // azul oscuro
      '#1a3a2a', // verde oscuro
      '#3a2a1a', // marrón oscuro
      '#2a2a2a'  // gris oscuro
    ];
    // Desordenar colores en cada giro
    let paletteShuffle = darkPalette.slice();
    for (let i = paletteShuffle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [paletteShuffle[i], paletteShuffle[j]] = [paletteShuffle[j], paletteShuffle[i]];
    }
    for (let i = 0; i < 6; i++) {
      let reto = dameRetoRuleta();
      ruletaLabels.push(' '); // Espacio para que Chart.js pinte los paneles
      ruletaData.push(1);
      ruletaColors.push(paletteShuffle[i]);
      window.retosActualesRuleta.push(reto);
    }
    const wheel = document.getElementById("wheel");
    const spinBtn = document.getElementById("spin-btn");
    const finalValue = document.getElementById("final-value");
    // Destruir chart anterior si existe
    if (ruletaChart) { ruletaChart.destroy(); }
    ruletaChart = new window.Chart(wheel, {
      plugins: [window.ChartDataLabels],
      type: "pie",
      data: {
        labels: ruletaLabels,
        datasets: [
          {
            backgroundColor: ruletaColors,
            data: ruletaData,
          },
        ],
      },
      options: {
        responsive: true,
        animation: { duration: 0 },
        plugins: {
          tooltip: false,
          legend: { display: false },
          datalabels: {
            color: "#ffffff",
            formatter: (value, context) => {
              // Mostrar texto truncado si es largo
              let txt = context.chart.data.labels[context.dataIndex];
              if (txt.length > 22) return txt.slice(0, 20) + '…';
              return txt;
            },
            display: false,
            align: 'center',
            anchor: 'center',
            clamp: true,
            display: true,
          },
        },
      },
    });
    // Girar ruleta
    let spinning = false;
    spinBtn.disabled = false;
    spinBtn.textContent = 'GIRAR';
    finalValue.innerHTML = '<p>Click en Girar para empezar</p>';
    spinBtn.onclick = function() {
      if (spinning) return;
      spinning = true;
      spinBtn.disabled = true;
      spinBtn.textContent = '...';
      finalValue.innerHTML = `<p>¡Suerte!</p>`;
      // Randomizar retos y paneles ANTES de girar
      window.retosActualesRuleta = [];
      for (let i = 0; i < 6; i++) {
        let reto = dameRetoRuleta();
        ruletaLabels[i] = reto;
        window.retosActualesRuleta.push(reto);
      }
      ruletaChart.data.labels = ruletaLabels.slice();
      ruletaChart.update();
      // Elegir ángulo final aleatorio y calcular el panel ganador según la flecha (derecha, 90°)
      let vueltas = Math.floor(Math.random() * 2) + 4;
      let anguloPanel = 360 / 6;
  let randomPanel = Math.floor(Math.random() * 6);
  // La flecha está a 90° (3 en punto). El panel 0 es el que arranca en 0° y va en sentido horario.
  // Para que la flecha apunte al centro del panel randomPanel, calculamos el ángulo de inicio de ese panel y restamos 90°
  let anguloPanelInicio = anguloPanel * randomPanel;
  let anguloCentroPanel = anguloPanelInicio + anguloPanel / 2;
  let anguloFinal = 360 * vueltas + (90 - anguloCentroPanel);
      let anguloActual = 0;
      let pasos = 60;
      let paso = 0;
      function animar() {
        anguloActual += (anguloFinal - anguloActual) / Math.max(8, 60 - paso);
        ruletaChart.options.rotation = anguloActual;
        ruletaChart.update();
        paso++;
        if (paso < pasos) {
          requestAnimationFrame(animar);
        } else {
          ruletaChart.options.rotation = anguloFinal;
          ruletaChart.update();
          setTimeout(() => {
            // El panel ganador es el que está en la posición randomPanel
            const retoGanador = window.retosActualesRuleta[randomPanel];
            finalValue.innerHTML = `<p>${retoGanador}</p>`;
            spinBtn.disabled = false;
            spinBtn.textContent = 'GIRAR';
            spinning = false;
          }, 400);
        }
      }
      animar();
    };

    // Tooltip desactivado: no se muestra nada sobre los paneles
    ruletaInitialized = true;
  };

  // --- Yo Nunca ---
  document.getElementById('abrir-yonunca').onclick = e => {
    e.preventDefault(); abrirModal('modal-yonunca');
    document.getElementById('yonunca-frase').textContent = frasesYoNunca[Math.floor(Math.random()*frasesYoNunca.length)];
  };
  document.getElementById('yonunca-siguiente').onclick = function() {
    document.getElementById('yonunca-frase').textContent = frasesYoNunca[Math.floor(Math.random()*frasesYoNunca.length)];
  };

  // --- Verdad o Reto ---
  document.getElementById('abrir-voreto').onclick = e => {
    e.preventDefault(); abrirModal('modal-voreto');
    document.getElementById('voreto-frase').textContent = '';
  };
  document.getElementById('btn-verdad').onclick = function() {
    document.getElementById('voreto-frase').textContent = verdades[Math.floor(Math.random()*verdades.length)];
  };
  document.getElementById('btn-reto').onclick = function() {
    document.getElementById('voreto-frase').textContent = retos[Math.floor(Math.random()*retos.length)];
  };

  // --- Horóscopo Fiestero ---
  document.getElementById('abrir-horoscopo').onclick = e => {
    e.preventDefault(); abrirModal('modal-horoscopo');
    document.getElementById('horoscopo-frase').textContent = '';
  };
  // --- Lógica para horóscopo con iconos ---
  let signoSeleccionado = null;
  const signos = document.querySelectorAll('.horoscopo-signo');
  signos.forEach(signo => {
    signo.onclick = function() {
      signos.forEach(s => s.classList.remove('selected'));
      this.classList.add('selected');
      signoSeleccionado = this.dataset.signo;
    };
  });
  document.getElementById('btn-horoscopo').onclick = function() {
    const signo = signoSeleccionado;
    if (!signo) {
      document.getElementById('horoscopo-frase').textContent = 'Selecciona tu signo primero.';
      return;
    }
    const frases = horoscopos[signo] || ["Hoy es tu día para ser insolente!"];
    document.getElementById('horoscopo-frase').textContent = frases[Math.floor(Math.random()*frases.length)];
  };

  // --- Lógica para evitar repeticiones (baraja) ---
  function crearBaraja(arr) {
    let baraja = arr.slice();
    let usados = [];
    return function() {
      if (baraja.length === 0) {
        baraja = usados.slice();
        usados = [];
      }
      const idx = Math.floor(Math.random() * baraja.length);
      const val = baraja.splice(idx, 1)[0];
      usados.push(val);
      return val;
    };
  }
  const dameYoNunca = crearBaraja(frasesYoNunca);
  const dameVerdad = crearBaraja(verdades);
  const dameReto = crearBaraja(retos);
  // Yo Nunca
  if(document.getElementById('yonunca-siguiente')){
    document.getElementById('yonunca-siguiente').onclick = function() {
      document.getElementById('yonunca-frase').textContent = dameYoNunca();
    };
  }
  // Verdad o Reto
  if(document.getElementById('btn-verdad')){
    document.getElementById('btn-verdad').onclick = function() {
      document.getElementById('voreto-frase').textContent = dameVerdad();
    };
  }
  if(document.getElementById('btn-reto')){
    document.getElementById('btn-reto').onclick = function() {
      document.getElementById('voreto-frase').textContent = dameReto();
    };
  }

  // --- Ruleta animada visual (Wheel of Fortune simple) ---
  // (Eliminado: ahora se usa Chart.js original en el modal)
});
