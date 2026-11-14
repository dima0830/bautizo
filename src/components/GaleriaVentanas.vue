<template>
  <!--
    GALERÍA "VENTANITAS DEL BARCO": la sección se queda fija y, al bajar, las
    fotos pasan de lado dentro de ventanas redondas de barco. Al tocar una,
    se ve completa. Solo aparece si hay fotos (santiago1.webp, …).
  -->
  <section v-if="fotos.length" id="galeria" ref="pistaRef" class="galeria" :style="{ '--n': fotos.length }">
    <div class="escena">
      <div v-flotar class="cabecera">
        <p class="antetitulo">Mis primeros días</p>
        <h2 class="titulo">Un año de amor</h2>
      </div>

      <div class="ventana-pista">
        <div ref="filaRef" class="fila">
          <button
            v-for="(foto, i) in fotos"
            :key="foto"
            type="button"
            class="ventanita"
            :style="{ '--i': i }"
            :aria-label="`Ver foto ${i + 1} de ${fotos.length}`"
            @click="abierta = i"
          >
            <img :src="foto" :alt="`Foto ${i + 1} de ${datos.nombre}`" loading="lazy" decoding="async" />
          </button>
        </div>
      </div>

      <p class="ayuda">Toca una ventanita para ver la foto</p>
    </div>

    <!-- foto en grande -->
    <Transition name="grande">
      <div v-if="abierta !== null" class="visor" role="dialog" aria-modal="true" :aria-label="`Foto ${abierta + 1} de ${datos.nombre}`" @click.self="abierta = null">
        <img :src="fotos[abierta]" :alt="`Foto ${abierta + 1} de ${datos.nombre}`" />
        <button type="button" class="cerrar" aria-label="Cerrar foto" @click="abierta = null">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { datos } from "@/datos";
import { fotosGaleria } from "@/imagenes";
import { usarProgresoPista } from "@/progresoPista";

const fotos = fotosGaleria;
const pistaRef = ref<HTMLElement | null>(null);
const filaRef = ref<HTMLElement | null>(null);
const abierta = ref<number | null>(null);

/* la fila se desliza hacia la izquierda lo que sobra de ancho */
let ultimoP = 0;
function mover(p: number) {
  ultimoP = p;
  const fila = filaRef.value;
  if (!fila) return;
  const sobra = Math.max(0, fila.scrollWidth - (fila.parentElement?.clientWidth ?? 0));
  fila.style.transform = `translate3d(${-p * sobra}px, 0, 0)`;
}
usarProgresoPista(pistaRef, mover);

function alTeclado(e: KeyboardEvent) {
  if (e.key === "Escape") abierta.value = null;
}
const alRedimensionar = () => mover(ultimoP);
onMounted(() => {
  window.addEventListener("keydown", alTeclado);
  window.addEventListener("resize", alRedimensionar);
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", alTeclado);
  window.removeEventListener("resize", alRedimensionar);
});
</script>

<style scoped>
/* PISTA: 100svh de escena + 45svh de recorrido por foto */
.galeria {
  position: relative;
  height: calc(100vh + var(--n) * 45vh);
  height: calc(100svh + var(--n) * 45svh);
  background: linear-gradient(180deg, var(--blanco), var(--cielo) 50%, var(--menta-claro));
}

.escena {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  height: 100svh;
  overflow: hidden;
  padding: 40px 0;
  text-align: center;
}

.cabecera {
  padding: 0 24px;
  margin-bottom: 26px;
}

.ventana-pista {
  overflow: hidden;
  padding: 16px 0 24px;
}

.fila {
  display: flex;
  gap: 26px;
  width: max-content;
  padding: 0 calc(50% - 115px);
  padding: 0 max(24px, calc(50vw - 115px));
  will-change: transform;
}

@media (min-width: 560px) {
  .fila {
    padding: 0 125px;
  }
}

/* VENTANITA redonda de barco: aro de agua con tornillos */
.ventanita {
  position: relative;
  flex: none;
  width: 230px;
  height: 230px;
  padding: 12px;
  border: 0;
  border-radius: 50%;
  background:
    radial-gradient(circle, transparent 62%, rgba(255, 255, 255, 0.35) 63% 66%, transparent 67%),
    conic-gradient(from 20deg, var(--agua), var(--menta), var(--agua-oscuro), var(--agua));
  box-shadow:
    0 18px 30px -18px rgba(34, 80, 63, 0.7),
    inset 0 0 0 2px rgba(255, 255, 255, 0.5);
  cursor: pointer;
  animation: mecer-ventana 4s ease-in-out infinite alternate;
  animation-delay: calc(var(--i) * -1.3s);
  -webkit-tap-highlight-color: transparent;
}

/* tornillitos del aro */
.ventanita::after {
  content: "";
  position: absolute;
  inset: 3px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 50% 2.5%, #fff 0 2.5%, transparent 3%),
    radial-gradient(circle at 50% 97.5%, #fff 0 2.5%, transparent 3%),
    radial-gradient(circle at 2.5% 50%, #fff 0 2.5%, transparent 3%),
    radial-gradient(circle at 97.5% 50%, #fff 0 2.5%, transparent 3%);
  opacity: 0.85;
  pointer-events: none;
}

@keyframes mecer-ventana {
  from {
    transform: rotate(-2deg) translateY(0);
  }
  to {
    transform: rotate(2deg) translateY(-6px);
  }
}

.ventanita img {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.2);
}

.ayuda {
  margin: 4px 0 0;
  font-family: var(--fuente-mano);
  font-size: 1.3rem;
  color: var(--agua-oscuro);
}

/* VISOR */
.visor {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(34, 80, 63, 0.82);
}

.visor img {
  max-width: 100%;
  max-height: 86vh;
  border-radius: 22px;
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.5);
}

.cerrar {
  position: absolute;
  top: 16px;
  right: 16px;
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border: 0;
  border-radius: 50%;
  background: var(--blanco);
  color: var(--verde);
  cursor: pointer;
}

.cerrar svg {
  width: 22px;
  height: 22px;
}

.grande-enter-active,
.grande-leave-active {
  transition: opacity 0.3s ease;
}

.grande-enter-from,
.grande-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .galeria {
    height: auto;
  }
  .escena {
    position: relative;
    height: auto;
  }
  .ventana-pista {
    overflow-x: auto;
  }
}
</style>
