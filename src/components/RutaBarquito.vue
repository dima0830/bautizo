<template>
  <!--
    LA RUTA DEL BARQUITO: un río de acuarela zigzaguea de la iglesia a la
    fiesta. El barquito navega a la altura de la mitad de la pantalla mientras
    bajas, con inercia (como si el agua lo llevara), se voltea hacia donde
    va, se inclina en las curvas y va pintando el río. Cada parada se ilumina
    cuando llega.
  -->
  <section id="ruta" class="seccion ruta">
    <div v-flotar class="cabecera">
      <p class="antetitulo">Mi gran día</p>
      <h2 class="titulo">La ruta del barquito</h2>
      <p class="subtitulo">De la iglesia a la fiesta, navegamos juntos</p>
    </div>

    <div ref="mapaRef" class="mapa">
      <!-- el lienzo mide lo mismo que el mapa en píxeles: así el río no se deforma -->
      <svg class="camino" :viewBox="`0 0 ${tam.ancho} ${tam.alto}`" aria-hidden="true">
        <!-- el río: un trazo ancho de agua con borde de acuarela -->
        <g filter="url(#acuarela)">
          <path :d="camino" class="rio" />
        </g>
        <path :d="camino" class="riel" />
        <path
          ref="trazoRef"
          :d="camino"
          class="trazo"
          :style="{ strokeDasharray: largoTrazo, strokeDashoffset: largoTrazo * (1 - avance) }"
        />
      </svg>

      <!-- pequeños símbolos a la orilla del río -->
      <div class="orilla o-paloma" aria-hidden="true"><Ilustracion nombre="paloma" /></div>

      <article v-for="(e, i) in eventos" :key="e.titulo" class="parada" :class="[`p${i + 1}`, { llego: llegadas[i] }]">
        <div class="vineta">
          <Ilustracion :nombre="e.ilustracion" :alt="e.lugar" />
        </div>
        <p class="hora">{{ e.hora }}</p>
        <h3 class="nombre-evento">{{ e.titulo }}</h3>
        <p class="lugar">{{ e.lugar }}</p>
        <a :href="e.mapa" target="_blank" rel="noopener noreferrer" class="como-llegar">
          Cómo llegar
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M7 17L17 7M9 7h8v8" />
          </svg>
        </a>
      </article>

      <div class="barco" :style="estiloBarco">
        <div class="inclina" :style="{ transform: `rotate(${inclinacion}deg)` }">
          <BarquitoNavegando :mirando="mirando" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { datos } from "@/datos";
import Ilustracion from "@/components/Ilustracion.vue";
import BarquitoNavegando from "@/components/BarquitoNavegando.vue";

/* río en porcentajes del mapa (x, y): baja zigzagueando de la iglesia a la fiesta */
const CAMINO = "M30 25 C 30 31, 78 30, 78 37 S 22 44, 22 51 S 80 57, 78 64 S 64 71, 70 76";

/* tamaño real del mapa; el camino se pasa a píxeles con él */
const tam = ref({ ancho: 100, alto: 100 });
const largoTrazo = ref(1);
const camino = computed(() => {
  let i = 0;
  // los números van de a pares (x, y): x se escala con el ancho y y con el alto
  return CAMINO.replace(/-?\d+(\.\d+)?/g, (n) => {
    const v = (Number(n) / 100) * (i++ % 2 === 0 ? tam.value.ancho : tam.value.alto);
    return v.toFixed(1);
  });
});

const eventos = [
  { ...datos.ceremonia, ilustracion: "iglesia" },
  { ...datos.recepcion, ilustracion: "jardin" },
];

const mapaRef = ref<HTMLElement | null>(null);
const trazoRef = ref<SVGPathElement | null>(null);
const avance = ref(0); // 0 → 1 a lo largo del río (suavizado)
const punto = ref({ x: 0, y: 0 });
const inclinacion = ref(0);
const mirando = ref<"derecha" | "izquierda">("derecha");

const llegadas = computed(() => [avance.value > 0.01, avance.value > 0.985]);
const estiloBarco = computed(() => ({
  transform: `translate3d(${punto.value.x}px, ${punto.value.y}px, 0)`,
}));

let objetivo = 0;
let actual = 0;
let animando = false;
let largo = 0;
let ultimoTiempo = 0;

/* cuánto tarda el barquito en alcanzar su sitio (segundos, aprox.): da la sensación de inercia */
const INERCIA = 0.45;

/* hacia dónde debería ir: el punto del río que está a la altura del 55% de la pantalla */
function calcularObjetivo() {
  const mapa = mapaRef.value;
  const trazo = trazoRef.value;
  if (!mapa || !trazo) return;
  largo = trazo.getTotalLength();
  const r = mapa.getBoundingClientRect();
  const yInicio = trazo.getPointAtLength(0).y;
  const yFin = trazo.getPointAtLength(largo).y;
  const yPantalla = window.innerHeight * 0.55 - r.top;
  objetivo = Math.min(1, Math.max(0, (yPantalla - yInicio) / (yFin - yInicio)));
  if (!animando) {
    animando = true;
    ultimoTiempo = performance.now();
    requestAnimationFrame(paso);
  }
}

/* inercia: recorre una parte de lo que le falta según el tiempo pasado (igual en cualquier celular) */
function paso(ahora = performance.now()) {
  const mapa = mapaRef.value;
  const trazo = trazoRef.value;
  if (!mapa || !trazo) return void (animando = false);
  const dt = Math.min(0.1, Math.max(0, (ahora - ultimoTiempo) / 1000));
  ultimoTiempo = ahora;
  const k = 1 - Math.exp(-dt / (INERCIA / 3));
  const falta = objetivo - actual;
  actual += falta * k;
  if (Math.abs(falta) < 0.0005) actual = objetivo;

  const a = trazo.getPointAtLength(actual * largo);
  const b = trazo.getPointAtLength(Math.min(largo, actual * largo + 4));
  punto.value = { x: a.x, y: a.y };

  // se voltea hacia donde navega y se inclina según la curva
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (Math.abs(dx) > 0.3) mirando.value = dx < 0 ? "izquierda" : "derecha";
  const pendiente = Math.max(-1, Math.min(1, dy / (Math.abs(dx) + 0.001)));
  const meta = (mirando.value === "derecha" ? 1 : -1) * pendiente * 14;
  inclinacion.value += (meta - inclinacion.value) * Math.min(1, k * 1.6);

  avance.value = actual;
  if (actual !== objetivo || Math.abs(meta - inclinacion.value) > 0.1) requestAnimationFrame(paso);
  else animando = false;
}

const movimientoReducido = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* mide el mapa, rehace el camino en píxeles y recoloca el barquito */
async function medir() {
  const mapa = mapaRef.value;
  if (!mapa) return;
  tam.value = { ancho: mapa.clientWidth, alto: mapa.clientHeight };
  await nextTick();
  const trazo = trazoRef.value;
  if (!trazo) return;
  largo = trazo.getTotalLength();
  largoTrazo.value = largo;
  if (movimientoReducido()) {
    // sin movimiento: el barquito ya llegó a la fiesta
    objetivo = actual = 1;
    paso();
    return;
  }
  calcularObjetivo();
}

let observador: ResizeObserver | undefined;
onMounted(() => {
  observador = new ResizeObserver(() => medir());
  if (mapaRef.value) observador.observe(mapaRef.value);
  medir();
  if (movimientoReducido()) return;
  window.addEventListener("scroll", calcularObjetivo, { passive: true });
});

onBeforeUnmount(() => {
  observador?.disconnect();
  window.removeEventListener("scroll", calcularObjetivo);
});
</script>

<style scoped>
.ruta {
  overflow: hidden;
}

.cabecera {
  margin-bottom: 26px;
}

/* MAPA: alto; la iglesia arriba a la izquierda y la fiesta abajo a la derecha */
.mapa {
  position: relative;
  height: 1180px;
  max-width: 420px;
  margin: 0 auto;
}

.camino {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.rio,
.riel,
.trazo {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.rio {
  stroke: #dff1f4;
  stroke-width: 30;
}

.riel {
  stroke: var(--menta);
  stroke-width: 3;
  stroke-dasharray: 2 11;
}

.trazo {
  stroke: var(--agua);
  stroke-width: 4;
  stroke-dasharray: 1;
}

/* símbolo en la orilla */
.orilla {
  position: absolute;
  pointer-events: none;
}

.o-paloma {
  top: 41%;
  right: 2%;
  width: 26%;
  animation: planear 6s ease-in-out infinite alternate;
}

@keyframes planear {
  to {
    transform: translate(-10px, -12px) rotate(-4deg);
  }
}

/* PARADAS */
.parada {
  position: absolute;
  z-index: 1;
  width: 64%;
  padding: 16px 14px 18px;
  border-radius: 28px;
  background: var(--blanco);
  box-shadow: var(--sombra-suave);
  text-align: center;
  transition: box-shadow 0.5s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.p1 {
  top: 0;
  left: 0;
}

.p2 {
  bottom: 0;
  right: 0;
}

/* al llegar el barquito, la parada se ilumina con un halo de agua */
.parada.llego {
  box-shadow:
    0 0 0 4px var(--menta),
    0 0 0 10px rgba(191, 227, 208, 0.4),
    var(--sombra-suave);
  transform: scale(1.03);
}

.vineta {
  width: 120px;
  margin: 0 auto 4px;
}

.hora {
  display: inline-block;
  margin: 0;
  padding: 2px 12px;
  border-radius: 999px;
  background: var(--menta-claro);
  font-family: var(--fuente-titulo);
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--verde);
}

.nombre-evento {
  margin: 6px 0 2px;
  font-family: var(--fuente-titulo);
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 1.15;
  color: var(--verde);
}

.lugar {
  margin: 0 0 10px;
  font-size: 0.95rem;
  line-height: 1.4;
  color: var(--texto-suave);
}

.como-llegar {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  border-radius: 999px;
  background: var(--menta-claro);
  color: var(--verde);
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
}

.como-llegar:hover {
  background: var(--menta);
}

.como-llegar svg {
  width: 14px;
  height: 14px;
}

/* BARQUITO: su posición la calcula el script; aquí solo se centra sobre el punto */
.barco {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 0;
  height: 0;
  pointer-events: none;
  will-change: transform;
}

.inclina {
  position: absolute;
  left: -46px;
  top: -64px;
  width: 92px;
  transform-origin: 50% 80%;
}

@media (max-width: 360px) {
  .parada {
    width: 70%;
  }
}
</style>
