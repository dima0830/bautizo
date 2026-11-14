<template>
  <!--
    LA RUTA DEL BARQUITO: un camino punteado une la ceremonia y la
    celebración. Al bajar, el trazo se pinta y el barquito lo recorre;
    cada parada se ilumina cuando el barquito llega.
  -->
  <section id="ruta" class="seccion ruta">
    <div v-flotar class="cabecera">
      <p class="antetitulo">Mi gran día</p>
      <h2 class="titulo">La ruta del barquito</h2>
      <p class="subtitulo">De la iglesia a la fiesta, navegamos juntos</p>
    </div>

    <div ref="mapaRef" class="mapa">
      <svg class="camino" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path :d="CAMINO" class="riel" vector-effect="non-scaling-stroke" />
        <path ref="trazoRef" :d="CAMINO" class="trazo" pathLength="1" vector-effect="non-scaling-stroke" :style="{ strokeDashoffset: 1 - progreso }" />
      </svg>

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

      <div class="barquito" :style="estiloBarco" aria-hidden="true">
        <div class="mece"><Ilustracion nombre="barquito" /></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { datos } from "@/datos";
import Ilustracion from "@/components/Ilustracion.vue";

/* camino en un lienzo de 100×100 (se estira al tamaño del mapa) */
const CAMINO = "M30 37 C 30 52, 50 44, 52 52 S 70 55, 70 64";

const eventos = [
  { ...datos.ceremonia, ilustracion: "iglesia" },
  { ...datos.recepcion, ilustracion: "jardin" },
];

const mapaRef = ref<HTMLElement | null>(null);
const trazoRef = ref<SVGPathElement | null>(null);
const progreso = ref(0);
const punto = ref({ x: 0, y: 0, giro: 0 });

const llegadas = computed(() => [progreso.value > 0.02, progreso.value > 0.97]);
const estiloBarco = computed(() => ({
  transform: `translate(${punto.value.x}px, ${punto.value.y}px) translate(-50%, -78%) rotate(${punto.value.giro}deg)`,
}));

let pendiente = false;
function calcular() {
  pendiente = false;
  const mapa = mapaRef.value;
  const trazo = trazoRef.value;
  if (!mapa || !trazo) return;
  const r = mapa.getBoundingClientRect();
  const alto = window.innerHeight;
  // empieza cuando el mapa asoma por la mitad baja y termina al pasar el centro
  const p = Math.min(1, Math.max(0, (alto * 0.7 - (r.top + r.height * 0.3)) / (r.height * 0.45)));
  progreso.value = p;

  const largo = trazo.getTotalLength();
  const a = trazo.getPointAtLength(p * largo);
  const b = trazo.getPointAtLength(Math.min(largo, p * largo + 1));
  const x = (a.x / 100) * r.width;
  const y = (a.y / 100) * r.height;
  const dx = ((b.x - a.x) / 100) * r.width;
  const dy = ((b.y - a.y) / 100) * r.height;
  const giro = Math.max(-18, Math.min(18, (Math.atan2(dy, dx) * 180) / Math.PI - 45));
  punto.value = { x, y, giro: dx === 0 && dy === 0 ? 0 : giro * 0.4 };
}

function programar() {
  if (!pendiente) {
    pendiente = true;
    requestAnimationFrame(calcular);
  }
}

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    progreso.value = 1;
    requestAnimationFrame(() => {
      calcular();
      progreso.value = 1;
    });
    return;
  }
  window.addEventListener("scroll", programar, { passive: true });
  window.addEventListener("resize", programar);
  calcular();
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", programar);
  window.removeEventListener("resize", programar);
});
</script>

<style scoped>
.ruta {
  overflow: hidden;
}

.cabecera {
  margin-bottom: 30px;
}

/* MAPA: alto fijo; la primera parada arriba a la izquierda, la segunda abajo a la derecha */
.mapa {
  position: relative;
  height: 780px;
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

.riel,
.trazo {
  fill: none;
  stroke-linecap: round;
}

.riel {
  stroke: var(--menta);
  stroke-width: 4;
  stroke-dasharray: 2 12;
}

.trazo {
  stroke: var(--agua);
  stroke-width: 4;
  stroke-dasharray: 1;
}

/* PARADAS */
.parada {
  position: absolute;
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

/* BARQUITO que recorre el camino (su posición la calcula el script) */
.barquito {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 74px;
  pointer-events: none;
  will-change: transform;
}

.barquito .mece {
  animation: mecer 2.6s ease-in-out infinite alternate;
  transform-origin: 50% 90%;
}

@keyframes mecer {
  from {
    transform: rotate(-6deg);
  }
  to {
    transform: rotate(6deg);
  }
}

@media (max-width: 360px) {
  .parada {
    width: 70%;
  }
}
</style>
