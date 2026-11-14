<template>
  <!--
    Filtros SVG compartidos por todos los dibujos: deforman un poco los bordes
    y los suavizan, para que parezcan pintados con acuarela.
  -->
  <svg class="filtros" aria-hidden="true" focusable="false">
    <defs>
      <!-- mancha de acuarela: borde irregular y húmedo -->
      <filter id="acuarela" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="4" result="ruido" />
        <feDisplacementMap in="SourceGraphic" in2="ruido" scale="14" xChannelSelector="R" yChannelSelector="G" result="borde" />
        <feGaussianBlur in="borde" stdDeviation="0.8" />
      </filter>
      <!-- más suave, para fondos grandes -->
      <filter id="acuarela-suave" x="-30%" y="-30%" width="160%" height="160%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="9" result="ruido" />
        <feDisplacementMap in="SourceGraphic" in2="ruido" scale="40" xChannelSelector="R" yChannelSelector="G" result="borde" />
        <feGaussianBlur in="borde" stdDeviation="6" />
      </filter>
      <!-- trazo de tinta temblado -->
      <filter id="tinta" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="2" result="ruido" />
        <feDisplacementMap in="SourceGraphic" in2="ruido" scale="1.6" />
      </filter>
    </defs>
  </svg>
</template>

<style scoped>
.filtros {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}
</style>
