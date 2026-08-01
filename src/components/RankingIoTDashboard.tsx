import { useState, useMemo, useCallback } from "react";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  Crown,
  Users,
  Target,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ZONAS,
  barriosPorZona,
  hogaresPorBarrio,
  hogaresPorZona,
  calcularRankingZonas,
  calcularRankingBarrios,
  totalHogaresRed,
  promedioEficienciaGlobal,
  type ZonaId,
  type Hogar,
} from "@/lib/ranking-data";

// ── Constants ────────────────────────────────────────────────────────────────

const ZONA_STYLE: Record<ZonaId, { dot: string }> = {
  norte: { dot: "bg-primary" },
  sur: { dot: "bg-success" },
  este: { dot: "bg-teal" },
  oeste: { dot: "bg-warning" },
  centro: { dot: "bg-sky" },
};

// ── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({
  etiqueta,
  valor,
  ayuda,
  icono: Icono,
  destacado,
}: {
  etiqueta: string;
  valor: string;
  ayuda: string;
  icono: typeof Trophy;
  destacado?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-soft transition-colors ${
        destacado
          ? "border-primary/25 bg-primary text-primary-foreground"
          : "border-border bg-card"
      }`}
    >
      <div className="flex items-center justify-between">
        <p
          className={`text-sm font-medium ${
            destacado ? "text-primary-foreground/80" : "text-muted-foreground"
          }`}
        >
          {etiqueta}
        </p>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
            destacado ? "bg-primary-foreground/15" : "bg-accent text-primary"
          }`}
        >
          <Icono aria-hidden="true" className="h-4.5 w-4.5" />
        </span>
      </div>
      <p className="mt-2 font-display text-3xl font-bold tabular-nums">
        {valor}
      </p>
      <p
        className={`mt-1 text-sm ${
          destacado ? "text-primary-foreground/75" : "text-muted-foreground"
        }`}
      >
        {ayuda}
      </p>
    </div>
  );
}

function PosicionIndicador({ pos }: { pos: number }) {
  if (pos === 1)
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-warning/15">
        <Crown className="h-4.5 w-4.5 text-warning" />
      </span>
    );
  if (pos <= 3)
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
        #{pos}
      </span>
    );
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
      #{pos}
    </span>
  );
}

function TendenciaIndicador({ tendencia }: { tendencia: string }) {
  if (tendencia === "subio")
    return (
      <span className="inline-flex items-center gap-1 text-sm font-medium text-success">
        <TrendingUp className="h-3.5 w-3.5" /> Subió
      </span>
    );
  if (tendencia === "bajo")
    return (
      <span className="inline-flex items-center gap-1 text-sm font-medium text-destructive">
        <TrendingDown className="h-3.5 w-3.5" /> Bajó
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground">
      <Minus className="h-3.5 w-3.5" /> Estable
    </span>
  );
}

function DeltaIndicador({ delta }: { delta: number }) {
  const positivo = delta > 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-sm font-semibold tabular-nums ${
        positivo ? "text-success" : "text-destructive"
      }`}
    >
      {positivo ? (
        <TrendingUp className="h-3.5 w-3.5" />
      ) : (
        <TrendingDown className="h-3.5 w-3.5" />
      )}
      {positivo ? "+" : ""}
      {delta}%
    </span>
  );
}

function HogarCard({ hogar, posicion }: { hogar: Hogar; posicion: number }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft transition-shadow hover:shadow-md">
      <PosicionIndicador pos={posicion} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-semibold text-foreground">
            {hogar.alias}
          </p>
          <TendenciaIndicador tendencia={hogar.tendencia} />
        </div>
        <div className="mt-1.5 flex items-center gap-3">
          <span className="font-display text-lg font-bold tabular-nums text-primary">
            {hogar.scoreEficiencia}%
          </span>
          <Progress
            value={hogar.scoreEficiencia}
            className="h-2 flex-1"
            aria-label={`Eficiencia: ${hogar.scoreEficiencia}%`}
          />
        </div>
        {hogar.insignias.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {hogar.insignias.map((ins) => (
              <Badge key={ins} variant="secondary" className="text-xs">
                {ins}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export function RankingIoTDashboard() {
  // ── Ranking state ──────────────────────────────────────────────────────────
  const [tabRanking, setTabRanking] = useState("zona");
  const [zonaFiltro, setZonaFiltro] = useState<ZonaId>("norte");
  const [barrioFiltro, setBarrioFiltro] = useState("todos");

  // ── Memoized rankings ─────────────────────────────────────────────────────
  const rankingZonas = useMemo(() => calcularRankingZonas(), []);
  const rankingBarrios = useMemo(
    () => calcularRankingBarrios(zonaFiltro),
    [zonaFiltro],
  );
  const barriosDisponibles = useMemo(
    () => barriosPorZona(zonaFiltro),
    [zonaFiltro],
  );
  const hogaresListados = useMemo(() => {
    if (barrioFiltro && barrioFiltro !== "todos") {
      return hogaresPorBarrio(barrioFiltro);
    }
    return hogaresPorZona(zonaFiltro);
  }, [zonaFiltro, barrioFiltro]);

  const mejorZona = rankingZonas[0];

  // Reset barrio filter when zona changes
  const handleZonaChange = useCallback((val: string) => {
    setZonaFiltro(val as ZonaId);
    setBarrioFiltro("todos");
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ────────────────────────── Header ────────────────────────── */}
      <section className="rounded-3xl bg-gradient-agua p-6 shadow-soft sm:p-9">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-primary" />
          <p className="inline-flex items-center gap-2 rounded-full bg-surface/80 px-3 py-1 text-sm font-medium text-primary">
            Ranking de Eficiencia Hídrica IoT
          </p>
        </div>
        <h1 className="mt-4 text-3xl font-bold text-primary sm:text-4xl">
          Competencia de Eficiencia Hídrica
        </h1>
        <p className="mt-3 max-w-2xl text-base text-foreground/75 sm:text-lg">
          Ranking en tiempo real de hogares, barrios y zonas de La Rioja Capital basándonos en lecturas de telemetría hídrica.
        </p>
      </section>

      {/* ────────────────────────── KPIs ──────────────────────────── */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <KpiCard
          etiqueta="Hogares en red"
          valor={totalHogaresRed().toLocaleString("es-AR")}
          ayuda="Total de hogares abonados"
          icono={Users}
          destacado
        />
        <KpiCard
          etiqueta="Eficiencia promedio"
          valor={`${promedioEficienciaGlobal()}%`}
          ayuda="Score promedio de todos los hogares"
          icono={Target}
        />
        <KpiCard
          etiqueta="Mejor zona"
          valor={mejorZona?.zona.nombre ?? "—"}
          ayuda={`${mejorZona?.promedioEficiencia ?? 0}% de eficiencia`}
          icono={Crown}
        />
      </section>

      {/* ────────────── Ranking Competitivo Multinivel ─────────────── */}
      <section
        aria-labelledby="ranking-titulo"
        className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-7"
      >
        <h2
          id="ranking-titulo"
          className="flex items-center gap-2 text-xl font-bold text-foreground sm:text-2xl"
        >
          <Trophy className="h-5 w-5 text-teal" />
          Ranking Competitivo Multinivel
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Clasificación por eficiencia hídrica (% de ahorro respecto al consumo
          histórico de cada hogar).
        </p>

        <Tabs value={tabRanking} onValueChange={setTabRanking} className="mt-5">
          <TabsList className="h-auto w-full flex-wrap gap-1 bg-muted p-1 sm:w-auto">
            <TabsTrigger
              value="zona"
              className="flex-1 px-5 py-2 text-base sm:flex-none"
            >
              Por Zona
            </TabsTrigger>
            <TabsTrigger
              value="barrio"
              className="flex-1 px-5 py-2 text-base sm:flex-none"
            >
              Por Barrio
            </TabsTrigger>
            <TabsTrigger
              value="hogar"
              className="flex-1 px-5 py-2 text-base sm:flex-none"
            >
              Por Hogar
            </TabsTrigger>
          </TabsList>

          {/* ── Tab: Zona ───────────────────────────────────────────── */}
          <TabsContent value="zona" className="mt-6">
            <div className="overflow-x-auto">
              <Table>
                <caption className="sr-only">
                  Ranking de eficiencia por zona
                </caption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">#</TableHead>
                    <TableHead>Zona</TableHead>
                    <TableHead>Eficiencia</TableHead>
                    <TableHead className="text-right">Δ Semana</TableHead>
                    <TableHead className="text-right">Hogares</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rankingZonas.map((r) => (
                    <TableRow key={r.zona.id}>
                      <TableCell>
                        <PosicionIndicador pos={r.posicion} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-3 w-3 rounded-full ${ZONA_STYLE[r.zona.id].dot}`}
                          />
                          <span className="font-medium text-foreground">
                            {r.zona.nombre}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="font-display text-lg font-bold tabular-nums text-primary">
                            {r.promedioEficiencia}%
                          </span>
                          <Progress
                            value={r.promedioEficiencia}
                            className="hidden h-2.5 w-24 sm:block"
                            aria-label={`${r.zona.nombre}: ${r.promedioEficiencia}%`}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DeltaIndicador delta={r.deltaSemana} />
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {r.zona.hogares.toLocaleString("es-AR")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* ── Tab: Barrio ──────────────────────────────────────────── */}
          <TabsContent value="barrio" className="mt-6">
            <div className="mb-4">
              <Select value={zonaFiltro} onValueChange={handleZonaChange}>
                <SelectTrigger className="w-[220px]" id="select-zona-barrio">
                  <SelectValue placeholder="Seleccionar zona" />
                </SelectTrigger>
                <SelectContent>
                  {ZONAS.map((z) => (
                    <SelectItem key={z.id} value={z.id}>
                      {z.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <caption className="sr-only">
                  Ranking de eficiencia por barrio
                </caption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">#</TableHead>
                    <TableHead>Barrio</TableHead>
                    <TableHead>Eficiencia</TableHead>
                    <TableHead className="text-right">Δ Semana</TableHead>
                    <TableHead className="text-right">Hogares</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rankingBarrios.map((r) => (
                    <TableRow key={r.barrio.id}>
                      <TableCell>
                        <PosicionIndicador pos={r.posicion} />
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {r.barrio.nombre}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="font-display text-lg font-bold tabular-nums text-primary">
                            {r.promedioEficiencia}%
                          </span>
                          <Progress
                            value={r.promedioEficiencia}
                            className="hidden h-2.5 w-24 sm:block"
                            aria-label={`${r.barrio.nombre}: ${r.promedioEficiencia}%`}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DeltaIndicador delta={r.deltaSemana} />
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {r.barrio.hogares.toLocaleString("es-AR")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* ── Tab: Hogar ──────────────────────────────────────────── */}
          <TabsContent value="hogar" className="mt-6">
            <div className="mb-4 flex flex-wrap gap-3">
              <Select value={zonaFiltro} onValueChange={handleZonaChange}>
                <SelectTrigger className="w-[200px]" id="select-zona-hogar">
                  <SelectValue placeholder="Zona" />
                </SelectTrigger>
                <SelectContent>
                  {ZONAS.map((z) => (
                    <SelectItem key={z.id} value={z.id}>
                      {z.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={barrioFiltro}
                onValueChange={setBarrioFiltro}
              >
                <SelectTrigger className="w-[240px]" id="select-barrio-hogar">
                  <SelectValue placeholder="Barrio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los barrios</SelectItem>
                  {barriosDisponibles.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <p className="mb-3 text-sm text-muted-foreground">
              {hogaresListados.length} hogares ·{" "}
              {barrioFiltro === "todos"
                ? ZONAS.find((z) => z.id === zonaFiltro)?.nombre
                : barriosDisponibles.find((b) => b.id === barrioFiltro)?.nombre}
            </p>

            <div className="max-h-[540px] space-y-3 overflow-y-auto pr-1">
              {hogaresListados.map((h, i) => (
                <HogarCard key={h.id} hogar={h} posicion={i + 1} />
              ))}
              {hogaresListados.length === 0 && (
                <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  No hay hogares registrados para esta selección.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
}
