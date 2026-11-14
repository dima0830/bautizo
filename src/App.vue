<template>
  <FiltrosAcuarela />

  <!-- fondo para pantallas grandes: acuarela menta con nubes que pasan a los lados -->
  <div class="fondo-escritorio" aria-hidden="true">
    <img v-if="fondo" :src="fondo" alt="" class="fondo-img" />
    <svg v-else class="fondo-pintado" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <g filter="url(#acuarela-suave)">
        <ellipse cx="200" cy="200" rx="420" ry="260" fill="#bfe3d0" opacity=".7" />
        <ellipse cx="1400" cy="700" rx="460" ry="280" fill="#bfe3d0" opacity=".6" />
        <ellipse cx="1350" cy="150" rx="360" ry="200" fill="#dff1f4" />
        <ellipse cx="250" cy="760" rx="380" ry="220" fill="#dff1f4" />
      </g>
    </svg>
    <div class="nube-lado n1"><Ilustracion nombre="nube-1" /></div>
    <div class="nube-lado n2"><Ilustracion nombre="nube-2" /></div>
    <div class="nube-lado n3"><Ilustracion nombre="nube-1" /></div>
  </div>

  <main class="tarjeta">
    <PortadaCielo />
    <SeccionFecha />
    <RutaBarquito />
    <FamiliaNubes />
    <GaleriaVentanas />
    <ConfirmacionAsistencia />
    <CierreBurbujas />
    <MusicaBarquito />
  </main>
</template>

<script setup lang="ts">
import { imagen } from "@/imagenes";
import FiltrosAcuarela from "@/components/FiltrosAcuarela.vue";
import Ilustracion from "@/components/Ilustracion.vue";
import PortadaCielo from "@/components/PortadaCielo.vue";
import SeccionFecha from "@/components/SeccionFecha.vue";
import RutaBarquito from "@/components/RutaBarquito.vue";
import FamiliaNubes from "@/components/FamiliaNubes.vue";
import GaleriaVentanas from "@/components/GaleriaVentanas.vue";
import ConfirmacionAsistencia from "@/components/ConfirmacionAsistencia.vue";
import CierreBurbujas from "@/components/CierreBurbujas.vue";
import MusicaBarquito from "@/components/MusicaBarquito.vue";

const fondo = imagen("fondo-escritorio");
</script>

<style>
/* solo en pantallas grandes, detrás de la tarjeta */
.fondo-escritorio {
  display: none;
}

@media (min-width: 900px) {
  .fondo-escritorio {
    position: fixed;
    inset: 0;
    z-index: 0;
    display: block;
    overflow: hidden;
    pointer-events: none;
  }

  .tarjeta {
    z-index: 1;
  }

  .fondo-img,
  .fondo-pintado {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .nube-lado {
    position: absolute;
    width: min(22vw, 340px);
    opacity: 0.9;
    animation: pasar 60s linear infinite;
  }

  .n1 {
    top: 12%;
    left: -24vw;
  }

  .n2 {
    top: 46%;
    left: -24vw;
    width: min(16vw, 240px);
    animation-duration: 80s;
    animation-delay: -30s;
  }

  .n3 {
    top: 74%;
    left: -24vw;
    animation-duration: 70s;
    animation-delay: -55s;
  }

  @keyframes pasar {
    to {
      transform: translateX(130vw);
    }
  }
}

@media (min-width: 900px) and (prefers-reduced-motion: reduce) {
  .nube-lado {
    animation: none;
  }
  .n1 {
    left: 6vw;
  }
  .n3 {
    left: auto;
    right: 6vw;
  }
}
</style>
