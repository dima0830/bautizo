<template>
  <!--
    Icono dorado de línea dentro de una corona de laurel salvia, como los de la
    referencia (calendario, reloj, cubiertos, iglesia).
  -->
  <div class="icono-laurel" aria-hidden="true">
    <svg viewBox="0 0 100 80">
      <!-- corona: dos ramas curvas con hojas -->
      <g class="rama">
        <path d="M30 70C14 60 10 38 20 18" fill="none" />
        <path d="M70 70C86 60 90 38 80 18" fill="none" />
      </g>
      <g class="hojas">
        <ellipse cx="17" cy="58" rx="7" ry="3.4" transform="rotate(-60 17 58)" />
        <ellipse cx="13" cy="44" rx="7" ry="3.4" transform="rotate(-80 13 44)" />
        <ellipse cx="15" cy="30" rx="6.5" ry="3.2" transform="rotate(-105 15 30)" />
        <ellipse cx="24" cy="64" rx="6" ry="3" transform="rotate(-20 24 64)" />
        <ellipse cx="20" cy="50" rx="6" ry="3" transform="rotate(-30 20 50)" />
        <ellipse cx="83" cy="58" rx="7" ry="3.4" transform="rotate(60 83 58)" />
        <ellipse cx="87" cy="44" rx="7" ry="3.4" transform="rotate(80 87 44)" />
        <ellipse cx="85" cy="30" rx="6.5" ry="3.2" transform="rotate(105 85 30)" />
        <ellipse cx="76" cy="64" rx="6" ry="3" transform="rotate(20 76 64)" />
        <ellipse cx="80" cy="50" rx="6" ry="3" transform="rotate(30 80 50)" />
      </g>
      <!-- icono dorado al centro -->
      <g class="dibujo" fill="none" stroke-linecap="round" stroke-linejoin="round" v-html="ICONOS[icono]"></g>
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps<{ icono: "calendario" | "reloj" | "cubiertos" | "iglesia" | "corazon" }>();

const CORAZON = '<path d="M50 52c-6-4-9-7-9-10a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1c0 3-3 6-9 10z" fill="currentColor" stroke="none"/>';
const ICONOS: Record<string, string> = {
  calendario:
    '<rect x="34" y="24" width="32" height="30" rx="4"/><path d="M34 33h32M42 20v8M58 20v8"/>' +
    '<path d="M50 49c-4-2.6-6-4.6-6-6.6a3 3 0 0 1 6-.7 3 3 0 0 1 6 .7c0 2-2 4-6 6.6z" fill="currentColor" stroke="none"/>',
  reloj: '<circle cx="50" cy="40" r="15"/><path d="M50 31v9l6 4"/>',
  cubiertos:
    '<circle cx="50" cy="40" r="11"/>' +
    '<path d="M50 44c-3-2-4.5-3.5-4.5-5a2.2 2.2 0 0 1 4.5-.4 2.2 2.2 0 0 1 4.5.4c0 1.5-1.5 3-4.5 5z" fill="currentColor" stroke="none"/>' +
    '<path d="M33 24v10a3 3 0 0 0 3 3v19M30 24v8M36 24v8M66 24c-3 2-4 8-4 13h4v19"/>',
  iglesia: '<path d="M50 18v8M46 22h8M38 36l12-10 12 10M40 34v22h20V34M47 56v-7a3 3 0 0 1 6 0v7"/>',
  corazon: CORAZON,
};
</script>

<style scoped>
.icono-laurel {
  width: 92px;
  margin: 0 auto 4px;
}

.icono-laurel svg {
  display: block;
  width: 100%;
}

.rama {
  stroke: var(--agua);
  stroke-width: 1.4;
}

.hojas ellipse {
  fill: var(--agua);
  opacity: 0.75;
}

.dibujo {
  color: var(--oro);
  stroke: var(--oro);
  stroke-width: 2;
}
</style>
