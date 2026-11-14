<template>
  <!--
    VERSÍCULO: la paloma baja volando mientras la frase se escribe palabra por
    palabra al bajar (las palabras se iluminan según el recorrido).
  -->
  <section ref="seccionRef" class="seccion versiculo manchas" v-paralaje>
    <div class="paloma" aria-hidden="true">
      <div class="aletea"><Ilustracion nombre="paloma" /></div>
    </div>

    <p class="cita" :aria-label="texto">
      <span
        v-for="(p, i) in palabras"
        :key="i"
        class="palabra"
        :class="{ encendida: i < encendidas }"
        aria-hidden="true"
      >{{ p }}</span>
    </p>
    <p class="referencia">Isaías 43, 1</p>
    <AdornoCruz />
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import Ilustracion from "@/components/Ilustracion.vue";
import AdornoCruz from "@/components/AdornoCruz.vue";

const texto = "«Te he llamado por tu nombre; tú eres mío»";
const palabras = texto.split(" ");

const seccionRef = ref<HTMLElement | null>(null);
const encendidas = ref(0);
let pendiente = false;

/* se encienden mientras la sección pasa de la parte baja al centro de la pantalla */
function calcular() {
  pendiente = false;
  const el = seccionRef.value;
  if (!el) return;
  const r = el.getBoundingClientRect();
  const progreso = (window.innerHeight * 0.85 - r.top) / (r.height * 0.7);
  encendidas.value = Math.round(Math.min(1, Math.max(0, progreso)) * palabras.length);
}

function programar() {
  if (!pendiente) {
    pendiente = true;
    requestAnimationFrame(calcular);
  }
}

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    encendidas.value = palabras.length;
    return;
  }
  window.addEventListener("scroll", programar, { passive: true });
  calcular();
});

onBeforeUnmount(() => window.removeEventListener("scroll", programar));
</script>

<style scoped>
.versiculo {
  --manchas: radial-gradient(ellipse 75% 34% at 50% 45%, rgba(244, 238, 225, 0.95), transparent 70%);
}

/* la paloma baja un poco más lenta que la página (paralaje) y aletea */
.paloma {
  width: 150px;
  margin: 0 auto 6px;
  transform: translateY(calc(var(--c, 0) * 60px)) rotate(calc(var(--c, 0) * -8deg));
}

.aletea {
  animation: planear 3.5s ease-in-out infinite alternate;
}

@keyframes planear {
  to {
    transform: translateY(-10px) rotate(3deg);
  }
}

.cita {
  max-width: 330px;
  margin: 0 auto;
  font-family: var(--fuente-texto);
  font-size: clamp(1.45rem, 6.4vw, 1.8rem);
  font-style: italic;
  font-weight: 500;
  line-height: 1.35;
}

.palabra {
  display: inline-block;
  margin-right: 0.24em;
  color: #dcd8c9;
  transition: color 0.5s ease;
}

.palabra.encendida {
  color: var(--verde);
}

.referencia {
  margin: 12px 0 18px;
  font-family: var(--fuente-texto);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: var(--oro);
}
</style>
