import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Droplets,
  ShowerHead,
  Sprout,
  UtensilsCrossed,
  TrendingDown,
  Users,
  BellRing,
  ShieldAlert,
  CircleDollarSign,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { ConsumoChart } from "@/components/ConsumoChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  consejos,
  familia,
  serieDiaria,
  serieMensual,
  serieSemanal,
  total,
  promedio,
  coste,
  ars,
  PRECIO_LITRO_ARS,
  notificacionesConsumo,
  deteccionFuga,
} from "@/lib/consumo";
import { useConsumo } from "@/context/ConsumoContext";
import familiaProfile from "../assets/familia profile.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mi consumo de agua | Mi Agua Riojana" },
      {
        name: "description",
        content:
          "Consulta el consumo de agua de tu hogar por día, semana y mes, el gasto acumulado y las alertas por exceso de consumo o posible fuga.",
      },
      { property: "og:title", content: "Mi consumo de agua | Mi Agua Riojana" },
      {
        property: "og:description",
        content:
          "Consumo diario, semanal y mensual, coste estimado y avisos de fuga para toda la familia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const iconos = {
  casa: Droplets,
  cocina: UtensilsCrossed,
  bano: ShowerHead,
  jardin: Sprout,
} as const;

function Kpi({
  etiqueta,
  valor,
  ayuda,
  destacado,
}: {
  etiqueta: string;
  valor: string;
  ayuda: string;
  destacado?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-soft ${
        destacado ? "border-primary/25 bg-primary text-primary-foreground" : "border-border bg-card"
      }`}
    >
      <p
        className={`text-sm font-medium ${destacado ? "text-primary-foreground/80" : "text-muted-foreground"}`}
      >
        {etiqueta}
      </p>
      <p className="mt-1 font-display text-3xl font-bold tabular-nums">{valor}</p>
      <p
        className={`mt-1 text-sm ${destacado ? "text-primary-foreground/75" : "text-muted-foreground"}`}
      >
        {ayuda}
      </p>
    </div>
  );
}

function Index() {
  const { config } = useConsumo();
  const [periodo, setPeriodo] = useState("dia");
  const dia = serieDiaria();
  const semana = serieSemanal();
  const mes = serieMensual();
  const consejo = consejos[new Date().getDate() % consejos.length];
  
  const objetivo = config.objetivoDiario;
  const hoy = config.consumoBaseDiario;
  const pct = Math.min(100, Math.round((hoy / objetivo) * 100));
  const mediaDiaria = Math.round(config.consumoBaseDiario * 0.95);
  const litrosMes = Math.round(config.consumoBaseDiario * 30);
  const gastoMes = coste(litrosMes);
  const avisos = notificacionesConsumo(hoy, objetivo, mediaDiaria);
  const fuga = deteccionFuga(dia);

  const nivelAviso = {
    alta: "border-destructive/35 bg-destructive/10",
    media: "border-warning/45 bg-warning/15",
    info: "border-border bg-surface",
  } as const;

  const desglosadoFamilia = [
    { nombre: "Casa (total)", litros: config.consumoBaseDiario, icono: "casa" },
    {
      nombre: "Cocina",
      litros: Math.round((config.consumoBaseDiario * config.distribucion.cocinaPct) / 100),
      icono: "cocina",
    },
    {
      nombre: "Baños",
      litros: Math.round((config.consumoBaseDiario * config.distribucion.banosPct) / 100),
      icono: "bano",
    },
    {
      nombre: "Jardín",
      litros: Math.round((config.consumoBaseDiario * config.distribucion.jardinPct) / 100),
      icono: "jardin",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <section className="rounded-3xl bg-gradient-agua p-6 shadow-soft sm:p-9">
          <Link
            to="/perfil"
            className="inline-flex items-center gap-2.5 rounded-full bg-surface/90 px-3.5 py-1.5 text-sm font-medium text-primary shadow-sm transition-all hover:bg-surface hover:shadow-md focus-ring"
            title="Ver perfil de la casa"
          >
            <img
              src={familiaProfile}
              alt={config.nombreFamilia}
              className="h-6 w-6 rounded-full border border-primary/30 object-cover"
            />
            <span>{config.nombreFamilia} · {config.integrantes} personas</span>
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-primary sm:text-4xl">
            Su consumo de agua, claro y al día
          </h1>
          <p className="mt-3 max-w-2xl text-base text-foreground/75 sm:text-lg">
            Mirá cuánta agua usás cada día, cada semana y cada mes. Pequeños gestos en casa se
            notan en la factura y en el río.
          </p>

          <div className="mt-6 max-w-md rounded-2xl bg-surface/85 p-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-medium text-foreground/80">Objetivo diario del hogar</span>
              <span className="font-display text-sm font-bold text-primary tabular-nums">
                {hoy.toLocaleString("es-AR")} / {objetivo.toLocaleString("es-AR")} L
              </span>
            </div>
            <Progress
              value={pct}
              aria-label={`Consumo de hoy: ${pct}% del objetivo diario`}
              className="mt-3 h-3"
            />
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <Kpi
            etiqueta="Hoy"
            valor={`${hoy.toLocaleString("es-ES")} L`}
            ayuda={`${Math.round(hoy / (config.integrantes || 1))} L por persona · ${ars(coste(hoy))}`}
            destacado
          />
          <Kpi
            etiqueta="Promedio por día"
            valor={`${Math.round(mediaDiaria).toLocaleString("es-AR")} L`}
            ayuda={`${ars(coste(mediaDiaria))} de gasto medio diario`}
          />
          <Kpi
            etiqueta="Esta semana"
            valor={`${total(semana).toLocaleString("es-AR")} L`}
            ayuda={`${ars(coste(total(semana)))} · 7 % menos que la anterior`}
          />
        </section>

        <section
          aria-labelledby="gasto-titulo"
          className="mt-4 grid gap-4 rounded-3xl border border-border bg-card p-5 shadow-soft sm:grid-cols-3 sm:p-7"
        >
          <div className="sm:col-span-3">
            <h2
              id="gasto-titulo"
              className="flex items-center gap-2 text-xl font-bold text-foreground"
            >
              <CircleDollarSign aria-hidden="true" className="h-5 w-5 text-teal" /> Gasto estimado
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tasa fija vigente: <strong>{ars(PRECIO_LITRO_ARS)} por litro</strong> (
              {ars(PRECIO_LITRO_ARS * 1000)} por m³). El importe se calcula automáticamente a
              partir de su consumo.
            </p>
          </div>
          <div className="rounded-2xl bg-secondary p-4">
            <p className="text-sm text-muted-foreground">Gasto de hoy</p>
            <p className="mt-1 font-display text-2xl font-bold tabular-nums text-primary">
              {ars(coste(hoy))}
            </p>
          </div>
          <div className="rounded-2xl bg-secondary p-4">
            <p className="text-sm text-muted-foreground">Gasto de la semana</p>
            <p className="mt-1 font-display text-2xl font-bold tabular-nums text-primary">
              {ars(coste(total(semana)))}
            </p>
          </div>
          <div className="rounded-2xl bg-secondary p-4">
            <p className="text-sm text-muted-foreground">
              Este mes ({litrosMes.toLocaleString("es-ES")} L)
            </p>
            <p className="mt-1 font-display text-2xl font-bold tabular-nums text-primary">
              {ars(gastoMes)}
            </p>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section
            aria-labelledby="avisos-titulo"
            className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-7"
          >
            <h2
              id="avisos-titulo"
              className="flex items-center gap-2 text-xl font-bold text-foreground"
            >
              <BellRing aria-hidden="true" className="h-5 w-5 text-teal" /> Notificaciones de consumo
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Avisos cuando superás el objetivo diario ({objetivo.toLocaleString("es-AR")} L) o
              el promedio ({Math.round(mediaDiaria).toLocaleString("es-AR")} L).
            </p>
            <ul className="mt-4 space-y-3">
              {avisos.map((a) => (
                <li key={a.id} className={`rounded-2xl border p-4 ${nivelAviso[a.nivel]}`}>
                  <p className="flex flex-wrap items-center justify-between gap-2 font-semibold text-foreground">
                    {a.titulo}
                    <span className="text-xs font-medium text-muted-foreground">{a.cuando}</span>
                  </p>
                  <p className="mt-1 text-sm text-foreground/80">{a.detalle}</p>
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-labelledby="fuga-titulo"
            className={`rounded-3xl border p-5 shadow-soft sm:p-7 ${
              fuga.sospecha ? "border-destructive/40 bg-destructive/10" : "border-border bg-card"
            }`}
          >
            <h2
              id="fuga-titulo"
              className="flex items-center gap-2 text-xl font-bold text-foreground"
            >
              <ShieldAlert
                aria-hidden="true"
                className={`h-5 w-5 ${fuga.sospecha ? "text-destructive" : "text-teal"}`}
              />
              Alerta de posible fuga
            </h2>
            {fuga.sospecha ? (
              <>
                <p className="mt-3 text-foreground/85">
                  Hemos detectado un consumo continuo de{" "}
                  <strong>{fuga.litrosHora} L/hora</strong> durante la madrugada, cuando no debería
                  haber uso de agua en casa. Podría tratarse de una fuga.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-foreground/80">
                  <li>
                    Pérdida estimada: <strong>{fuga.litrosDia.toLocaleString("es-AR")} L al día</strong>
                  </li>
                  <li>
                    Coste si continúa un mes: <strong>{ars(fuga.costeMes)}</strong>
                  </li>
                  <li>Revisá cisternas, grifos y el riego automático.</li>
                </ul>
              </>
            ) : (
              <p className="mt-3 text-foreground/85">
                Sin indicios de fuga: el consumo nocturno baja a{" "}
                <strong>{fuga.litrosHora} L/hora</strong>, dentro de lo normal.
              </p>
            )}
          </section>
        </div>


        <section className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-7">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">Evolución del consumo</h2>
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
              <p className="mb-3 text-sm text-muted-foreground">Litros por hora, hoy</p>
              <ConsumoChart datos={dia} />
            </TabsContent>
            <TabsContent value="semana" className="mt-6">
              <p className="mb-3 text-sm text-muted-foreground">Litros por día, esta semana</p>
              <ConsumoChart datos={semana} tipo="barras" />
            </TabsContent>
            <TabsContent value="mes" className="mt-6">
              <p className="mb-3 text-sm text-muted-foreground">Litros por mes, este año</p>
              <ConsumoChart datos={mes} />
            </TabsContent>
          </Tabs>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <section className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-7">
            <h2 className="text-xl font-bold text-foreground">¿En qué se usa el agua en casa?</h2>
            <ul className="mt-5 space-y-4">
              {desglosadoFamilia.map((f) => {
                const Icono = iconos[f.icono as keyof typeof iconos];
                const porcentaje = Math.round((f.litros / (desglosadoFamilia[0]?.litros || 1)) * 100);
                return (
                  <li key={f.nombre}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-3 font-medium text-foreground">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                          <Icono aria-hidden="true" className="h-5 w-5" />
                        </span>
                        {f.nombre}
                      </span>
                      <span className="font-display font-bold tabular-nums text-primary">
                        {f.litros.toLocaleString("es-ES")} L
                      </span>
                    </div>
                    <Progress
                      value={porcentaje}
                      aria-label={`${f.nombre}: ${porcentaje}% del consumo del hogar`}
                      className="mt-2 h-2"
                    />
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="rounded-3xl border border-teal/30 bg-secondary p-5 shadow-soft sm:p-7">
            <h2 className="flex items-center gap-2 text-xl font-bold text-primary">
              <TrendingDown aria-hidden="true" className="h-5 w-5" /> Consejo para ahorrar
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-foreground/85">{consejo}</p>
            <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
              {consejos.map((c) => (
                <li key={c} className="flex gap-2">
                  <Droplets aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                  {c}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      <footer className="border-t border-border bg-surface py-8">
        <p className="mx-auto max-w-6xl px-4 text-sm text-muted-foreground sm:px-6">
          Aguas Riojanas · Datos de consumo con fines demostrativos · Atención al cliente 900 000 000
        </p>
      </footer>
    </div>
  );
}
