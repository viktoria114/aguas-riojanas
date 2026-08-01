/**
 * Data module for the Ranking & IoT Telemetry dashboard.
 *
 * Contains TypeScript type definitions, static datasets for the 5 zones of
 * La Rioja Capital (barrios, hogares), ranking calculators, and real-time
 * IoT simulation generators.
 *
 * Uses the same deterministic PRNG pattern as @/lib/consumo.ts to produce
 * reproducible demo data without a backend.
 */

// ── Type Definitions ──────────────────────────────────────────────────────────

export type ZonaId = "norte" | "sur" | "este" | "oeste" | "centro";

export interface Zona {
  id: ZonaId;
  nombre: string;
  hogares: number;
}

export interface Barrio {
  id: string;
  nombre: string;
  zonaId: ZonaId;
  hogares: number;
}

export type Tendencia = "subio" | "bajo" | "estable";

export interface Hogar {
  id: string;
  alias: string;
  barrioId: string;
  zonaId: ZonaId;
  scoreEficiencia: number;
  tendencia: Tendencia;
  insignias: string[];
  consumoHistorico: number;
  consumoActual: number;
  esMiHogar?: boolean;
}

export type ModoSimulacion = "normal" | "fuga" | "ahorro";

export interface LecturaIoT {
  timestamp: string;
  zonaId: ZonaId;
  zonaNombre: string;
  caudalLps: number;
  acumuladoM3: number;
  modo: ModoSimulacion;
}

export interface TickGrafico {
  tick: number;
  hora: string;
  norte: number;
  sur: number;
  este: number;
  oeste: number;
  centro: number;
}

export interface ZonaRanking {
  zona: Zona;
  promedioEficiencia: number;
  deltaSemana: number;
  posicion: number;
}

export interface BarrioRanking {
  barrio: Barrio;
  promedioEficiencia: number;
  deltaSemana: number;
  posicion: number;
}

// ── PRNG (same pattern as consumo.ts) ─────────────────────────────────────────

function pseudo(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// ── Static Data — Zones ──────────────────────────────────────────────────────

export const ZONAS: Zona[] = [
  { id: "norte", nombre: "Zona Norte", hogares: 6240 },
  { id: "sur", nombre: "Zona Sur", hogares: 5830 },
  { id: "este", nombre: "Zona Este", hogares: 5120 },
  { id: "oeste", nombre: "Zona Oeste", hogares: 4960 },
  { id: "centro", nombre: "Zona Centro", hogares: 7080 },
];

export const ZONAS_MAP = Object.fromEntries(ZONAS.map((z) => [z.id, z])) as Record<ZonaId, Zona>;

// ── Static Data — Barrios (real barrios of La Rioja Capital) ──────────────────

const BARRIOS_RAW: Record<ZonaId, string[]> = {
  norte: [
    "Barrio Vargas",
    "Barrio Yacampis",
    "Barrio UDAP",
    "Barrio Facundo Quiroga",
    "Barrio San Francisco",
  ],
  sur: [
    "Barrio Cochangasta",
    "Barrio Santa Teresita",
    "Barrio Juan D. Perón",
    "Barrio Libertador",
    "Barrio Parque Industrial",
  ],
  este: [
    "Barrio Urbano 3",
    "Barrio La Merced",
    "Barrio CGT",
    "Barrio 25 de Mayo",
    "Barrio San Martín",
  ],
  oeste: [
    "Barrio Cerro de la Cruz",
    "Barrio Islas Malvinas",
    "Barrio Policial",
    "Barrio Del Carmen",
    "Barrio Virgen del Valle",
  ],
  centro: [
    "Microcentro",
    "Barrio Cívico",
    "Barrio San Nicolás",
    "Barrio San Vicente",
    "Barrio Centro Norte",
  ],
};

const rBarrios = pseudo(137);
export const BARRIOS: Barrio[] = [];

for (const [zonaId, nombres] of Object.entries(BARRIOS_RAW)) {
  for (const nombre of nombres) {
    BARRIOS.push({
      id: `${zonaId}-${nombre
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[.]/g, "")}`,
      nombre,
      zonaId: zonaId as ZonaId,
      hogares: Math.round(800 + rBarrios() * 700),
    });
  }
}

export function barriosPorZona(zonaId: ZonaId): Barrio[] {
  return BARRIOS.filter((b) => b.zonaId === zonaId);
}

// ── Hogares Generation ───────────────────────────────────────────────────────
// Each barrio gets 8-10 "participating households" in the ranking program.
// Scores represent % efficiency vs historical consumption (higher = better).

const INSIGNIAS_DEFS = [
  { emoji: "🏆", nombre: "Mejor del barrio", minScore: 95 },
  { emoji: "⭐", nombre: "Top 10% zona", minScore: 88 },
  { emoji: "💧", nombre: "Ahorrador", minScore: 78 },
  { emoji: "🌿", nombre: "Eco-consciente", minScore: 65 },
  { emoji: "🔥", nombre: "Racha 7 días", minScore: 0 },
];

const rH = pseudo(251);
const ALL_HOGARES: Hogar[] = [];
let counter = 4001;

for (const barrio of BARRIOS) {
  const isSanFrancisco = barrio.id === "norte-barrio-san-francisco";
  const n = isSanFrancisco ? 8 : 8 + Math.floor(rH() * 3);

  for (let i = 0; i < n; i++) {
    const id = `hogar-${counter}`;
    let alias = `Hogar #${counter}`;
    let esMiHogar = false;
    counter++;

    let score: number;
    let tendencia: Tendencia;
    let insignias: string[] = [];

    if (isSanFrancisco) {
      // Deterministic positions for Barrio San Francisco
      const scoresSanFrancisco = [97, 94, 92, 90, 89, 83, 78, 72];
      score = scoresSanFrancisco[i] ?? 80;
      if (i === 4) {
        // Position #5: Familia Ruiz (Mi Hogar)
        alias = "Familia Ruiz (Tu Hogar)";
        esMiHogar = true;
        tendencia = "subio";
        insignias = ["⭐ Top 10% zona", "💧 Ahorrador", "🔥 Racha 7 días"];
      } else {
        tendencia = i % 2 === 0 ? "subio" : "bajo";
        for (const ins of INSIGNIAS_DEFS) {
          if (score >= ins.minScore && ins.minScore > 0) insignias.push(`${ins.emoji} ${ins.nombre}`);
        }
      }
    } else {
      score = Math.round(Math.max(35, Math.min(99, 48 + rH() * 52)));
      const tRand = rH();
      tendencia = tRand < 0.35 ? "subio" : tRand < 0.7 ? "bajo" : "estable";
      for (const ins of INSIGNIAS_DEFS) {
        if (ins.minScore === 0) {
          if (rH() > 0.7) insignias.push(`${ins.emoji} ${ins.nombre}`);
        } else if (score >= ins.minScore) {
          insignias.push(`${ins.emoji} ${ins.nombre}`);
        }
      }
    }

    const consumoHistorico = Math.round(8000 + rH() * 6000);
    const consumoActual = Math.round(consumoHistorico * (1 - score / 100));

    ALL_HOGARES.push({
      id,
      alias,
      barrioId: barrio.id,
      zonaId: barrio.zonaId,
      scoreEficiencia: score,
      tendencia,
      insignias,
      consumoHistorico,
      consumoActual,
      esMiHogar,
    });
  }
}

ALL_HOGARES.sort((a, b) => b.scoreEficiencia - a.scoreEficiencia);
export { ALL_HOGARES as HOGARES };

export function hogaresPorBarrio(barrioId: string): Hogar[] {
  return ALL_HOGARES
    .filter((h) => h.barrioId === barrioId)
    .sort((a, b) => b.scoreEficiencia - a.scoreEficiencia);
}

export function hogaresPorZona(zonaId: ZonaId): Hogar[] {
  return ALL_HOGARES
    .filter((h) => h.zonaId === zonaId)
    .sort((a, b) => b.scoreEficiencia - a.scoreEficiencia);
}

// ── Ranking Calculators ──────────────────────────────────────────────────────

export function calcularRankingZonas(): ZonaRanking[] {
  const rankings = ZONAS.map((zona) => {
    const hogares = hogaresPorZona(zona.id);
    const avg = hogares.length
      ? Math.round(
          hogares.reduce((s, h) => s + h.scoreEficiencia, 0) / hogares.length,
        )
      : 0;
    const r = pseudo(zona.id.charCodeAt(0) * 17);
    const delta = Math.round((r() * 8 - 3) * 10) / 10;
    return { zona, promedioEficiencia: avg, deltaSemana: delta };
  });
  rankings.sort((a, b) => b.promedioEficiencia - a.promedioEficiencia);
  return rankings.map((r, i) => ({ ...r, posicion: i + 1 }));
}

export function calcularRankingBarrios(zonaId: ZonaId): BarrioRanking[] {
  const barrios = barriosPorZona(zonaId);
  const rankings = barrios.map((barrio) => {
    const hogares = hogaresPorBarrio(barrio.id);
    const avg = hogares.length
      ? Math.round(
          hogares.reduce((s, h) => s + h.scoreEficiencia, 0) / hogares.length,
        )
      : 0;
    const charA = barrio.id.charCodeAt(Math.min(3, barrio.id.length - 1));
    const charB = barrio.id.charCodeAt(Math.min(5, barrio.id.length - 1));
    const r = pseudo(charA * 31 + charB * 7);
    const delta = Math.round((r() * 6 - 2) * 10) / 10;
    return { barrio, promedioEficiencia: avg, deltaSemana: delta };
  });
  rankings.sort((a, b) => b.promedioEficiencia - a.promedioEficiencia);
  return rankings.map((r, i) => ({ ...r, posicion: i + 1 }));
}

// ── IoT Simulation Engine ────────────────────────────────────────────────────

let tickCounter = 0;

/**
 * Generates a single simulation tick producing readings for all 5 zones.
 * Uses Math.random() (non-deterministic) so the live chart looks organic.
 *
 * @param modo     "normal" | "fuga" | "ahorro" — determines caudal range
 * @param acumulados  current accumulated m³ per zone
 * @returns  lecturas (per-zone readings), tickGrafico (chart data point),
 *           nuevosAcumulados (updated m³ values)
 */
export function generarTick(
  modo: ModoSimulacion,
  acumulados: Record<ZonaId, number>,
): {
  lecturas: LecturaIoT[];
  tickGrafico: TickGrafico;
  nuevosAcumulados: Record<ZonaId, number>;
} {
  tickCounter++;
  const now = new Date();
  const hora = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

  const lecturas: LecturaIoT[] = [];
  const nuevosAcumulados = { ...acumulados };
  const tickGrafico: TickGrafico = {
    tick: tickCounter,
    hora,
    norte: 0,
    sur: 0,
    este: 0,
    oeste: 0,
    centro: 0,
  };

  for (const zona of ZONAS) {
    let caudal: number;
    switch (modo) {
      case "fuga":
        caudal = 4.0 + Math.random() * 4.0;
        break;
      case "ahorro":
        caudal = 0.1 + Math.random() * 0.4;
        break;
      default:
        caudal = 0.5 + Math.random() * 1.5;
        break;
    }
    // Per-zone variance so lines don't overlap perfectly
    caudal *= 0.8 + Math.random() * 0.4;
    caudal = Math.round(caudal * 100) / 100;

    // Accumulate m³: caudal (L/s) × interval (1.5 s) / 1000 (L→m³)
    nuevosAcumulados[zona.id] =
      Math.round(
        (nuevosAcumulados[zona.id] + (caudal * 1.5) / 1000) * 10000,
      ) / 10000;

    lecturas.push({
      timestamp: hora,
      zonaId: zona.id,
      zonaNombre: zona.nombre,
      caudalLps: caudal,
      acumuladoM3: nuevosAcumulados[zona.id],
      modo,
    });

    tickGrafico[zona.id] = caudal;
  }

  return { lecturas, tickGrafico, nuevosAcumulados };
}

export function acumuladosIniciales(): Record<ZonaId, number> {
  return { norte: 0, sur: 0, este: 0, oeste: 0, centro: 0 };
}

// ── Summary helpers ──────────────────────────────────────────────────────────

export function totalHogaresRed(): number {
  return ZONAS.reduce((s, z) => s + z.hogares, 0);
}

export function promedioEficienciaGlobal(): number {
  return ALL_HOGARES.length
    ? Math.round(
        ALL_HOGARES.reduce((s, h) => s + h.scoreEficiencia, 0) /
          ALL_HOGARES.length,
      )
    : 0;
}
