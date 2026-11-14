<template>
  <!--
    PORTADA "DEL CIELO AL AGUA": la escena se queda fija mientras bajas.
    --p (0 → 1) es el recorrido: el cielo se vuelve agua, las nubes suben a
    distinto ritmo, suben las olas y entra el barquito navegando.
  -->
  <div ref="pistaRef" class="pista">
    <section id="inicio" class="escena" aria-label="Portada">
      <!-- cielo: ilustración o degradado con manchas de acuarela -->
      <img v-if="cielo" :src="cielo" alt="" class="cielo-img" aria-hidden="true" />
      <div v-else class="cielo-pintado" aria-hidden="true">
        <svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
          <g filter="url(#acuarela-suave)">
            <ellipse cx="80" cy="140" rx="160" ry="90" fill="#bfe3d0" opacity=".55" />
            <ellipse cx="340" cy="300" rx="150" ry="100" fill="#dff1f4" opacity=".9" />
            <ellipse cx="160" cy="520" rx="200" ry="110" fill="#e3f3ea" opacity=".9" />
          </g>
        </svg>
      </div>

      <!-- el agua va tiñendo la escena al bajar -->
      <div class="tinte-agua" aria-hidden="true"></div>

      <!-- nubes en tres capas: las cercanas suben más rápido -->
      <div class="capa-nube lejos" aria-hidden="true"><div class="deriva"><Ilustracion nombre="nube-2" /></div></div>
      <div class="capa-nube media" aria-hidden="true"><div class="deriva lenta"><Ilustracion nombre="nube-1" /></div></div>
      <div class="capa-nube cerca" aria-hidden="true"><div class="deriva"><Ilustracion nombre="nube-1" /></div></div>

      <!-- la paloma cruza el cielo despacio, detrás de los textos -->
      <div class="paloma-vuelo" aria-hidden="true"><div class="aleteo"><Ilustracion nombre="paloma" :perezosa="false" /></div></div>

      <!-- textos -->
      <div class="textos">
        <p class="me-bautizo" aria-label="¡Me bautizo!">
          <span v-for="(letra, i) in letras" :key="i" class="letra" :style="{ '--i': i }" aria-hidden="true">{{ letra === " " ? " " : letra }}</span>
        </p>
        <h1 class="nombre">{{ datos.nombre }}</h1>
        <svg class="subrayado" viewBox="0 0 220 24" aria-hidden="true">
          <path d="M6 14c34-10 70-12 104-6s72 8 104-4" fill="none" stroke="#7cc2b0" stroke-width="5" stroke-linecap="round" filter="url(#acuarela)" />
        </svg>
        <p class="fecha-corta">{{ fechaPartes.diaSemana }} · {{ fechaPartes.dia }} de {{ fechaPartes.mes }}</p>
      </div>

      <!-- Santiago (o la paloma si aún no está su ilustración) -->
      <div class="protagonista">
        <div class="entra">
          <div class="flota">
            <img v-if="santiago" :src="santiago" :alt="`Ilustración de ${datos.nombre}`" />
            <Dibujo v-else nombre="paloma" class="paloma" />
          </div>
        </div>
      </div>

      <!-- olas que suben -->
      <div class="olas" aria-hidden="true">
        <img v-if="agua" :src="agua" alt="" class="agua-img" />
        <svg v-else class="olas-svg" viewBox="0 0 800 300" preserveAspectRatio="none">
          <g filter="url(#acuarela)">
            <path class="ola o1" d="M0 70C80 40 140 40 220 66s150 30 230 0 160-34 350 4V300H0z" fill="#bfe3d0" />
            <path class="ola o2" d="M0 120c90-30 160-26 250 4s170 26 250-4 170-30 300 6V300H0z" fill="#7cc2b0" />
            <path class="ola o3" d="M0 180c100-26 180-20 260 6s160 22 260-6 180-24 280 4V300H0z" fill="#4f9e8b" opacity=".85" />
          </g>
        </svg>
      </div>

      <!-- el barquito entra navegando -->
      <div class="barco" aria-hidden="true">
        <BarquitoNavegando />
      </div>

      <p class="zarpamos">¡Zarpamos hacia mi gran día!</p>

      <a href="#fecha" class="desliza" aria-label="Desliza hacia abajo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </a>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { datos, fechaPartes } from "@/datos";
import { imagen } from "@/imagenes";
import { usarProgresoPista } from "@/progresoPista";
import Ilustracion from "@/components/Ilustracion.vue";
import Dibujo from "@/components/Dibujo.vue";
import BarquitoNavegando from "@/components/BarquitoNavegando.vue";

const cielo = imagen("cielo");
const agua = imagen("agua");
const santiago = imagen("santiago-portada");
const letras = [..."¡Me bautizo!"];

const pistaRef = ref<HTMLElement | null>(null);
/*
  El barco no va pegado al dedo: --pb sigue a --p con inercia (tarda ~1 s en
  alcanzarlo), así entra navegando suave aunque se baje rápido.
*/
let objetivoBarco = 0;
let barco = 0;
let anterior = 0;
let animando = false;
const INERCIA = 1.0; // segundos aprox. para alcanzar su sitio

function pasoBarco(ahora: number) {
  const dt = Math.min(0.1, Math.max(0, (ahora - anterior) / 1000));
  anterior = ahora;
  barco += (objetivoBarco - barco) * (1 - Math.exp(-dt / (INERCIA / 3)));
  if (Math.abs(objetivoBarco - barco) < 0.0005) barco = objetivoBarco;
  pistaRef.value?.style.setProperty("--pb", barco.toFixed(4));
  if (barco !== objetivoBarco) requestAnimationFrame(pasoBarco);
  else animando = false;
}

usarProgresoPista(pistaRef, (p) => {
  objetivoBarco = p;
  if (!animando) {
    animando = true;
    anterior = performance.now();
    requestAnimationFrame(pasoBarco);
  }
});
</script>

<style scoped>
/* PISTA: 100svh de escena + 200svh de recorrido */
.pista {
  --p: 0;
  --pe: 0;
  --pb: 0;
  position: relative;
  height: 300vh;
  height: 300svh;
}

.escena {
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100svh;
  overflow: hidden;
  background: linear-gradient(180deg, #ffffff 0%, var(--cielo) 55%, var(--menta-claro) 100%);
}

.cielo-img,
.cielo-pintado,
.cielo-pintado svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* el cielo baja un poco más lento que la escena: profundidad */
.cielo-img,
.cielo-pintado {
  transform: translateY(calc(var(--p) * -8%)) scale(1.08);
}

.tinte-agua {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(191, 227, 208, 0.2) 0%, rgba(124, 194, 176, 0.75) 100%);
  opacity: calc(clamp(0, (var(--p) - 0.25) / 0.6, 1));
}

/* NUBES: cada capa sube a su ritmo y se desvanece al final */
/* cada capa se desvanece justo antes de tocar el borde de arriba (no se corta de golpe) */
.capa-nube {
  position: absolute;
}

.capa-nube.lejos {
  top: 6%;
  right: -14%;
  width: 52%;
  opacity: calc(0.7 * (1 - clamp(0, (var(--p) - 0.2) / 0.3, 1)));
  transform: translateY(calc(var(--p) * -12vh));
}

.capa-nube.media {
  top: 30%;
  left: -16%;
  width: 58%;
  opacity: calc(1 - clamp(0, (var(--p) - 0.14) / 0.26, 1));
  transform: translateY(calc(var(--p) * -70vh));
}

.capa-nube.cerca {
  top: 50%;
  right: -22%;
  width: 70%;
  opacity: calc(1 - clamp(0, (var(--p) - 0.18) / 0.25, 1));
  transform: translateY(calc(var(--p) * -110vh));
}

/* deriva horizontal lenta (en un elemento aparte: no choca con el de arriba) */
.deriva {
  animation: deriva 14s ease-in-out infinite alternate;
}

.deriva.lenta {
  animation-duration: 20s;
  animation-direction: alternate-reverse;
}

@keyframes deriva {
  to {
    transform: translateX(8%);
  }
}

/* PALOMA: cruza el cielo de un lado a otro (en un elemento) y ondula (en otro) */
.paloma-vuelo {
  position: absolute;
  top: 1.5%;
  left: 0;
  z-index: 2;
  width: 18%;
  max-width: 90px;
  animation: cruzar 16s linear 2.4s infinite;
  opacity: 0;
}

.aleteo {
  animation: ondular 2.2s ease-in-out infinite alternate;
}

@keyframes cruzar {
  0% {
    opacity: 0;
    transform: translateX(-30vw);
  }
  8% {
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  80%,
  100% {
    opacity: 0;
    transform: translateX(min(110vw, 520px));
  }
}

@keyframes ondular {
  to {
    transform: translateY(-14px) rotate(-5deg);
  }
}

/* TEXTOS */
.textos {
  position: relative;
  z-index: 3;
  padding: 11vh 24px 0;
  padding: 11svh 24px 0;
  text-align: center;
  transform: translateY(calc(var(--p) * -24vh));
  opacity: calc(1 - clamp(0, (var(--p) - 0.12) / 0.22, 1));
}

.me-bautizo {
  margin: 0;
  font-family: var(--fuente-mano);
  font-size: 2.1rem;
  font-weight: 600;
  line-height: 1;
  color: var(--agua-oscuro);
}

/* cada letra cae y rebota como una burbuja al abrir la página */
.letra {
  display: inline-block;
  animation: rebote 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  animation-delay: calc(0.25s + var(--i) * 0.05s);
}

@keyframes rebote {
  from {
    opacity: 0;
    transform: translateY(-36px) scale(0.5);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.nombre {
  margin: 4px 0 0;
  font-family: var(--fuente-titulo);
  font-size: clamp(3.4rem, 17vw, 4.6rem);
  font-weight: 600;
  line-height: 1;
  letter-spacing: 1px;
  color: var(--verde);
  animation: aparecer 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.85s both;
}

@keyframes aparecer {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* subrayado que se pinta de izquierda a derecha */
.subrayado {
  display: block;
  width: 190px;
  margin: 2px auto 0;
}

.subrayado path {
  stroke-dasharray: 240;
  stroke-dashoffset: 240;
  animation: pintar 1.1s ease-out 1.4s forwards;
}

@keyframes pintar {
  to {
    stroke-dashoffset: 0;
  }
}

.fecha-corta {
  margin: 6px 0 0;
  font-family: var(--fuente-titulo);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--texto-suave);
  animation: aparecer 0.8s ease 1.6s both;
}

/* SANTIAGO: abajo al centro; al bajar sube hacia el cielo y se desvanece mientras entra el barquito */
.protagonista {
  position: absolute;
  left: 50%;
  bottom: 14%;
  z-index: 2;
  width: min(74%, 330px);
  transform: translateX(-50%) translateY(calc(var(--pe) * -42vh)) scale(calc(1 - var(--pe) * 0.25));
  transform-origin: 50% 100%;
  opacity: calc(1 - clamp(0, (var(--p) - 0.3) / 0.3, 1));
}

/* entrada y flotación en elementos distintos (las dos animan transform) */
.protagonista .entra {
  animation: aparecer 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) 1.1s both;
}

.protagonista .flota {
  animation: flotar-suave 4.5s ease-in-out infinite alternate;
}

.protagonista img,
.protagonista .paloma {
  display: block;
  width: 100%;
  height: auto;
}

.protagonista .paloma {
  width: 70%;
  margin: 0 auto 10%;
}

@keyframes flotar-suave {
  to {
    transform: translateY(-10px);
  }
}

/* OLAS: al principio asoman, al bajar suben hasta la mitad de la pantalla */
.olas {
  position: absolute;
  left: -6%;
  right: -6%;
  bottom: 0;
  z-index: 4;
  height: 46%;
  transform: translateY(calc(42% - var(--pe) * 42%));
}

.agua-img,
.olas-svg {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 0;
}

.ola {
  animation: oleaje 6s ease-in-out infinite alternate;
}

.o2 {
  animation-duration: 7.5s;
  animation-direction: alternate-reverse;
}

.o3 {
  animation-duration: 9s;
}

@keyframes oleaje {
  to {
    transform: translateX(-30px);
  }
}

/* BARQUITO: entra desde la izquierda y se detiene al centro sobre las olas */
.barco {
  position: absolute;
  left: 50%;
  bottom: 36%;
  z-index: 5;
  width: min(40%, 170px);
  /* entra con --pb (con inercia) a lo largo de casi todo el recorrido */
  transform: translateX(calc(-50% - (1 - clamp(0, (var(--pb) - 0.1) / 0.75, 1)) * min(80vw, 400px)));
  opacity: calc(clamp(0, (var(--pb) - 0.1) / 0.1, 1));
}

.zarpamos {
  position: absolute;
  left: 0;
  right: 0;
  top: 8%;
  z-index: 6;
  margin: 0;
  padding: 0 24px;
  font-family: var(--fuente-mano);
  font-size: 2.2rem;
  font-weight: 600;
  line-height: 1.1;
  text-align: center;
  color: var(--verde);
  opacity: calc(clamp(0, (var(--p) - 0.62) / 0.2, 1));
  transform: translateY(calc((1 - clamp(0, (var(--p) - 0.62) / 0.2, 1)) * 20px));
}

/* flecha: se va apenas empiezas a bajar */
.desliza {
  position: absolute;
  left: calc(50% - 22px);
  bottom: 22px;
  z-index: 7;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(252, 254, 253, 0.92);
  color: var(--verde);
  box-shadow: var(--sombra-suave);
  opacity: calc(1 - clamp(0, var(--p) / 0.08, 1));
}

.desliza svg {
  width: 24px;
  height: 24px;
  animation: saltito 1.8s ease-in-out 2.4s infinite;
}

@keyframes saltito {
  50% {
    transform: translateY(5px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pista {
    height: auto;
  }
  .escena {
    position: relative;
  }
  .barco {
    opacity: 1;
    transform: translateX(-50%);
  }
}
</style>
