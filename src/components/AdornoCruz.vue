<template>
  <!-- Adorno religioso sobre los títulos: cruz con olivo y una gota, que respira suavemente -->
  <div class="adorno-cruz" aria-hidden="true">
    <Ilustracion nombre="cruz" />
  </div>
</template>

<script setup lang="ts">
import Ilustracion from "@/components/Ilustracion.vue";
</script>

<style scoped>
.adorno-cruz {
  width: 70px;
  margin: 0 auto 6px;
  animation: respirar 4s ease-in-out infinite alternate;
}

@keyframes respirar {
  to {
    transform: translateY(-4px) scale(1.04);
  }
}
</style>
