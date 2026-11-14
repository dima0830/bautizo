<template>
  <!--
    COMPARTE TUS FOTOS: un medallón festoneado para elegir fotos y videos;
    las elegidas aparecen en burbujas que se pueden quitar. Al enviar,
    las burbujas suben flotando y aparece el agradecimiento.
  -->
  <section id="compartir" class="seccion compartir manchas">
    <div v-flotar class="contenido">
      <p class="antetitulo">Guarda conmigo este día</p>
      <h2 class="titulo">Comparte tus fotos</h2>
      <p class="subtitulo">Sube las fotos y videos que tomes en mi bautizo</p>

      <input
        ref="entradaRef"
        type="file"
        accept="image/*,video/*"
        multiple
        class="solo-lector"
        tabindex="-1"
        aria-hidden="true"
        @change="alElegir"
      />

      <!-- medallón festoneado (como un sticker de papel con borde dorado): toca para elegir -->
      <button v-if="!enviado" type="button" class="medallon" :disabled="enviando" @click="elegir">
        <svg class="medallon-fondo" viewBox="-6 -6 212 212" aria-hidden="true">
          <path class="borde-oro" d="M100.0 16.0 Q116.0 -0.7 126.0 20.1 Q146.3 9.1 149.4 32.0 Q172.1 27.9 168.0 50.6 Q190.9 53.7 179.9 74.0 Q200.7 84.0 184.0 100.0 Q200.7 116.0 179.9 126.0 Q190.9 146.3 168.0 149.4 Q172.1 172.1 149.4 168.0 Q146.3 190.9 126.0 179.9 Q116.0 200.7 100.0 184.0 Q84.0 200.7 74.0 179.9 Q53.7 190.9 50.6 168.0 Q27.9 172.1 32.0 149.4 Q9.1 146.3 20.1 126.0 Q-0.7 116.0 16.0 100.0 Q-0.7 84.0 20.1 74.0 Q9.1 53.7 32.0 50.6 Q27.9 27.9 50.6 32.0 Q53.7 9.1 74.0 20.1 Q84.0 -0.7 100.0 16.0Z" />
          <path class="borde-papel" d="M100.0 16.0 Q116.0 -0.7 126.0 20.1 Q146.3 9.1 149.4 32.0 Q172.1 27.9 168.0 50.6 Q190.9 53.7 179.9 74.0 Q200.7 84.0 184.0 100.0 Q200.7 116.0 179.9 126.0 Q190.9 146.3 168.0 149.4 Q172.1 172.1 149.4 168.0 Q146.3 190.9 126.0 179.9 Q116.0 200.7 100.0 184.0 Q84.0 200.7 74.0 179.9 Q53.7 190.9 50.6 168.0 Q27.9 172.1 32.0 149.4 Q9.1 146.3 20.1 126.0 Q-0.7 116.0 16.0 100.0 Q-0.7 84.0 20.1 74.0 Q9.1 53.7 32.0 50.6 Q27.9 27.9 50.6 32.0 Q53.7 9.1 74.0 20.1 Q84.0 -0.7 100.0 16.0Z" />
          <circle class="aro" cx="100" cy="100" r="66" />
          <circle class="puntada" cx="100" cy="100" r="58" />
          <g class="laurel">
            <path d="M58 132c-10-14-12-32-4-48M142 132c10-14 12-32 4-48" fill="none" />
            <ellipse cx="52" cy="118" rx="7" ry="3.2" transform="rotate(-70 52 118)" />
            <ellipse cx="50" cy="104" rx="7" ry="3.2" transform="rotate(-90 50 104)" />
            <ellipse cx="53" cy="90" rx="6.5" ry="3" transform="rotate(-115 53 90)" />
            <ellipse cx="60" cy="126" rx="6" ry="2.8" transform="rotate(-30 60 126)" />
            <ellipse cx="148" cy="118" rx="7" ry="3.2" transform="rotate(70 148 118)" />
            <ellipse cx="150" cy="104" rx="7" ry="3.2" transform="rotate(90 150 104)" />
            <ellipse cx="147" cy="90" rx="6.5" ry="3" transform="rotate(115 147 90)" />
            <ellipse cx="140" cy="126" rx="6" ry="2.8" transform="rotate(30 140 126)" />
          </g>
          <path class="corazon" d="M100 150c-5-3.4-7.6-5.8-7.6-8.2a3.8 3.8 0 0 1 7.6-.8 3.8 3.8 0 0 1 7.6.8c0 2.4-2.6 4.8-7.6 8.2z" />
        </svg>
        <svg class="camara" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M8 16h7l3-5h12l3 5h7a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V18a2 2 0 0 1 2-2z" />
          <circle cx="24" cy="26" r="7" />
        </svg>
        <span class="medallon-texto">{{ elegidas.length ? "Añadir más" : "Elegir fotos" }}</span>
      </button>

      <!-- burbujas con lo elegido -->
      <TransitionGroup v-if="elegidas.length" tag="ul" name="burbuja" class="burbujas" :class="{ subiendo: enviando }">
        <li v-for="(a, i) in elegidas" :key="a.url" class="burbuja" :style="{ '--i': i }">
          <video v-if="a.video" :src="a.url" muted playsinline preload="metadata" aria-hidden="true"></video>
          <img v-else :src="a.url" :alt="`Foto elegida ${i + 1}`" />
          <button v-if="!enviando" type="button" class="quitar" :aria-label="`Quitar ${a.nombre}`" @click="quitar(i)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M7 7l10 10M17 7 7 17" /></svg>
          </button>
        </li>
      </TransitionGroup>

      <button v-if="elegidas.length && !enviado" type="button" class="boton enviar" :disabled="enviando" @click="enviar">
        {{ enviando ? "Enviando…" : `Compartir ${elegidas.length} ${elegidas.length === 1 ? "archivo" : "archivos"}` }}
      </button>

      <p v-if="enviado" class="gracias" role="status">
        ¡Gracias por compartir estos recuerdos conmigo!
        <button type="button" class="otra-vez" @click="reiniciar">Compartir más</button>
      </p>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { enviarArchivos } from "@/envio";

type Archivo = { archivo: File; url: string; nombre: string; video: boolean };

const entradaRef = ref<HTMLInputElement | null>(null);
const elegidas = ref<Archivo[]>([]);
const enviando = ref(false);
const enviado = ref(false);
const error = ref("");

function elegir() {
  entradaRef.value?.click();
}

function alElegir(e: Event) {
  const entrada = e.target as HTMLInputElement;
  for (const archivo of Array.from(entrada.files ?? [])) {
    const video = archivo.type.startsWith("video/");
    if (!video && !archivo.type.startsWith("image/")) continue;
    elegidas.value.push({ archivo, url: URL.createObjectURL(archivo), nombre: archivo.name, video });
  }
  entrada.value = "";
  error.value = "";
}

function quitar(i: number) {
  URL.revokeObjectURL(elegidas.value[i].url);
  elegidas.value.splice(i, 1);
}

function limpiar() {
  elegidas.value.forEach((a) => URL.revokeObjectURL(a.url));
  elegidas.value = [];
}

async function enviar() {
  if (!elegidas.value.length) return;
  enviando.value = true;
  error.value = "";
  try {
    const formulario = new FormData();
    elegidas.value.forEach((a) => formulario.append("fotos", a.archivo));
    await enviarArchivos("/api/fotos", formulario);
    // deja ver un momento cómo suben las burbujas
    await new Promise((listo) => setTimeout(listo, 700));
    limpiar();
    enviado.value = true;
  } catch {
    error.value = "No pudimos subir tus fotos. Inténtalo de nuevo.";
  } finally {
    enviando.value = false;
  }
}

function reiniciar() {
  enviado.value = false;
  elegir();
}

onBeforeUnmount(limpiar);
</script>

<style scoped>
.compartir {
  --manchas:
    radial-gradient(ellipse 60% 28% at 14% 36%, rgba(214, 223, 199, 0.5), transparent 70%),
    radial-gradient(ellipse 55% 26% at 90% 68%, rgba(230, 211, 163, 0.45), transparent 70%);
}

.contenido {
  max-width: 340px;
  margin: 0 auto;
}

.subtitulo {
  margin-bottom: 26px;
}

/* MEDALLÓN festoneado: papel crema con borde dorado, puntada y laurel */
.medallon {
  position: relative;
  display: grid;
  place-items: center;
  width: 224px;
  height: 224px;
  margin: 0 auto;
  padding: 0;
  border: 0;
  background: none;
  color: var(--verde);
  cursor: pointer;
  filter: drop-shadow(0 12px 14px rgba(64, 74, 52, 0.22));
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  -webkit-tap-highlight-color: transparent;
}

.medallon:hover {
  transform: translateY(-4px) rotate(-2deg);
}

.medallon:active {
  transform: scale(0.97);
}

.medallon:disabled {
  cursor: wait;
  opacity: 0.7;
}

.medallon:focus-visible {
  outline: 2px solid var(--oro);
  outline-offset: 4px;
  border-radius: 50%;
}

.medallon-fondo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.borde-oro {
  fill: var(--oro-claro);
  stroke: var(--oro);
  stroke-width: 2;
}

.borde-papel {
  fill: var(--crema);
  transform: scale(0.94);
  transform-origin: 100px 100px;
}

.aro {
  fill: var(--menta-claro);
  stroke: var(--agua);
  stroke-width: 2;
}

.puntada {
  fill: none;
  stroke: var(--oro);
  stroke-width: 1.2;
  stroke-dasharray: 3 4;
}

.laurel path {
  stroke: var(--agua);
  stroke-width: 1.4;
}

.laurel ellipse {
  fill: var(--agua);
  opacity: 0.8;
}

.corazon {
  fill: var(--oro);
}

.camara {
  position: relative;
  width: 40px;
  height: 40px;
  margin-top: -30px;
}

.medallon-texto {
  position: absolute;
  top: 52%;
  left: 32%;
  right: 32%;
  font-family: var(--fuente-titulo);
  font-size: 0.76rem;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--verde);
}

/* BURBUJAS con lo elegido */
.burbujas {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin: 22px 0 0;
  padding: 0;
  list-style: none;
}

.burbuja {
  position: relative;
  width: 76px;
  height: 76px;
  border-radius: 50%;
  box-shadow:
    0 0 0 3px var(--blanco),
    0 0 0 5px var(--menta),
    0 10px 18px -10px rgba(64, 74, 52, 0.6);
  animation: flotar-burbuja 3s ease-in-out infinite alternate;
  animation-delay: calc(var(--i) * -0.7s);
}

.burbuja img,
.burbuja video {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

@keyframes flotar-burbuja {
  to {
    transform: translateY(-6px);
  }
}

/* al enviar, las burbujas suben y se van */
.subiendo .burbuja {
  animation: subir-burbuja 1.2s cubic-bezier(0.5, 0, 0.75, 0) forwards;
  animation-delay: calc(var(--i) * 0.08s);
}

@keyframes subir-burbuja {
  to {
    opacity: 0;
    transform: translateY(-160px) scale(0.6);
  }
}

.quitar {
  position: absolute;
  top: -4px;
  right: -4px;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: var(--verde);
  color: #fff;
  cursor: pointer;
}

.quitar svg {
  width: 14px;
  height: 14px;
}

.burbuja-enter-active,
.burbuja-leave-active {
  transition: opacity 0.35s ease, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.burbuja-enter-from,
.burbuja-leave-to {
  opacity: 0;
  transform: scale(0.4);
}

.enviar {
  margin-top: 22px;
}

.gracias {
  margin: 10px auto 0;
  max-width: 290px;
  font-family: var(--fuente-mano);
  font-size: 2rem;
  line-height: 1.15;
  color: var(--verde);
}

.otra-vez {
  display: block;
  margin: 12px auto 0;
  padding: 8px 18px;
  border: 1.5px solid var(--agua);
  border-radius: 999px;
  background: var(--blanco);
  font-family: var(--fuente-titulo);
  font-size: 0.95rem;
  color: var(--verde);
  cursor: pointer;
}

.error {
  margin: 12px 0 0;
  font-weight: 600;
  color: #b4533c;
}
</style>
