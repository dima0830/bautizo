<template>
  <!--
    Muestra la ilustración src/assets/images/<nombre>.webp|png si existe;
    si no, el dibujo en SVG del mismo estilo (componente Dibujo).
  -->
  <img v-if="url" :src="url" :alt="alt" class="ilustracion" :loading="perezosa ? 'lazy' : 'eager'" decoding="async" />
  <Dibujo v-else :nombre="nombre" :etiqueta="alt" class="ilustracion" />
</template>

<script setup lang="ts">
import { imagen } from "@/imagenes";
import Dibujo from "@/components/Dibujo.vue";

const props = withDefaults(defineProps<{ nombre: string; alt?: string; perezosa?: boolean }>(), {
  alt: "",
  perezosa: true,
});

const url = imagen(props.nombre);
</script>

<style scoped>
.ilustracion {
  display: block;
  width: 100%;
  height: auto;
}
</style>
