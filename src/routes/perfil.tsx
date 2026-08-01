import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Coins, Sparkles, Trophy } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Progress } from "@/components/ui/progress";
import familiaProfile from "../assets/familia profile.jpg";

import { useConsumo } from "@/context/ConsumoContext";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil de la casa | Mi Agua Riojana" },
      {
        name: "description",
        content: "Perfil familiar con nivel, XP y datos de progreso para ahorrar agua.",
      },
    ],
  }),
  component: Perfil,
});

function Perfil() {
  const { config } = useConsumo();
  const ahorroEstimado = Math.max(0, config.objetivoDiario - config.consumoBaseDiario);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
        <section className="rounded-[2rem] border border-border bg-card p-6 shadow-soft sm:p-8">
          <div className="flex flex-col items-center text-center sm:flex-row sm:text-left">
            <img
              src={familiaProfile}
              alt={config.nombreFamilia}
              className="h-36 w-36 rounded-full border-4 border-primary/20 object-cover shadow-lg sm:h-44 sm:w-44"
            />
            <div className="mt-5 sm:ml-6 sm:mt-0">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Perfil de la casa</p>
              <h1 className="mt-2 text-3xl font-black text-foreground sm:text-4xl">{config.nombreFamilia}</h1>
              <p className="mt-2 text-lg font-semibold text-primary">Nivel 5 · Ahorrador en ascenso</p>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
                Tu hogar ha ahorrado agua durante varias semanas y ya está cerca de desbloquear nuevas recompensas.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 rounded-2xl bg-surface p-4 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-sm font-semibold text-primary">XP acumulado</p>
              <p className="mt-2 text-2xl font-black text-foreground">320 / 500</p>
              <Progress value={64} className="mt-3 h-3" />
            </div>
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-sm font-semibold text-primary">Racha actual</p>
              <p className="mt-2 text-2xl font-black text-foreground">7 días</p>
              <p className="mt-2 text-sm text-muted-foreground">Consumo dentro del objetivo durante toda la semana.</p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-sm font-semibold text-primary">Puntos disponibles</p>
              <p className="mt-2 text-2xl font-black text-foreground">84 pts</p>
              <p className="mt-2 text-sm text-muted-foreground">Listos para canjear en la tienda.</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-7">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Logros destacados</h2>
            </div>
            <div className="mt-4 space-y-3">
              {[
                "Verano 2025",
                "Competencia Barrial 2026",
                "Racha de 7 días",
              ].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3">
                  <span className="font-medium text-foreground">{item}</span>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">Activo</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-7">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Resumen familiar</h2>
            </div>
            <div className="mt-4 rounded-2xl bg-gradient-to-br from-sky-50 to-cyan-100 p-4 text-sm text-foreground/80">
              <p>{config.integrantes} integrantes en la casa</p>
              <p className="mt-2">Objetivo diario: {config.objetivoDiario.toLocaleString("es-AR")} L</p>
              <p className="mt-2">Consumo de hoy: {config.consumoBaseDiario.toLocaleString("es-AR")} L</p>
              <p className="mt-2">Ahorro estimado: {ahorroEstimado.toLocaleString("es-AR")} L</p>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-border bg-surface p-4">
              <Coins className="h-5 w-5 text-primary" />
              <p className="text-sm text-muted-foreground">Tu hogar ya acumula recompensas para el próximo sorteo y descuentos.</p>
            </div>
          </div>
        </section>

        <div className="flex justify-start">
          <Link
            to="/zona-kids"
            className="rounded-full border border-primary/25 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            Volver a Zona Kids
          </Link>
        </div>
      </main>
    </div>
  );
}
