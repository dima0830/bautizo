<template>
  <!--
    PORTADA "EN EL CIELO": la escena se queda fija mientras bajas.
    --p (0 → 1) es el recorrido: las nubes suben a distinto ritmo, se
    enciende una luz suave desde arriba y Santiago queda flotando en su
    nube sobre un banco de nubes que sube.
  -->
  <div ref="pistaRef" class="pista">
    <section id="inicio" class="escena" aria-label="Portada">
      <!-- cielo: ilustración o degradado con manchas de acuarela -->
      <img v-if="cielo" :src="cielo" alt="" class="cielo-img" aria-hidden="true" />
      <div v-else class="cielo-pintado" aria-hidden="true">
        <svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
          <g filter="url(#acuarela-suave)">
            <ellipse cx="80" cy="140" rx="160" ry="90" fill="#d6dfc7" opacity=".55" />
            <ellipse cx="340" cy="300" rx="150" ry="100" fill="#f4eee1" opacity=".9" />
            <ellipse cx="160" cy="520" rx="200" ry="110" fill="#eef1e6" opacity=".9" />
          </g>
        </svg>
      </div>

      <!-- luz suave que baja del cielo al avanzar (bendición) -->
      <div class="luz" aria-hidden="true"></div>

      <!-- nubes en tres capas: las cercanas suben más rápido -->
      <div class="capa-nube lejos" aria-hidden="true"><div class="deriva"><Ilustracion nombre="nube-2" /></div></div>
      <div class="capa-nube media" aria-hidden="true"><div class="deriva lenta"><Ilustracion nombre="nube-1" /></div></div>
      <div class="capa-nube cerca" aria-hidden="true"><div class="deriva"><Ilustracion nombre="nube-1" /></div></div>

      <!-- arco dorado de línea fina que enmarca la portada, con estrellitas que titilan -->
      <svg class="arco-dorado" viewBox="0 0 400 800" preserveAspectRatio="none" aria-hidden="true">
        <path d="M22 790V190C22 92 102 34 200 34s178 58 178 156v600" vector-effect="non-scaling-stroke" />
        <path d="M32 790V192C32 100 108 46 200 46s168 54 168 146v598" vector-effect="non-scaling-stroke" class="fino" />
      </svg>
      <span v-for="e in estrellas" :key="e.id" class="estrella" :style="e.estilo" aria-hidden="true">✦</span>

      <!-- textos -->
      <div class="textos">
        <AdornoCruz class="cruz-portada" />
        <p class="te-invito">Te invito a mi</p>
        <p class="bautizo" aria-label="Bautizo">
          <span v-for="(letra, i) in letras" :key="i" class="letra" :style="{ '--i': i }" aria-hidden="true">{{ letra }}</span>
        </p>
        <h1 class="nombre">{{ datos.nombre }}</h1>
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

      <!-- banco de nubes abajo, sube un poco al bajar -->
      <div class="banco" aria-hidden="true">
        <div class="nube-banco b1"><div class="deriva lenta"><Ilustracion nombre="nube-1" :perezosa="false" /></div></div>
        <div class="nube-banco b2"><div class="deriva"><Ilustracion nombre="nube-2" :perezosa="false" /></div></div>
        <div class="nube-banco b3"><div class="deriva lenta"><Ilustracion nombre="nube-1" :perezosa="false" /></div></div>
      </div>

      <!-- final de la portada: bloque vertical que llena la parte alta -->
      <div class="final-portada">
        <AdornoCruz class="cruz-final" />
        <p class="ya-se-acerca"><span>¡Ya se acerca</span><span>mi gran día!</span></p>
        <p class="final-fecha">{{ fechaPartes.diaSemana }} · {{ fechaPartes.dia }} de {{ fechaPartes.mes }}</p>
      </div>

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
import AdornoCruz from "@/components/AdornoCruz.vue";

const cielo = imagen("cielo");
const santiago = imagen("santiago-portada");
const letras = [..."BAUTIZO"];

/* estrellitas doradas dentro del arco */
const estrellas = [
  { x: 14, y: 22, t: 0.7 }, { x: 84, y: 18, t: 0.9 }, { x: 90, y: 40, t: 0.55 },
  { x: 10, y: 46, t: 0.6 }, { x: 22, y: 9, t: 0.5 }, { x: 76, y: 6, t: 0.6 },
].map((e, id) => ({
  id,
  estilo: { left: `${e.x}%`, top: `${e.y}%`, fontSize: `${e.t}rem`, animationDelay: `${-id * 0.9}s` },
}));

const pistaRef = ref<HTMLElement | null>(null);
usarProgresoPista(pistaRef);
</script>

<style scoped>
/* PISTA: 100svh de escena + 150svh de recorrido */
.pista {
  --p: 0;
  --pe: 0;
  position: relative;
  height: 250vh;
  height: 250svh;
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

/* luz cálida que baja desde arriba */
.luz {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: radial-gradient(ellipse 80% 55% at 50% -5%, rgba(255, 246, 214, 0.95), rgba(255, 246, 214, 0) 70%);
  opacity: calc(clamp(0, (var(--p) - 0.2) / 0.5, 1));
  pointer-events: none;
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

/* TEXTOS */
.textos {
  position: relative;
  z-index: 3;
  padding: 7vh 36px 0;
  padding: 7svh 36px 0;
  text-align: center;
  transform: translateY(calc(var(--p) * -24vh));
  opacity: calc(1 - clamp(0, (var(--p) - 0.12) / 0.22, 1));
}

/* ARCO DORADO */
.arco-dorado {
  position: absolute;
  inset: 0;
  z-index: 3;
  width: 100%;
  height: 100%;
  fill: none;
  stroke: var(--oro);
  stroke-width: 1.6;
  opacity: calc(0.9 - clamp(0, (var(--p) - 0.1) / 0.3, 1) * 0.6);
  pointer-events: none;
}

.arco-dorado .fino {
  stroke-width: 0.8;
  opacity: 0.6;
}

.estrella {
  position: absolute;
  z-index: 3;
  color: var(--oro);
  line-height: 1;
  animation: titilar 3.6s ease-in-out infinite;
  pointer-events: none;
}

@keyframes titilar {
  50% {
    opacity: 0.25;
    transform: scale(0.7);
  }
}

.cruz-portada {
  width: 104px;
  margin-bottom: 2px;
}

.te-invito {
  margin: 0;
  font-family: var(--fuente-texto);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 3.5px;
  text-transform: uppercase;
  color: var(--texto-suave);
  animation: aparecer 0.8s ease 0.2s both;
}

/* BAUTIZO: mayúsculas doradas; cada letra cae y rebota al abrir la página */
.bautizo {
  margin: 4px 0 0;
  font-family: var(--fuente-titulo);
  font-size: clamp(2.5rem, 13vw, 3.3rem);
  font-weight: 600;
  line-height: 1;
  letter-spacing: 4px;
  color: var(--oro);
}

.letra {
  display: inline-block;
  animation: rebote 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  animation-delay: calc(0.35s + var(--i) * 0.07s);
}

@keyframes rebote {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.6);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* el nombre en cursiva verde, como en la referencia */
.nombre {
  margin: 0;
  padding: 0 0.15em;
  font-family: var(--fuente-mano);
  font-size: clamp(3.6rem, 19vw, 5rem);
  font-weight: 400;
  line-height: 1.15;
  color: var(--verde);
  animation: aparecer 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.95s both;
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

/* SANTIAGO: abajo al centro; al bajar sube un poco en su nube y se queda flotando sobre el banco de nubes */
.protagonista {
  position: absolute;
  left: 50%;
  bottom: 14%;
  /* encima del banco de nubes */
  z-index: 5;
  /* también según la altura de la pantalla: en pantallas bajas no tapa la fecha */
  width: min(74%, 330px, calc((100vh - 320px) * 0.5));
  width: min(74%, 330px, calc((100svh - 320px) * 0.5));
  transform: translateX(-50%) translateY(calc(var(--pe) * -9vh)) scale(calc(1 - var(--pe) * 0.12));
  transform-origin: 50% 100%;
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

/* BANCO DE NUBES: asoma abajo y sube un poco al bajar */
.banco {
  position: absolute;
  left: -12%;
  right: -12%;
  bottom: -6%;
  z-index: 4;
  height: 42%;
  transform: translateY(calc(25% - var(--pe) * 25%));
  pointer-events: none;
}

.nube-banco {
  position: absolute;
  bottom: 0;
}

.b1 {
  left: -6%;
  width: 70%;
}

.b2 {
  left: 18%;
  bottom: 22%;
  width: 66%;
}

.b3 {
  right: -8%;
  width: 72%;
}

/* FINAL: cruz, frase en dos renglones grandes y la fecha, apilados en vertical */
.final-portada {
  position: absolute;
  left: 0;
  right: 0;
  top: 6%;
  z-index: 6;
  padding: 0 32px;
  text-align: center;
  opacity: calc(clamp(0, (var(--p) - 0.6) / 0.2, 1));
  transform: translateY(calc((1 - clamp(0, (var(--p) - 0.6) / 0.2, 1)) * 24px));
  pointer-events: none;
}

.cruz-final {
  width: 96px;
  margin-bottom: 4px;
}

.ya-se-acerca {
  display: flex;
  flex-direction: column;
  margin: 0;
  font-family: var(--fuente-mano);
  font-size: clamp(2.6rem, 13vw, 3.3rem);
  line-height: 1.05;
  color: var(--verde);
}

.final-fecha {
  margin: 10px 0 0;
  font-family: var(--fuente-titulo);
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--oro);
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
  background: rgba(252, 250, 245, 0.92);
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
}
</style>
