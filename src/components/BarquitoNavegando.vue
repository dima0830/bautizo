<template>
  <!--
    Barquito con vida: se mece sobre el agua y deja ondas que se abren a su
    alrededor. "mirando" lo voltea hacia el lado al que navega.
  -->
  <div class="barquito-navegando" :class="{ izquierda: mirando === 'izquierda' }" aria-hidden="true">
    <span class="onda o1"></span>
    <span class="onda o2"></span>
    <span class="onda o3"></span>
    <div class="voltea">
      <div class="mece">
        <Ilustracion nombre="barquito" :perezosa="false" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Ilustracion from "@/components/Ilustracion.vue";

withDefaults(defineProps<{ mirando?: "derecha" | "izquierda" }>(), { mirando: "derecha" });
</script>

<style scoped>
.barquito-navegando {
  position: relative;
}

/* ondas: anillos de agua que se abren y se desvanecen bajo el casco */
.onda {
  position: absolute;
  left: 50%;
  bottom: 2%;
  width: 90%;
  height: 22%;
  margin-left: -45%;
  border: 2px solid rgba(124, 194, 176, 0.9);
  border-radius: 50%;
  opacity: 0;
  animation: onda 2.7s ease-out infinite;
}

.o2 {
  animation-delay: 0.9s;
}

.o3 {
  animation-delay: 1.8s;
}

@keyframes onda {
  0% {
    opacity: 0.8;
    transform: scale(0.55);
  }
  100% {
    opacity: 0;
    transform: scale(1.7);
  }
}

/* voltear (transición) y mecer (animación) en elementos distintos */
.voltea {
  position: relative;
  transition: transform 0.6s cubic-bezier(0.34, 1.4, 0.64, 1);
}

.izquierda .voltea {
  transform: scaleX(-1);
}

.mece {
  transform-origin: 50% 85%;
  animation: mecer 2.4s ease-in-out infinite alternate;
}

@keyframes mecer {
  0% {
    transform: rotate(-7deg) translateY(0);
  }
  50% {
    transform: rotate(1deg) translateY(-7px);
  }
  100% {
    transform: rotate(7deg) translateY(-2px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .onda {
    display: none;
  }
}
</style>
