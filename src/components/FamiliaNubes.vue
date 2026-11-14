<template>
  <!--
    PADRES Y PADRINOS: tarjetas con forma de nube que se voltean en 3D al
    entrar en pantalla (por delante el rol, por detrás los nombres).
    Al tocarlas se vuelven a girar.
  -->
  <section id="familia" class="seccion familia manchas">
    <div v-flotar class="cabecera">
      <AdornoCruz />
      <p class="antetitulo">Con el amor de</p>
      <h2 class="titulo">Mi familia</h2>
    </div>

    <div ref="grupoRef" class="nubes">
      <button
        v-for="(g, i) in grupos"
        :key="g.rol"
        type="button"
        class="nube"
        :class="{ volteada: volteadas[i] }"
        :style="{ '--i': i }"
        :aria-label="`${g.rol}: ${g.nombres.join(' y ')}`"
        @click="volteadas[i] = !volteadas[i]"
      >
        <span class="cara frente" aria-hidden="true">
          <svg class="icono" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="g.icono"></svg>
          <span class="rol">{{ g.rol }}</span>
          <span class="toca">toca la nube</span>
        </span>
        <span class="cara dorso" aria-hidden="true">
          <span class="rol-pequeno">{{ g.rol }}</span>
          <span v-for="n in g.nombres" :key="n" class="persona">{{ n }}</span>
        </span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { datos } from "@/datos";
import AdornoCruz from "@/components/AdornoCruz.vue";

const grupos = [
  {
    rol: "Mis papás",
    nombres: datos.padres,
    icono: '<path d="M24 40s-14-8.5-14-19a8 8 0 0 1 14-5.3A8 8 0 0 1 38 21c0 10.5-14 19-14 19z"/>',
  },
  {
    rol: "Mis padrinos",
    nombres: datos.padrinos,
    icono: '<path d="M24 6v8M20 10h8"/><path d="M10 26c0-8 6-12 14-12s14 4 14 12"/><path d="M8 26h32l-4 14H12z"/>',
  },
].filter((g) => g.nombres.length);

const volteadas = reactive(grupos.map(() => false));
const grupoRef = ref<HTMLElement | null>(null);
let observador: IntersectionObserver | undefined;
const temporizadores: ReturnType<typeof setTimeout>[] = [];

/* se voltean solas, una tras otra, la primera vez que se ven */
onMounted(() => {
  if (!grupoRef.value) return;
  observador = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return;
      grupos.forEach((_, i) => temporizadores.push(setTimeout(() => (volteadas[i] = true), 500 + i * 450)));
      observador?.disconnect();
    },
    { threshold: 0.5 },
  );
  observador.observe(grupoRef.value);
});

onBeforeUnmount(() => {
  observador?.disconnect();
  temporizadores.forEach(clearTimeout);
});
</script>

<style scoped>
.familia {
  --manchas:
    radial-gradient(ellipse 65% 30% at 18% 40%, rgba(214, 223, 199, 0.55), transparent 70%),
    radial-gradient(ellipse 60% 30% at 86% 64%, rgba(244, 238, 225, 0.9), transparent 70%);
}

.cabecera {
  margin-bottom: 26px;
}

.nubes {
  display: grid;
  gap: 22px;
  max-width: 340px;
  margin: 0 auto;
  perspective: 900px;
}

/* NUBE: una tarjeta con dos caras */
.nube {
  position: relative;
  display: block;
  width: 100%;
  height: 184px;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.9s cubic-bezier(0.34, 1.4, 0.64, 1);
  -webkit-tap-highlight-color: transparent;
  animation: flotar-nube 5s ease-in-out infinite alternate;
  animation-delay: calc(var(--i) * -2.5s);
}

/* la flotación va en la animación y el giro en la transición: usan "translate" y "transform", en reglas distintas */
@keyframes flotar-nube {
  to {
    translate: 0 -6px;
  }
}

.nube.volteada {
  transform: rotateY(180deg);
}

.cara {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 40px 30px 16px;
  /* forma de nube: tres círculos de tamaño fijo arriba (todos dentro de la tarjeta) + base redondeada */
  background:
    radial-gradient(circle 42px at 27% 76px, var(--fondo-nube) 98%, transparent 100%),
    radial-gradient(circle 56px at 51% 62px, var(--fondo-nube) 98%, transparent 100%),
    radial-gradient(circle 40px at 75% 80px, var(--fondo-nube) 98%, transparent 100%);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  /* el fondo (::before) queda dentro de la cara y se oculta con ella al girar */
  isolation: isolate;
  /* contorno suave alrededor de toda la nube (círculos + base) */
  filter: drop-shadow(0 0 1.5px rgba(111, 132, 96, 0.55)) drop-shadow(0 12px 14px rgba(64, 74, 52, 0.18));
}

.cara::before {
  content: "";
  position: absolute;
  inset: 42% 4% 0;
  z-index: -1;
  border-radius: 999px;
  background: var(--fondo-nube);
}

.frente {
  --fondo-nube: var(--menta);
  color: var(--verde);
}

.dorso {
  --fondo-nube: var(--menta-claro);
  transform: rotateY(180deg);
  color: var(--verde);
}

.icono {
  width: 34px;
  height: 34px;
  margin-top: 18px;
}

.rol {
  font-family: var(--fuente-titulo);
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 2px;
  color: var(--oro);
}

.toca {
  font-family: var(--fuente-texto);
  font-size: 0.85rem;
  font-style: italic;
  color: var(--agua-oscuro);
}

.rol-pequeno {
  margin-top: 30px;
  font-family: var(--fuente-texto);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: var(--oro);
}

.persona {
  font-family: var(--fuente-mano);
  font-size: 1.9rem;
  line-height: 1.1;
  color: var(--verde);
}

@media (prefers-reduced-motion: reduce) {
  .nube {
    transition: none;
  }
}
</style>
