<template>
  <Teleport to="body">
    <Transition name="ventana">
      <div v-if="abierta" class="fondo" @click.self="cerrar">
        <div ref="ventanaRef" class="ventana" role="dialog" aria-modal="true" :aria-label="titulo" tabindex="-1">
          <button type="button" class="cerrar" aria-label="Cerrar" @click="cerrar">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 7l10 10M17 7 7 17" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
            </svg>
          </button>
          <h2 class="titulo-ventana">{{ titulo }}</h2>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps<{ abierta: boolean; titulo: string }>();
const emit = defineEmits<{ cerrar: [] }>();
const ventanaRef = ref<HTMLElement | null>(null);

function cerrar() {
  emit("cerrar");
}

function alPulsarTecla(e: KeyboardEvent) {
  if (e.key === "Escape") cerrar();
}

watch(
  () => props.abierta,
  async (abierta) => {
    if (abierta) {
      document.addEventListener("keydown", alPulsarTecla);
      document.body.style.overflow = "hidden";
      await nextTick();
      ventanaRef.value?.focus();
    } else {
      document.removeEventListener("keydown", alPulsarTecla);
      document.body.style.overflow = "";
    }
  },
);

onBeforeUnmount(() => {
  document.removeEventListener("keydown", alPulsarTecla);
  document.body.style.overflow = "";
});
</script>

<style scoped>
.fondo {
  position: fixed;
  inset: 0;
  z-index: 70;
  display: grid;
  place-items: center;
  padding: 18px;
  overflow-y: auto;
  background: rgba(64, 74, 52, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.ventana {
  position: relative;
  width: min(100%, 380px);
  padding: 30px 22px 24px;
  border-radius: 30px;
  background:
    radial-gradient(ellipse 80% 40% at 50% 0%, var(--menta-claro), transparent 70%),
    var(--blanco);
  box-shadow: 0 30px 70px -24px rgba(0, 0, 0, 0.45);
  outline: none;
}

.titulo-ventana {
  margin: 0 36px 16px;
  font-family: var(--fuente-titulo);
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 1px;
  line-height: 1.3;
  text-align: center;
  color: var(--oro);
}

.cerrar {
  position: absolute;
  top: 14px;
  right: 14px;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 50%;
  background: var(--menta-claro);
  color: var(--verde);
  cursor: pointer;
}

.cerrar svg {
  width: 20px;
  height: 20px;
}

.ventana-enter-active,
.ventana-leave-active {
  transition: opacity 0.3s ease;
}

.ventana-enter-active .ventana,
.ventana-leave-active .ventana {
  transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ventana-enter-from,
.ventana-leave-to {
  opacity: 0;
}

.ventana-enter-from .ventana,
.ventana-leave-to .ventana {
  transform: translateY(30px) scale(0.92);
}
</style>
