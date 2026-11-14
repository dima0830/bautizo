/*
  Ilustraciones opcionales de src/assets/images/ por nombre (sin extensión).
  imagen("barquito") devuelve la URL si existe barquito.webp / .png / .jpg,
  o null; así cada componente usa su dibujo en SVG cuando falta la imagen.
*/
const archivos = import.meta.glob<string>("./assets/images/*.{webp,png,jpg,jpeg}", {
  eager: true,
  query: "?url",
  import: "default",
});

const porNombre: Record<string, string> = {};
for (const [ruta, url] of Object.entries(archivos)) {
  const nombre = ruta.split("/").pop()!.replace(/\.\w+$/, "");
  // si hay varias versiones, la .webp gana
  if (!porNombre[nombre] || ruta.endsWith(".webp")) porNombre[nombre] = url;
}

export function imagen(nombre: string): string | null {
  return porNombre[nombre] ?? null;
}

/* Fotos de la galería: santiago1, santiago2, … en orden por número */
export const fotosGaleria: string[] = Object.keys(porNombre)
  .filter((n) => /^santiago\d+$/.test(n))
  .sort((a, b) => Number(a.slice(8)) - Number(b.slice(8)))
  .map((n) => porNombre[n]);
