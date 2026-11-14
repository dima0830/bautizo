<template>
  <!--
    GALERÍA "VENTANITAS": mientras la sección pasa por la pantalla, las
    fotos se deslizan de lado dentro de ventanas redondas. Al tocar una, se
    ve completa. Solo aparece si hay fotos (santiago1.webp, …).
  -->
  <section v-if="fotos.length" id="galeria" ref="seccionRef" class="seccion galeria manchas">
    <div class="escena">
      <div v-flotar class="cabecera">
        <p class="antetitulo">Un regalo de Dios</p>
        <h2 class="titulo">Mis momentos de luz</h2>
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

    <!-- foto en grande: va directo en <body> para quedar encima de toda la tarjeta -->
    <Teleport to="body">
    <Transition name="grande">
      <div v-if="abierta !== null" class="visor" role="dialog" aria-modal="true" :aria-label="`Fotos de ${datos.nombre}`">
        <!-- carrusel: todas las fotos en fila; se pasa deslizando, con las flechas o el teclado -->
        <div ref="carruselRef" class="carrusel" @scroll.passive="alDeslizar">
          <figure v-for="(foto, i) in fotos" :key="foto" class="diapositiva" @click.self="abierta = null">
            <img :src="foto" :alt="`Foto ${i + 1} de ${datos.nombre}`" :loading="Math.abs(i - abierta) <= 1 ? 'eager' : 'lazy'" />
          </figure>
        </div>

        <button type="button" class="flecha anterior" aria-label="Foto anterior" :disabled="abierta === 0" @click="ir(abierta - 1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <button type="button" class="flecha siguiente" aria-label="Foto siguiente" :disabled="abierta === fotos.length - 1" @click="ir(abierta + 1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        </button>

        <div class="pie-visor">
          <p class="contador" aria-live="polite">{{ abierta + 1 }} / {{ fotos.length }}</p>
          <div class="puntos">
            <button
              v-for="(_, i) in fotos"
              :key="i"
              type="button"
              class="punto"
              :class="{ activo: i === abierta }"
              :aria-label="`Ver foto ${i + 1}`"
              :aria-current="i === abierta ? 'true' : undefined"
              @click="ir(i)"
            ></button>
          </div>
        </div>

        <button type="button" class="cerrar" aria-label="Cerrar fotos" @click="abierta = null">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>
    </Transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { datos } from "@/datos";
import { fotosGaleria } from "@/imagenes";
const fotos = fotosGaleria;
const seccionRef = ref<HTMLElement | null>(null);
const filaRef = ref<HTMLElement | null>(null);
const abierta = ref<number | null>(null);

const carruselRef = ref<HTMLElement | null>(null);

/* mientras la foto está abierta, la página de atrás no se mueve; al abrir, el carrusel empieza en la foto tocada */
watch(abierta, async (v, antes) => {
  document.body.style.overflow = v === null ? "" : "hidden";
  if (v !== null && antes === null) {
    await nextTick();
    const c = carruselRef.value;
    if (c) c.scrollLeft = v * c.clientWidth;
  }
});

/* ir a una foto del carrusel (con desplazamiento suave) */
function ir(i: number) {
  const c = carruselRef.value;
  if (!c || i < 0 || i >= fotos.length) return;
  c.scrollTo({ left: i * c.clientWidth, behavior: "smooth" });
}

/* al deslizar con el dedo, la foto que queda al centro pasa a ser la actual */
let deslizando = false;
function alDeslizar() {
  if (deslizando) return;
  deslizando = true;
  requestAnimationFrame(() => {
    deslizando = false;
    const c = carruselRef.value;
    if (!c || abierta.value === null) return;
    const i = Math.round(c.scrollLeft / c.clientWidth);
    if (i !== abierta.value && i >= 0 && i < fotos.length) abierta.value = i;
  });
}

/*
  La fila se desliza hacia la izquierda lo que sobra de ancho según cuánto ha
  pasado la sección por la pantalla: empieza con la primera foto al centro
  cuando la sección asoma abajo y termina con la última al centro cuando se
  va por arriba.
*/
let pendiente = false;
function mover() {
  pendiente = false;
  const seccion = seccionRef.value;
  const fila = filaRef.value;
  if (!seccion || !fila) return;
  const r = seccion.getBoundingClientRect();
  const alto = window.innerHeight;
  const recorrido = (alto * 0.85 - r.top) / (r.height + alto * 0.5);
  const p = Math.min(1, Math.max(0, recorrido));
  const sobra = Math.max(0, fila.scrollWidth - (fila.parentElement?.clientWidth ?? 0));
  fila.style.transform = `translate3d(${(-p * sobra).toFixed(1)}px, 0, 0)`;
}

function programar() {
  if (!pendiente) {
    pendiente = true;
    requestAnimationFrame(mover);
  }
}

function alTeclado(e: KeyboardEvent) {
  if (abierta.value === null) return;
  if (e.key === "Escape") abierta.value = null;
  else if (e.key === "ArrowRight") ir(abierta.value + 1);
  else if (e.key === "ArrowLeft") ir(abierta.value - 1);
}

onMounted(() => {
  window.addEventListener("keydown", alTeclado);
  window.addEventListener("resize", programar);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  window.addEventListener("scroll", programar, { passive: true });
  mover();
});
onBeforeUnmount(() => {
  document.body.style.overflow = "";
  window.removeEventListener("keydown", alTeclado);
  window.removeEventListener("resize", programar);
  window.removeEventListener("scroll", programar);
});
</script>

<style scoped>
/* sin fijar: la sección mide lo que su contenido (sin el padding lateral, la fila usa todo el ancho) */
.galeria {
  --manchas:
    radial-gradient(ellipse 80% 30% at 30% 48%, rgba(244, 238, 225, 0.9), transparent 70%),
    radial-gradient(ellipse 60% 26% at 82% 58%, rgba(214, 223, 199, 0.45), transparent 70%);
  padding-left: 0;
  padding-right: 0;
}

.escena {
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
  padding: 0 calc(50% - 130px);
  padding: 0 max(24px, calc(50vw - 130px));
  will-change: transform;
}

@media (min-width: 560px) {
  .fila {
    padding: 0 110px;
  }
}

/* VENTANITA redonda de barco: aro de agua con tornillos */
.ventanita {
  position: relative;
  flex: none;
  width: 260px;
  height: 260px;
  padding: 12px;
  border: 0;
  border-radius: 50%;
  background:
    radial-gradient(circle, transparent 62%, rgba(255, 255, 255, 0.35) 63% 66%, transparent 67%),
    conic-gradient(from 20deg, var(--agua), var(--menta), var(--agua-oscuro), var(--agua));
  box-shadow:
    0 18px 30px -18px rgba(64, 74, 52, 0.7),
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
  /* en fotos verticales la cara suele estar arriba: el círculo toma esa parte */
  object-position: 50% 22%;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.2);
}

.ayuda {
  margin: 4px 0 0;
  font-family: var(--fuente-texto);
  font-size: 0.9rem;
  font-style: italic;
  color: var(--texto-suave);
}

/* VISOR */
.visor {
  position: fixed;
  inset: 0;
  z-index: 90;
  /* casi opaco y difuminado: no se distingue la tarjeta de atrás */
  background: rgba(46, 54, 38, 0.94);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* CARRUSEL: fila de diapositivas a pantalla completa que encajan al deslizar */
.carrusel {
  display: flex;
  width: 100%;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  overscroll-behavior: contain;
  scrollbar-width: none;
}

.carrusel::-webkit-scrollbar {
  display: none;
}

.diapositiva {
  display: grid;
  place-items: center;
  flex: 0 0 100%;
  height: 100%;
  margin: 0;
  padding: 72px 16px 96px;
  scroll-snap-align: center;
  scroll-snap-stop: always;
}

.diapositiva img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 22px;
  object-fit: contain;
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.5);
}

/* flechas a los lados (en celular también se puede deslizar con el dedo) */
.flecha {
  position: absolute;
  top: 50%;
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  margin-top: -23px;
  border: 1px solid rgba(230, 211, 163, 0.6);
  border-radius: 50%;
  background: rgba(252, 250, 245, 0.92);
  color: var(--verde);
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.flecha svg {
  width: 22px;
  height: 22px;
}

.flecha:disabled {
  opacity: 0.25;
  cursor: default;
}

.anterior {
  left: 12px;
}

.siguiente {
  right: 12px;
}

/* contador y puntitos abajo */
.pie-visor {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 22px;
  text-align: center;
  pointer-events: none;
}

.contador {
  margin: 0 0 10px;
  font-family: var(--fuente-titulo);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 3px;
  color: var(--oro-claro);
}

.puntos {
  display: flex;
  justify-content: center;
  gap: 8px;
  pointer-events: auto;
}

.punto {
  width: 9px;
  height: 9px;
  padding: 0;
  border: 1px solid var(--oro-claro);
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  transition: background-color 0.2s ease, width 0.25s ease;
}

.punto.activo {
  width: 22px;
  border-radius: 999px;
  background: var(--oro-claro);
}

.cerrar {
  position: absolute;
  z-index: 1;
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
  .ventana-pista {
    overflow-x: auto;
  }
}
</style>
