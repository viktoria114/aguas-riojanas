import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Gauge, Home, Waves } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { ConsumoChart } from "@/components/ConsumoChart";
import { MapaCalor } from "@/components/MapaCalor";
import { FormularioConsumo, type Registro } from "@/components/FormularioConsumo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { alertas, serieDiaria, serieMensual, serieSemanal, total, zonas, ars, coste } from "@/lib/consumo";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel de administración | Mi Agua Riojana" },
      {
        name: "description",
        content:
          "Panel de administración de Mi Agua Riojana: mapa de calor por zonas, consumo diario, semanal y mensual, alertas de red y registro de lecturas.",
      },
      { property: "og:title", content: "Panel de administración | Mi Agua Riojana" },
      {
        property: "og:description",
        content: "Mapa de calor, consumo por zonas, alertas y registro de lecturas de la red.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Admin,
});

const nivelEstilo = {
  alta: "bg-destructive/10 text-destructive border-destructive/30",
  media: "bg-warning/15 text-foreground border-warning/40",
  baja: "bg-secondary text-secondary-foreground border-border",
} as const;

function MetricCard({
  etiqueta,
  valor,
  delta,
  icono: Icono,
}: {
  etiqueta: string;
  valor: string;
  delta: number;
  icono: typeof Home;
}) {
  const sube = delta > 0;
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{etiqueta}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-primary">
          <Icono aria-hidden="true" className="h-4.5 w-4.5" />
        </span>
      </div>
      <p className="mt-2 font-display text-3xl font-bold tabular-nums text-foreground">{valor}</p>
      <p
        className={`mt-1 flex items-center gap-1 text-sm font-medium ${
          sube ? "text-destructive" : "text-success"
        }`}
      >
        {sube ? (
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        ) : (
          <ArrowDownRight aria-hidden="true" className="h-4 w-4" />
        )}
        {Math.abs(delta)} % frente al periodo anterior
      </p>
    </div>
  );
}

function Admin() {
  const [periodo, setPeriodo] = useState("dia");
  const [registros, setRegistros] = useState<Registro[]>([]);
  const dia = serieDiaria(11);
  const semana = serieSemanal(31);
  const mes = serieMensual(57);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-teal">Administración</p>
            <h1 className="mt-1 text-3xl font-bold text-primary sm:text-4xl">
              Panel de red y consumo
            </h1>
            <p className="mt-2 max-w-2xl text-foreground/70">
              Vista global del consumo de los hogares abonados, con el mismo detalle diario, semanal
              y mensual que ven las familias.
            </p>
          </div>
          <p className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted-foreground">
            Actualizado hace 5 min
          </p>
        </div>

        <div className="mt-8">
          <MapaCalor />
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard etiqueta="Hogares abonados" valor="29.230" delta={0.8} icono={Home} />
          <MetricCard
            etiqueta="Consumo hoy"
            valor={`${(total(dia) * 29).toLocaleString("es-ES")} m³`}
            delta={-2.4}
            icono={Waves}
          />
          <MetricCard etiqueta="Media por hogar" valor="126 L" delta={-1.1} icono={Gauge} />
          <MetricCard etiqueta="Alertas activas" valor="3" delta={5.0} icono={AlertTriangle} />
        </section>

        <section className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                Datos de consumo registrados
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Añade lecturas agregadas por zona; el coste se calcula con la tarifa vigente.
              </p>
            </div>
            <FormularioConsumo onAdd={(r) => setRegistros((prev) => [r, ...prev])} />
          </div>

          {registros.length === 0 ? (
            <p className="mt-5 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Todavía no hay lecturas añadidas en esta sesión.
            </p>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <Table>
                <caption className="sr-only">Lecturas de consumo añadidas manualmente</caption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Zona</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Litros</TableHead>
                    <TableHead className="text-right">Hogares</TableHead>
                    <TableHead className="text-right">L/hogar</TableHead>
                    <TableHead className="text-right">Coste</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registros.map((r, i) => (
                    <TableRow key={`${r.zona}-${r.fecha}-${i}`}>
                      <TableCell className="font-medium text-foreground">{r.zona}</TableCell>
                      <TableCell>{r.fecha}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {r.litros.toLocaleString("es-ES")}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {r.hogares.toLocaleString("es-ES")}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {Math.round(r.litros / r.hogares).toLocaleString("es-ES")}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {ars(coste(r.litros))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </section>


        <section className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-7">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">Consumo agregado</h2>
          <Tabs value={periodo} onValueChange={setPeriodo} className="mt-4">
            <TabsList className="h-auto w-full flex-wrap gap-1 bg-muted p-1 sm:w-auto">
              <TabsTrigger value="dia" className="flex-1 px-5 py-2 text-base sm:flex-none">
                Diario
              </TabsTrigger>
              <TabsTrigger value="semana" className="flex-1 px-5 py-2 text-base sm:flex-none">
                Semanal
              </TabsTrigger>
              <TabsTrigger value="mes" className="flex-1 px-5 py-2 text-base sm:flex-none">
                Mensual
              </TabsTrigger>
            </TabsList>
            <TabsContent value="dia" className="mt-6">
              <ConsumoChart datos={dia} />
            </TabsContent>
            <TabsContent value="semana" className="mt-6">
              <ConsumoChart datos={semana} tipo="barras" />
            </TabsContent>
            <TabsContent value="mes" className="mt-6">
              <ConsumoChart datos={mes} />
            </TabsContent>
          </Tabs>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-7">
            <h2 className="text-xl font-bold text-foreground">Consumo por zona</h2>
            <div className="mt-4 overflow-x-auto">
              <Table>
                <caption className="sr-only">
                  Consumo medio por hogar y variación en cada zona de servicio
                </caption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Zona</TableHead>
                    <TableHead className="text-right">Hogares</TableHead>
                    <TableHead className="text-right">Media L/día</TableHead>
                    <TableHead className="text-right">Variación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {zonas.map((z) => (
                    <TableRow key={z.zona}>
                      <TableCell className="font-medium text-foreground">{z.zona}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {z.hogares.toLocaleString("es-ES")}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{z.media}</TableCell>
                      <TableCell
                        className={`text-right font-semibold tabular-nums ${
                          z.variacion > 0 ? "text-destructive" : "text-success"
                        }`}
                      >
                        {z.variacion > 0 ? "+" : ""}
                        {z.variacion} %
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-7">
            <h2 className="text-xl font-bold text-foreground">Alertas de red</h2>
            <ul className="mt-4 space-y-3">
              {alertas.map((a) => (
                <li
                  key={a.tipo}
                  className={`rounded-2xl border p-4 ${nivelEstilo[a.nivel]}`}
                >
                  <p className="flex items-center justify-between gap-2 text-sm font-semibold uppercase tracking-wide">
                    {a.zona}
                    <span className="rounded-full bg-surface/70 px-2 py-0.5 text-xs font-medium normal-case">
                      Prioridad {a.nivel}
                    </span>
                  </p>
                  <p className="mt-1 font-medium">{a.tipo}</p>
                  <p className="mt-1 text-sm opacity-75">{a.hace}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      <footer className="border-t border-border bg-surface py-8">
        <p className="mx-auto max-w-6xl px-4 text-sm text-muted-foreground sm:px-6">
          Aguas Riojanas · Panel interno de demostración
        </p>
      </footer>
    </div>
  );
}
