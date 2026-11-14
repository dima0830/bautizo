<template>
  <!-- Cruz dorada de trazo fino con dos filigranas a los lados (como en la cabecera de la referencia) -->
  <div class="adorno-cruz" aria-hidden="true">
    <svg viewBox="0 0 160 60" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
      <!-- cruz -->
      <path d="M80 6v44M70 18h20" stroke-width="2.6" />
      <path d="M80 6l-2.5 3M80 6l2.5 3M70 18l3-2.5M70 18l3 2.5M90 18l-3-2.5M90 18l-3 2.5M80 50l-2.5-3M80 50l2.5-3" stroke-width="1.2" />
      <!-- filigranas -->
      <path d="M66 34c-10 0-14-8-22-8-6 0-8 6-4 8 3 1.5 6-1 4-3" stroke-width="1.3" />
      <path d="M94 34c10 0 14-8 22-8 6 0 8 6 4 8-3 1.5-6-1-4-3" stroke-width="1.3" />
      <path d="M44 26c-8-2-16 2-24 0M116 26c8-2 16 2 24 0" stroke-width="1" opacity=".7" />
    </svg>
  </div>
</template>

<style scoped>
.adorno-cruz {
  width: 120px;
  margin: 0 auto 6px;
  color: var(--oro);
  animation: respirar 4s ease-in-out infinite alternate;
}

.adorno-cruz svg {
  display: block;
  width: 100%;
}

@keyframes respirar {
  to {
    transform: translateY(-3px);
  }
}
</style>
