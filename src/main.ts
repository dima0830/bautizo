import { createApp, type Directive } from "vue";
import App from "./App.vue";
import "./assets/css/main.css";
import { paralaje } from "./paralaje";

/* v-flotar: los hijos del elemento suben flotando, como burbujas, al entrar en pantalla (una vez) */
const flotar: Directive<HTMLElement> = {
  mounted(el) {
    el.classList.add("flotar");
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          el.classList.add("visible");
          observador.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observador.observe(el);
  },
};

const app = createApp(App);
app.directive("flotar", flotar);
app.directive("paralaje", paralaje);
app.mount("#app");
