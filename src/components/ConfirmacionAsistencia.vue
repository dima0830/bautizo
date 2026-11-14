<template>
  <!-- CONFIRMACIÓN: botón que abre el formulario; al confirmar, lluvia de gotas y burbujas -->
  <section id="confirmar" class="seccion confirmar">
    <div v-flotar class="contenido">
      <Ilustracion nombre="concha" class="concha" />
      <p class="antetitulo">¿Me acompañas?</p>
      <h2 class="titulo">Confirma tu asistencia</h2>

      <p v-if="enviado" class="gracias" role="status">
        <template v-if="asiste">
          ¡Gracias, <strong>{{ nombreEnviado }}</strong>! Te esperamos con
          {{ pasesEnviados }} {{ pasesEnviados === 1 ? "pase" : "pases" }}.
        </template>
        <template v-else>
          Gracias por avisarnos, <strong>{{ nombreEnviado }}</strong>. Te vamos a extrañar.
        </template>
      </p>
      <template v-else>
        <p class="subtitulo">Nos encantará compartir este día contigo</p>
        <button type="button" class="boton abrir" @click="abierta = true">Confirmar asistencia</button>
      </template>
    </div>

    <!-- lluvia de gotas y burbujas al confirmar -->
    <div v-if="lluvia" class="lluvia" aria-hidden="true">
      <span v-for="g in gotas" :key="g.id" class="gota" :class="g.tipo" :style="g.estilo"></span>
    </div>

    <VentanaModal :abierta="abierta" titulo="¿Vienes a mi bautizo?" @cerrar="abierta = false">
      <form class="formulario" novalidate @submit.prevent="enviar">
        <div class="opciones" role="radiogroup" aria-label="¿Asistirás?">
          <label class="opcion" :class="{ elegida: respuesta === 'si' }">
            <input v-model="respuesta" type="radio" name="asistencia" value="si" />
            <span>¡Sí, voy!</span>
          </label>
          <label class="opcion" :class="{ elegida: respuesta === 'no' }">
            <input v-model="respuesta" type="radio" name="asistencia" value="no" />
            <span>No puedo</span>
          </label>
        </div>

        <label class="campo">
          <span class="etiqueta-campo">Nombre completo*</span>
          <input v-model="nombre" type="text" autocomplete="name" placeholder="Escribe tu nombre" />
        </label>

        <label class="campo">
          <span class="etiqueta-campo">Celular</span>
          <input v-model="telefono" type="tel" autocomplete="tel" inputmode="tel" placeholder="Tu número" />
        </label>

        <!-- siempre visible: así la ventana no cambia de alto al elegir -->
        <fieldset class="campo pases-campo" :disabled="respuesta === 'no'">
          <legend class="etiqueta-campo">¿Cuántos pases usarás?</legend>
          <div class="pases">
            <button
              v-for="n in datos.maxPases"
              :key="n"
              type="button"
              class="pase"
              :class="{ activo: pases === n }"
              :aria-pressed="pases === n"
              @click="pases = n"
            >
              {{ n }}
            </button>
          </div>
        </fieldset>

        <label class="campo">
          <span class="etiqueta-campo">Mensaje para {{ datos.nombre }}</span>
          <input v-model="mensaje" type="text" placeholder="Unas palabras bonitas (opcional)" />
        </label>

        <p class="error" role="alert">{{ error }}</p>

        <button type="submit" class="boton enviar" :disabled="enviando">
          {{ enviando ? "Enviando…" : "Enviar confirmación" }}
        </button>
      </form>
    </VentanaModal>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { datos } from "@/datos";
import { enviarFormulario } from "@/envio";
import Ilustracion from "@/components/Ilustracion.vue";
import VentanaModal from "@/components/VentanaModal.vue";

const abierta = ref(false);
const respuesta = ref<"" | "si" | "no">("");
const nombre = ref("");
const telefono = ref("");
const pases = ref<number | null>(null);
const mensaje = ref("");
const error = ref("");
const enviando = ref(false);

const enviado = ref(false);
const nombreEnviado = ref("");
const pasesEnviados = ref(0);
const asiste = computed(() => respuesta.value === "si");

async function enviar() {
  if (!respuesta.value) return (error.value = "Cuéntanos si podrás venir.");
  if (!nombre.value.trim()) return (error.value = "Escribe tu nombre completo.");
  if (asiste.value && !pases.value) return (error.value = "Elige cuántos pases usarás.");

  error.value = "";
  enviando.value = true;
  const totalPases = asiste.value ? (pases.value ?? 0) : 0;
  try {
    await enviarFormulario("/api/rsvp", {
      fullName: nombre.value.trim(),
      phone: telefono.value.trim(),
      attendance: asiste.value ? "Sí asistirá" : "No asistirá",
      passesCount: totalPases,
      message: mensaje.value.trim(),
    });
    nombreEnviado.value = nombre.value.trim();
    pasesEnviados.value = totalPases;
    enviado.value = true;
    abierta.value = false;
    if (asiste.value) celebrar();
  } catch {
    error.value = "No pudimos enviar tu confirmación. Inténtalo de nuevo.";
  } finally {
    enviando.value = false;
  }
}

/* lluvia corta de gotas y burbujas */
const lluvia = ref(false);
const gotas = Array.from({ length: 22 }, (_, id) => ({
  id,
  tipo: id % 3 === 0 ? "burbuja" : "gota",
  estilo: {
    left: `${(id * 37) % 100}%`,
    animationDelay: `${((id * 13) % 10) * 0.08}s`,
    animationDuration: `${1.6 + ((id * 7) % 5) * 0.2}s`,
    "--escala": 0.6 + ((id * 11) % 5) * 0.15,
  },
}));

function celebrar() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  lluvia.value = true;
  setTimeout(() => (lluvia.value = false), 3000);
}
</script>

<style scoped>
.confirmar {
  overflow: hidden;
  background:
    radial-gradient(ellipse 80% 50% at 50% 100%, rgba(191, 227, 208, 0.6), transparent 70%),
    var(--blanco);
}

.contenido {
  position: relative;
  max-width: 340px;
  margin: 0 auto;
}

.concha {
  width: 110px;
  margin: 0 auto 6px;
}

.subtitulo {
  margin-bottom: 22px;
}

.gracias {
  margin: 10px auto 0;
  max-width: 300px;
  font-size: 1.1rem;
  color: var(--texto);
}

.gracias strong {
  color: var(--verde);
}

/* FORMULARIO */
.formulario {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.opciones {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.opcion {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 48px;
  border: 1.5px solid var(--menta);
  border-radius: 999px;
  font-family: var(--fuente-titulo);
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--verde);
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.opcion input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.opcion.elegida {
  background: var(--verde);
  border-color: var(--verde);
  color: #fff;
}

.opcion:has(input:focus-visible) {
  outline: 2px solid var(--agua);
  outline-offset: 2px;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding: 0;
  border: 0;
  text-align: left;
}

.etiqueta-campo {
  padding: 0;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--agua-oscuro);
}

.campo input {
  min-height: 46px;
  padding: 10px 14px;
  border: 1.5px solid var(--linea);
  border-radius: 14px;
  background: #fff;
  font: inherit;
  font-size: 1rem;
  color: var(--texto);
}

.campo input:focus {
  outline: none;
  border-color: var(--agua);
  box-shadow: 0 0 0 3px rgba(124, 194, 176, 0.25);
}

.pases-campo {
  transition: opacity 0.3s ease;
}

.pases-campo:disabled {
  opacity: 0.35;
}

.pases {
  display: flex;
  gap: 10px;
  margin-top: 6px;
}

.pase {
  width: 46px;
  height: 46px;
  border: 1.5px solid var(--menta);
  border-radius: 50%;
  background: #fff;
  font-family: var(--fuente-titulo);
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--verde);
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.pase.activo {
  background: var(--agua);
  border-color: var(--agua);
  color: #fff;
}

.pase:disabled {
  cursor: default;
}

.error {
  min-height: 1.4em;
  margin: 0;
  font-size: 0.92rem;
  font-weight: 600;
  color: #b4533c;
  text-align: center;
}

.enviar {
  width: 100%;
}

/* LLUVIA de celebración */
.lluvia {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.gota,
.burbuja {
  position: absolute;
  top: -20px;
  width: 12px;
  height: 16px;
  animation: caer linear forwards;
}

.gota {
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  background: var(--agua);
  opacity: 0.8;
}

.burbuja {
  top: auto;
  bottom: -20px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid rgba(124, 194, 176, 0.8);
  background: rgba(255, 255, 255, 0.6);
  animation-name: subir;
}

@keyframes caer {
  from {
    transform: translateY(0) scale(var(--escala));
  }
  to {
    transform: translateY(110vh) scale(var(--escala));
    opacity: 0;
  }
}

@keyframes subir {
  from {
    transform: translateY(0) scale(var(--escala));
  }
  to {
    transform: translateY(-90vh) scale(var(--escala));
    opacity: 0;
  }
}
</style>
