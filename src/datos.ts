/*
  DATOS DE LA INVITACIÓN
  Cambia aquí el nombre, la fecha y los lugares: toda la invitación se
  actualiza sola.
*/
export const datos = {
  /*
    Los formularios (confirmación y canción) no envían nada, solo muestran
    el mensaje de agradecimiento. Ponlo en false para una invitación real
    con servidor.
  */
  modoMuestra: true,

  /*
    Plan Básica: las confirmaciones (y canciones) se guardan en la hoja de
    Google de Innube. "evento" es el nombre de la pestaña; "hojaConfirmaciones"
    es la URL /exec del script (ver /home/dima/innube/confirmaciones).
    Si está vacía, se usa el servidor propio (/api/...).
  */
  evento: "bautizo-santiago",
  hojaConfirmaciones: "",

  nombre: "Santiago",
  nombreCompleto: "Santiago Gómez",

  /* Fecha y hora de la ceremonia, con zona horaria (Colombia: -05:00) */
  fecha: "2026-12-08T11:00:00-05:00",

  /* Frase de la portada */
  frase: "Hoy recibo el agua que me hace hijo de Dios",

  ceremonia: {
    titulo: "Bautizo",
    lugar: "Parroquia Nuestra Señora del Carmen",
    hora: "11:00 AM",
    mapa: "https://maps.google.com/?q=Parroquia+Nuestra+Señora+del+Carmen",
  },

  recepcion: {
    titulo: "Celebración",
    lugar: "Jardín Las Palmas",
    hora: "1:00 PM",
    mapa: "https://maps.google.com/?q=Jardin+Las+Palmas",
  },

  padres: ["Carlos Gómez", "Laura Ruiz"],
  padrinos: ["Andrés Ruiz", "Mariana López"],

  /* Cuántos pases puede elegir cada invitado al confirmar */
  maxPases: 4,
};

/* Partes de la fecha ya listas para mostrar (en hora de Colombia) */
const f = new Date(datos.fecha);
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const enZona = new Date(f.getTime() + (f.getTimezoneOffset() - 300) * 60000);
export const fechaPartes = {
  dia: enZona.getDate(),
  mes: MESES[enZona.getMonth()],
  anio: enZona.getFullYear(),
  diaSemana: DIAS[enZona.getDay()],
};
