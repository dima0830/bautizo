<template>
  <!-- FECHA: el día grande pintado, la cuenta regresiva en burbujas y agendar -->
  <section id="fecha" class="seccion fecha">
    <svg class="mancha m1" viewBox="0 0 200 200" aria-hidden="true">
      <ellipse cx="100" cy="100" rx="90" ry="70" fill="#bfe3d0" opacity=".55" filter="url(#acuarela-suave)" />
    </svg>
    <svg class="mancha m2" viewBox="0 0 200 200" aria-hidden="true">
      <ellipse cx="100" cy="100" rx="80" ry="80" fill="#f3e3c3" opacity=".5" filter="url(#acuarela-suave)" />
    </svg>

    <div v-flotar class="contenido">
      <AdornoCruz />
      <p class="antetitulo">Acompáñame el</p>
      <p class="dia-semana">{{ fechaPartes.diaSemana }}</p>
      <div class="dia" v-paralaje>
        <span class="numero">{{ fechaPartes.dia }}</span>
      </div>
      <p class="mes">{{ fechaPartes.mes }} {{ fechaPartes.anio }}</p>

      <div class="cuenta" role="timer" :aria-label="`Faltan ${partes[0].valor} días`">
        <div v-for="(parte, i) in partes" :key="parte.etiqueta" class="burbuja" :style="{ '--i': i }" aria-hidden="true">
          <span class="valor">{{ parte.valor }}</span>
          <span class="etiqueta">{{ parte.etiqueta }}</span>
        </div>
      </div>

      <a :href="calendario" target="_blank" rel="noopener noreferrer" class="boton boton-claro agendar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3.5" y="5" width="17" height="15" rx="3" />
          <path d="M3.5 10h17M8 3v4M16 3v4M12 13v4M10 15h4" />
        </svg>
        Agendar en mi calendario
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { datos, fechaPartes } from "@/datos";
import AdornoCruz from "@/components/AdornoCruz.vue";

const objetivo = new Date(datos.fecha).getTime();
const ahora = ref(Date.now());
let reloj: ReturnType<typeof setInterval> | undefined;
onMounted(() => (reloj = setInterval(() => (ahora.value = Date.now()), 1000)));
onBeforeUnmount(() => clearInterval(reloj));

const partes = computed(() => {
  const resta = Math.max(0, objetivo - ahora.value);
  const s = Math.floor(resta / 1000);
  const dos = (n: number) => String(n).padStart(2, "0");
  return [
    { valor: String(Math.floor(s / 86400)), etiqueta: "días" },
    { valor: dos(Math.floor((s % 86400) / 3600)), etiqueta: "horas" },
    { valor: dos(Math.floor((s % 3600) / 60)), etiqueta: "min" },
    { valor: dos(s % 60), etiqueta: "seg" },
  ];
});

/* Google Calendar: la ceremonia, 2 horas */
const inicio = new Date(datos.fecha);
const fin = new Date(inicio.getTime() + 2 * 3600 * 1000);
const formato = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const calendario =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  `&text=${encodeURIComponent(`Bautizo de ${datos.nombre}`)}` +
  `&dates=${formato(inicio)}/${formato(fin)}` +
  `&location=${encodeURIComponent(datos.ceremonia.lugar)}`;
</script>

<style scoped>
.fecha {
  overflow: hidden;
  background: linear-gradient(180deg, var(--menta-claro) 0%, var(--blanco) 40%);
}

.mancha {
  position: absolute;
  pointer-events: none;
}

.m1 {
  top: 40px;
  left: -60px;
  width: 260px;
}

.m2 {
  right: -70px;
  bottom: 40px;
  width: 240px;
}

.contenido {
  position: relative;
}

.dia-semana {
  margin: 0;
  font-family: var(--fuente-titulo);
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--texto-suave);
}

/* el número grande, con una mancha de agua detrás que va un poco más lenta */
.dia {
  position: relative;
  display: grid;
  place-items: center;
  width: 200px;
  height: 180px;
  margin: 0 auto;
}

.dia::before {
  content: "";
  position: absolute;
  inset: 10px 18px;
  border-radius: 46% 54% 50% 50% / 55% 45% 55% 45%;
  background: radial-gradient(circle at 35% 30%, #e3f3ea, var(--menta) 60%, var(--agua) 100%);
  opacity: 0.7;
  transform: translateY(calc(var(--c, 0) * -40px)) rotate(-6deg);
}

.numero {
  position: relative;
  display: block;
  font-family: var(--fuente-titulo);
  font-size: 7.5rem;
  font-weight: 600;
  line-height: 1;
  color: var(--verde);
  transform: translateY(calc(var(--c, 0) * 16px));
}

.mes {
  margin: 0;
  font-family: var(--fuente-titulo);
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--verde);
  text-transform: capitalize;
}

/* CUENTA REGRESIVA en burbujas que flotan a distinto ritmo */
.cuenta {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 34px 0 30px;
}

.burbuja {
  display: grid;
  place-content: center;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.95) 0 10%, transparent 11%),
    radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.55), rgba(191, 227, 208, 0.75) 70%, rgba(124, 194, 176, 0.85));
  box-shadow:
    inset 0 -6px 12px rgba(79, 158, 139, 0.25),
    0 10px 18px -12px rgba(34, 80, 63, 0.5);
  animation: burbujear 3.6s ease-in-out infinite alternate;
  animation-delay: calc(var(--i) * -0.9s);
}

@keyframes burbujear {
  to {
    transform: translateY(-8px);
  }
}

.valor {
  font-family: var(--fuente-titulo);
  font-size: 1.55rem;
  font-weight: 600;
  line-height: 1;
  color: var(--verde);
}

.etiqueta {
  margin-top: 2px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--texto-suave);
}

@media (max-width: 360px) {
  .burbuja {
    width: 62px;
    height: 62px;
  }
  .valor {
    font-size: 1.35rem;
  }
}
</style>
