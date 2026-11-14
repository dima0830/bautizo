<template>
  <!-- Botón flotante de música (solo si hay una canción en src/assets/audio/) -->
  <button
    v-if="cancion"
    type="button"
    class="musica"
    :class="{ sonando }"
    :aria-label="sonando ? 'Pausar música' : 'Reproducir música'"
    :aria-pressed="sonando"
    @click="alternar"
  >
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M25 6v22H10z" fill="currentColor" />
      <path d="M28 12v16h11z" fill="currentColor" opacity=".7" />
      <path d="M6 31h36l-6 9H12z" fill="currentColor" />
    </svg>
    <span class="estado">{{ sonando ? "Pausar" : "Música" }}</span>
    <audio ref="audioRef" :src="cancion" preload="none" loop></audio>
  </button>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const canciones = import.meta.glob<string>("../assets/audio/*.{mp3,m4a}", { eager: true, query: "?url", import: "default" });
const cancion = Object.values(canciones)[0] ?? null;

const audioRef = ref<HTMLAudioElement | null>(null);
const sonando = ref(false);

async function alternar() {
  const audio = audioRef.value;
  if (!audio) return;
  if (audio.paused) {
    try {
      await audio.play();
      sonando.value = true;
    } catch {
      sonando.value = false;
    }
  } else {
    audio.pause();
    sonando.value = false;
  }
}

/*
  Suena con el primer toque en la invitación (los navegadores no dejan
  sonar audio sin un toque; deslizar no cuenta). Si el toque es en el propio
  botón, lo maneja el botón.
*/
const EVENTOS = ["click", "touchend", "keydown"] as const;
let esperando = false;

function dejarDeEsperar() {
  if (!esperando) return;
  esperando = false;
  EVENTOS.forEach((e) => window.removeEventListener(e, alPrimerToque, true));
}

async function alPrimerToque(evento: Event) {
  const audio = audioRef.value;
  if (!audio || !audio.paused) return dejarDeEsperar();
  if ((evento.target as Element | null)?.closest?.(".musica")) return dejarDeEsperar();
  try {
    await audio.play();
    sonando.value = true;
    dejarDeEsperar();
  } catch {
    // aún no lo permite el navegador: se intenta con el siguiente toque
  }
}

onMounted(() => {
  if (!cancion) return;
  esperando = true;
  EVENTOS.forEach((e) => window.addEventListener(e, alPrimerToque, true));
});
onBeforeUnmount(dejarDeEsperar);
</script>

<style scoped>
.musica {
  position: fixed;
  right: max(14px, calc(50% - 240px + 14px));
  bottom: 18px;
  z-index: 40;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  width: 58px;
  height: 58px;
  border: 0;
  border-radius: 50%;
  background: var(--blanco);
  color: var(--verde);
  box-shadow:
    0 0 0 2px var(--menta),
    0 10px 20px -10px rgba(34, 80, 63, 0.6);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.musica svg {
  width: 26px;
  height: 26px;
}

.sonando svg {
  animation: navegar 1.6s ease-in-out infinite alternate;
  transform-origin: 50% 85%;
}

@keyframes navegar {
  from {
    transform: rotate(-8deg);
  }
  to {
    transform: rotate(8deg);
  }
}

.estado {
  font-size: 0.66rem;
  font-weight: 700;
  line-height: 1;
}
</style>
