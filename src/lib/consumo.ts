// Datos de ejemplo de consumo de agua (litros).
// En una versión conectada, esto vendría de la base de datos.

export type Punto = { etiqueta: string; litros: number };

const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MESES = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

function pseudo(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function serieDiaria(seed = 7): Punto[] {
  const r = pseudo(seed);
  return Array.from({ length: 24 }, (_, h) => {
    const base = h >= 7 && h <= 9 ? 55 : h >= 13 && h <= 15 ? 40 : h >= 20 && h <= 22 ? 48 : 8;
    return { etiqueta: `${String(h).padStart(2, "0")}h`, litros: Math.round(base * (0.6 + r())) };
  });
}

export function serieSemanal(seed = 21): Punto[] {
  const r = pseudo(seed);
  return DIAS.map((d) => ({ etiqueta: d, litros: Math.round(280 + r() * 220) }));
}

export function serieMensual(seed = 42): Punto[] {
  const r = pseudo(seed);
  return MESES.map((m) => ({ etiqueta: m, litros: Math.round(7800 + r() * 4200) }));
}

export const total = (s: Punto[]) => s.reduce((a, b) => a + b.litros, 0);

export const familia = [
  { nombre: "Casa (total)", litros: 2410, icono: "casa" },
  { nombre: "Cocina", litros: 640, icono: "cocina" },
  { nombre: "Baños", litros: 1180, icono: "bano" },
  { nombre: "Jardín", litros: 590, icono: "jardin" },
];

export const consejos = [
  "Una ducha de 5 minutos ahorra hasta 60 litros frente a un baño.",
  "Cerrar el grifo al cepillarse los dientes ahorra 12 litros al día.",
  "Riega al amanecer o al atardecer: se evapora mucho menos agua.",
  "Revisa cisternas y grifos: una fuga puede perder 100 litros al día.",
];

export const zonas = [
  { zona: "Logroño Centro", hogares: 12480, media: 118, variacion: -3.2 },
  { zona: "Villamediana", hogares: 3120, media: 134, variacion: 1.8 },
  { zona: "Lardero", hogares: 4260, media: 127, variacion: -0.6 },
  { zona: "Calahorra", hogares: 5890, media: 141, variacion: 4.1 },
  { zona: "Haro", hogares: 3480, media: 109, variacion: -2.4 },
];

export const alertas = [
  { zona: "Calahorra", tipo: "Posible fuga en red", nivel: "alta" as const, hace: "hace 25 min" },
  { zona: "Villamediana", tipo: "Consumo atípico nocturno", nivel: "media" as const, hace: "hace 2 h" },
  { zona: "Haro", tipo: "Contador sin lectura", nivel: "baja" as const, hace: "hace 6 h" },
];

// ---- Tarifa y costes -------------------------------------------------------
/** Tasa fija de precio por litro (pesos argentinos/litro). */
export const PRECIO_LITRO = 0.0021;
const TASA_CONVERSION_EUR_A_ARS = 1100;
export const PRECIO_LITRO_ARS = PRECIO_LITRO * TASA_CONVERSION_EUR_A_ARS;

export const ars = (v: number) =>
  `AR$ ${v.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const coste = (litros: number) => litros * PRECIO_LITRO_ARS;

export const promedio = (s: Punto[]) => (s.length ? total(s) / s.length : 0);

/** Notificaciones de exceso de consumo frente al umbral objetivo/promedio. */
export type Notificacion = {
  id: string;
  titulo: string;
  detalle: string;
  nivel: "alta" | "media" | "info";
  cuando: string;
};

export function notificacionesConsumo(
  hoy: number,
  objetivo: number,
  mediaDiaria: number,
): Notificacion[] {
  const avisos: Notificacion[] = [];
  if (hoy > objetivo) {
    avisos.push({
      id: "objetivo",
      titulo: "Superaste el objetivo diario",
      detalle: `${Math.round(hoy - objetivo).toLocaleString("es-AR")} L por encima de los ${objetivo.toLocaleString("es-AR")} L objetivo (${ars(coste(hoy - objetivo))} extra).`,
      nivel: "alta",
      cuando: "hoy",
    });
  }
  if (hoy > mediaDiaria * 1.15) {
    avisos.push({
      id: "promedio",
      titulo: "Consumo por encima del promedio",
      detalle: `Hoy estás un ${Math.round((hoy / mediaDiaria - 1) * 100)} % por encima de la media diaria (${Math.round(mediaDiaria).toLocaleString("es-AR")} L).`,
      nivel: "media",
      cuando: "hace 1 h",
    });
  }
  if (avisos.length === 0) {
    avisos.push({
      id: "ok",
      titulo: "Consumo dentro de lo previsto",
      detalle: "No hay excesos sobre el objetivo ni sobre la media diaria del hogar.",
      nivel: "info",
      cuando: "ahora",
    });
  }
  return avisos;
}

/** Detección sencilla de posible fuga: consumo continuo en horas de madrugada. */
export function deteccionFuga(serie: Punto[]) {
  const madrugada = serie.slice(1, 6);
  const minimo = madrugada.length ? Math.min(...madrugada.map((p) => p.litros)) : 0;
  const sospecha = minimo >= 5;
  const litrosDia = minimo * 24;
  return {
    sospecha,
    litrosHora: minimo,
    litrosDia,
    costeMes: coste(litrosDia * 30),
  };
}

// ---- Mapa de calor (administración) ---------------------------------------
export const HORAS_MAPA = ["00", "03", "06", "09", "12", "15", "18", "21"];

export const mapaCalor = zonas.map((z, i) => {
  const r = pseudo(97 + i * 13);
  return {
    zona: z.zona,
    valores: HORAS_MAPA.map((_, h) => {
      const pico = h === 2 || h === 3 || h === 6 ? 1.6 : h === 0 || h === 1 ? 0.35 : 1;
      return Math.round(z.media * pico * (0.7 + r() * 0.6));
    }),
  };
});
