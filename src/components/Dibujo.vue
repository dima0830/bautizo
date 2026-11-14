<template>
  <!--
    Dibujos en SVG con efecto acuarela (filtros de FiltrosAcuarela.vue):
    manchas de color con borde húmedo + trazo fino de tinta.
    Se usan cuando no está la ilustración en imagen.
  -->
  <svg
    :viewBox="dibujo.caja"
    :role="etiqueta ? 'img' : undefined"
    :aria-label="etiqueta || undefined"
    :aria-hidden="etiqueta ? undefined : 'true'"
    preserveAspectRatio="xMidYMid meet"
  >
    <g filter="url(#acuarela)" v-html="dibujo.color"></g>
    <g filter="url(#tinta)" fill="none" stroke="#2f6b5b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity="0.75" v-html="dibujo.tinta"></g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ nombre: string; etiqueta?: string }>();

/* Paleta: menta #BFE3D0, agua #7CC2B0, verde #2F6B5B, arena #F3E3C3 */
const DIBUJOS: Record<string, { caja: string; color: string; tinta: string }> = {
  barquito: {
    caja: "0 0 200 170",
    color: `
      <path d="M100 18 100 112 34 112z" fill="#ffffff"/>
      <path d="M100 18 100 112 34 112z" fill="#bfe3d0" opacity=".45"/>
      <path d="M108 40 108 112 160 112z" fill="#e3f3ea"/>
      <path d="M18 118h164l-24 34H42z" fill="#7cc2b0"/>
      <path d="M18 118h164l-6 8H24z" fill="#bfe3d0"/>
      <ellipse cx="100" cy="160" rx="78" ry="6" fill="#7cc2b0" opacity=".35"/>`,
    tinta: `
      <path d="M100 18 100 112 34 112z"/><path d="M108 40 108 112 160 112z"/>
      <path d="M18 118h164l-24 34H42z"/><path d="M100 18v-10M100 8l12 4-12 4"/>
      <path d="M95 6h10M100 1v10" stroke-width="1.2"/>`,
  },
  nube: {
    caja: "0 0 220 110",
    color: `
      <path d="M40 92c-20 0-30-14-26-28s20-20 32-14c4-22 26-34 48-26 8-14 30-18 44-6 12-8 34-2 38 16 20-2 34 12 32 30s-18 28-34 28z" fill="#ffffff"/>
      <path d="M30 92c40 6 120 6 166-2-8 12-22 14-36 14H48c-8 0-14-4-18-12z" fill="#bfe3d0" opacity=".7"/>`,
    tinta: `<path d="M40 92c-20 0-30-14-26-28s20-20 32-14c4-22 26-34 48-26 8-14 30-18 44-6 12-8 34-2 38 16 20-2 34 12 32 30s-18 28-34 28z" opacity=".5"/>`,
  },
  paloma: {
    caja: "0 0 200 160",
    color: `
      <path d="M40 92c20-6 42-4 58 6 14-30 40-52 74-58-12 22-20 46-38 62 18 2 30 10 36 22-24-6-48-4-66 6-20 10-44 8-64-6 4-8 4-14 0-32z" fill="#ffffff"/>
      <path d="M98 98c14-30 40-52 74-58-12 22-20 46-38 62z" fill="#e3f3ea"/>
      <path d="M28 88c6-6 14-6 18 0l-6 6z" fill="#f3e3c3"/>
      <path d="M22 86c-6 4-14 10-16 18 10-2 16-6 22-12z" fill="#7cc2b0"/>
      <ellipse cx="14" cy="94" rx="7" ry="4" fill="#bfe3d0" transform="rotate(-30 14 94)"/>
      <ellipse cx="22" cy="104" rx="7" ry="4" fill="#bfe3d0" transform="rotate(20 22 104)"/>`,
    tinta: `
      <path d="M40 92c20-6 42-4 58 6 14-30 40-52 74-58-12 22-20 46-38 62 18 2 30 10 36 22-24-6-48-4-66 6-20 10-44 8-64-6 4-8 4-14 0-32z"/>
      <path d="M98 98c10 4 22 6 36 4"/><circle cx="46" cy="92" r="1.6" fill="#2f6b5b"/>
      <path d="M28 88c-8 4-16 10-20 18"/>`,
  },
  concha: {
    caja: "0 0 200 190",
    color: `
      <path d="M100 20c44 0 80 30 84 70l-84 46-84-46c4-40 40-70 84-70z" fill="#ffffff"/>
      <path d="M100 20c44 0 80 30 84 70l-84 46z" fill="#e3f3ea"/>
      <path d="M76 136h48l-8 16H84z" fill="#bfe3d0"/>
      <path d="M100 156c-6 10-8 15-8 18a8 8 0 0 0 16 0c0-3-2-8-8-18z" fill="#7cc2b0"/>
      <path d="M76 160c-4 7-5 10-5 12a5 5 0 0 0 10 0c0-2-1-5-5-12z" fill="#7cc2b0" opacity=".8"/>
      <path d="M124 160c-4 7-5 10-5 12a5 5 0 0 0 10 0c0-2-1-5-5-12z" fill="#7cc2b0" opacity=".8"/>`,
    tinta: `
      <path d="M100 20c44 0 80 30 84 70l-84 46-84-46c4-40 40-70 84-70z"/>
      <path d="M100 136V22M100 136 58 30M100 136 142 30M100 136 28 62M100 136 172 62"/>
      <path d="M76 136h48l-8 16H84z"/><path d="M160 30l4-8 4 8-8-4 8 0z" stroke-width="1.2"/>`,
  },
  iglesia: {
    caja: "0 0 200 190",
    color: `
      <ellipse cx="100" cy="172" rx="90" ry="12" fill="#bfe3d0"/>
      <path d="M44 96h112v76H44z" fill="#ffffff"/>
      <path d="M36 98 100 52l64 46z" fill="#7cc2b0"/>
      <path d="M86 40h28v56H86z" fill="#ffffff"/>
      <path d="M82 42 100 22l18 20z" fill="#7cc2b0"/>
      <path d="M88 172v-34a12 12 0 0 1 24 0v34z" fill="#bfe3d0"/>
      <circle cx="100" cy="66" r="7" fill="#f3e3c3"/>
      <circle cx="30" cy="160" r="20" fill="#7cc2b0"/><circle cx="170" cy="160" r="20" fill="#7cc2b0"/>
      <circle cx="48" cy="166" r="12" fill="#bfe3d0"/><circle cx="152" cy="166" r="12" fill="#bfe3d0"/>`,
    tinta: `
      <path d="M44 96h112v76H44z"/><path d="M36 98 100 52l64 46"/><path d="M86 40h28v56M82 42 100 22l18 20"/>
      <path d="M100 22V8M93 13h14"/><path d="M88 172v-34a12 12 0 0 1 24 0v34"/>
      <path d="M60 120h14v18H60zM126 120h14v18h-14z"/>`,
  },
  jardin: {
    caja: "0 0 200 190",
    color: `
      <ellipse cx="100" cy="172" rx="92" ry="12" fill="#bfe3d0"/>
      <circle cx="34" cy="120" r="30" fill="#7cc2b0"/><circle cx="168" cy="118" r="30" fill="#7cc2b0"/>
      <path d="M58 92h84l-10-26H68z" fill="#ffffff"/>
      <path d="M62 92h76v6H62z" fill="#e3f3ea"/>
      <path d="M86 132h28v18H86z" fill="#bfe3d0"/><path d="M90 120h20v12H90z" fill="#e3f3ea"/>
      <circle cx="58" cy="46" r="13" fill="#bfe3d0"/><circle cx="142" cy="40" r="14" fill="#7cc2b0"/>
      <circle cx="160" cy="62" r="10" fill="#ffffff"/>`,
    tinta: `
      <path d="M58 92h84l-10-26H68zM100 66V50"/><path d="M66 98v74M134 98v74"/>
      <path d="M74 150h52M86 132h28v18H86zM90 120h20v12H90z"/>
      <path d="M58 59c0 10-4 18 0 28M142 54c0 10 4 20 0 30M160 72c0 8-2 14 0 20" stroke-width="1"/>
      <path d="M68 78h64" stroke-dasharray="2 6" stroke-width="2.4" stroke="#f3e3c3"/>`,
  },
  "esquina-eucalipto": {
    caja: "0 0 200 200",
    color: `
      <ellipse cx="40" cy="160" rx="16" ry="11" fill="#7cc2b0" transform="rotate(-30 40 160)"/>
      <ellipse cx="66" cy="140" rx="15" ry="10" fill="#bfe3d0" transform="rotate(-40 66 140)"/>
      <ellipse cx="90" cy="118" rx="14" ry="10" fill="#7cc2b0" transform="rotate(-45 90 118)"/>
      <ellipse cx="112" cy="96" rx="12" ry="9" fill="#bfe3d0" transform="rotate(-50 112 96)"/>
      <ellipse cx="132" cy="76" rx="10" ry="8" fill="#7cc2b0" transform="rotate(-50 132 76)"/>
      <ellipse cx="28" cy="120" rx="13" ry="9" fill="#bfe3d0" transform="rotate(-70 28 120)"/>
      <ellipse cx="34" cy="88" rx="11" ry="8" fill="#7cc2b0" transform="rotate(-80 34 88)"/>
      <circle cx="150" cy="150" r="6" fill="#ffffff"/><circle cx="160" cy="132" r="4" fill="#ffffff"/>`,
    tinta: `<path d="M8 196C40 164 96 110 146 64M18 176c6-30 12-62 20-96"/><circle cx="150" cy="150" r="6"/><circle cx="160" cy="132" r="4"/>`,
  },
};

const dibujo = computed(() => DIBUJOS[props.nombre] ?? DIBUJOS.nube);
</script>
