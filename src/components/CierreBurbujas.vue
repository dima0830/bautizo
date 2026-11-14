<template>
  <!-- CIERRE: "¡Te esperamos!" con burbujas que suben, Santiago y la guirnalda -->
  <section class="seccion cierre">
    <div class="burbujas" aria-hidden="true">
      <span v-for="b in burbujas" :key="b.id" class="burbuja" :style="b.estilo"></span>
    </div>

    <div class="esquina izquierda" aria-hidden="true"><Ilustracion nombre="esquina-eucalipto" /></div>
    <div class="esquina derecha" aria-hidden="true"><Ilustracion nombre="esquina-eucalipto" /></div>

    <div v-flotar class="contenido">
      <AdornoCruz />
      <p class="bendicion">Con la bendición de Dios y el amor de mi familia</p>
      <h2 class="te-esperamos">¡Te esperamos!</h2>
      <div class="protagonista">
        <img v-if="santiagoFinal" :src="santiagoFinal" :alt="`${datos.nombre} saludando`" loading="lazy" />
        <Ilustracion v-else nombre="concha" class="concha" />
      </div>
      <p class="firma">{{ datos.nombreCompleto }}</p>
      <p class="fecha">{{ fechaPartes.dia }} · {{ fechaPartes.mes }} · {{ fechaPartes.anio }}</p>

      <!-- pila bautismal dorada y versículo, como en la referencia -->
      <svg class="pila" viewBox="0 0 120 70" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <ellipse cx="60" cy="16" rx="44" ry="8" stroke-width="1.6" />
        <path d="M22 18c4 16 18 26 38 26s34-10 38-26" stroke-width="1.6" />
        <path d="M52 44l-4 14h24l-4-14M42 62h36" stroke-width="1.6" />
        <path d="M30 16c8 3 22 4 30 4s22-1 30-4" stroke-width="1" opacity=".6" />
        <path d="M60 24v14M54 29h12" stroke-width="1.8" />
      </svg>
      <p class="mateo">«Dejad que los niños vengan a mí, porque de ellos es el reino de los cielos»</p>
      <p class="mateo-cita">Mateo 19, 14</p>
    </div>

    <div class="guirnalda" aria-hidden="true">
      <img v-if="guirnalda" :src="guirnalda" alt="" loading="lazy" />
      <svg v-else viewBox="0 0 480 140" preserveAspectRatio="none">
        <g filter="url(#acuarela)">
          <path d="M0 80c60-24 120-24 180 0s120 24 180 0 90-22 120-10V140H0z" fill="#d6dfc7" />
          <path d="M0 104c70-20 130-18 200 4s130 18 200-4 60-12 80-6V140H0z" fill="#9fb08d" />
        </g>
        <g fill="#6f8460" filter="url(#acuarela)">
          <ellipse cx="40" cy="70" rx="12" ry="7" transform="rotate(-40 40 70)" />
          <ellipse cx="58" cy="56" rx="11" ry="6" transform="rotate(-55 58 56)" />
          <ellipse cx="430" cy="66" rx="12" ry="7" transform="rotate(40 430 66)" />
          <ellipse cx="414" cy="52" rx="11" ry="6" transform="rotate(55 414 52)" />
        </g>
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import { datos, fechaPartes } from "@/datos";
import { imagen } from "@/imagenes";
import Ilustracion from "@/components/Ilustracion.vue";
import AdornoCruz from "@/components/AdornoCruz.vue";

const santiagoFinal = imagen("santiago-final");
const guirnalda = imagen("guirnalda-olas");

const burbujas = Array.from({ length: 12 }, (_, id) => ({
  id,
  estilo: {
    left: `${(id * 29 + 7) % 96}%`,
    width: `${10 + ((id * 7) % 4) * 6}px`,
    height: `${10 + ((id * 7) % 4) * 6}px`,
    animationDuration: `${9 + ((id * 5) % 6)}s`,
    animationDelay: `${-((id * 13) % 12)}s`,
  },
}));
</script>

<style scoped>
.cierre {
  overflow: hidden;
  padding-bottom: 170px;
  /* transparente arriba: continúa lo que viene de la sección anterior */
  background: linear-gradient(180deg, transparent 0%, var(--cielo) 45%, var(--menta-claro) 100%);
}

/* burbujas que suben despacio por todo el fondo */
.burbujas {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.burbuja {
  position: absolute;
  bottom: -30px;
  border-radius: 50%;
  border: 1.5px solid rgba(159, 176, 141, 0.7);
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.95) 0 18%, rgba(255, 255, 255, 0.25) 20%);
  animation: subir linear infinite;
}

@keyframes subir {
  from {
    transform: translateY(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  to {
    transform: translateY(-120vh);
    opacity: 0;
  }
}

.esquina {
  position: absolute;
  top: -26px;
  width: 104px;
  opacity: 0.9;
  pointer-events: none;
}

.esquina.izquierda {
  left: -20px;
  transform: rotate(90deg);
}

.esquina.derecha {
  right: -20px;
  transform: scaleX(-1) rotate(90deg);
}

.contenido {
  position: relative;
  max-width: 340px;
  margin: 0 auto;
}

.bendicion {
  margin: 0 auto 4px;
  max-width: 270px;
  font-family: var(--fuente-texto);
  font-size: 0.95rem;
  font-style: italic;
  line-height: 1.4;
  color: var(--texto-suave);
}

.te-esperamos {
  margin: 0;
  padding: 0 0.15em;
  font-family: var(--fuente-mano);
  font-size: clamp(3rem, 15vw, 3.8rem);
  font-weight: 400;
  line-height: 1.15;
  color: var(--verde);
}

.protagonista {
  width: min(80%, 260px);
  margin: 18px auto 8px;
}

.protagonista img {
  display: block;
  width: 100%;
  height: auto;
}

.concha {
  display: block;
  width: 70%;
  margin: 0 auto;
}

.firma {
  margin: 0;
  font-family: var(--fuente-titulo);
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: 2px;
  color: var(--oro);
}

.fecha {
  margin: 2px 0 0;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--texto-suave);
}

.pila {
  display: block;
  width: 96px;
  margin: 22px auto 6px;
  color: var(--oro);
}

.mateo {
  max-width: 280px;
  margin: 0 auto;
  font-family: var(--fuente-texto);
  font-size: 0.95rem;
  font-style: italic;
  line-height: 1.45;
  color: var(--texto);
}

.mateo-cita {
  margin: 4px 0 0;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: var(--oro);
}

.guirnalda {
  position: absolute;
  left: -4%;
  right: -4%;
  bottom: -2px;
  height: 150px;
  pointer-events: none;
}

.guirnalda img,
.guirnalda svg {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 100%;
}
</style>
