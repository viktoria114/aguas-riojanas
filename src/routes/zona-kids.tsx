import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Award, Check, ChevronLeft, ChevronRight, Coins, Sparkles, Star, Trophy } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { serieDiaria, total } from "@/lib/consumo";
import familiaProfile from "../assets/familia profile.jpg";
import insignia1 from "../assets/insignia1.png";
import insignia2 from "../assets/insignia2.png";
import insignia3 from "../assets/insignia3.png";
import insignia4 from "../assets/insignia4.png";
import saleOffer from "../assets/sale-offer-banner-with-hand-holding-phone-vector.jpg";
import tvFlyer from "../assets/smart-tv-flyer-design-template-db4502abbaebe6fac22cc5639464e16d_screen.jpg";
import superSale from "../assets/super-sale-discount-banner-template-promotion-vector.jpg";
import gotaenojada from "../assets/gotaenojada.png";
import gotaenojada2 from "../assets/gotaenojada2.png";
import gotafeliz from "../assets/gotafeliz.png";
import gotafeliz2 from "../assets/gotafeliz2.png";
import gotafeliz3 from "../assets/gotafeliz3.png";
import gotatriste from "../assets/gotatriste.png";
import gotatriste2 from "../assets/gotatriste2.png";

export const Route = createFileRoute("/zona-kids")({
  head: () => ({
    meta: [
      { title: "Zona Kids | Mi Agua Riojana" },
      {
        name: "description",
        content: "Una página divertida para que los niños aprendan a cuidar el agua con Gotita.",
      },
    ],
  }),
  component: ZonaKids,
});

type EstadoEmocion = "feliz" | "triste" | "enojado";

const mensajesPorEstado: Record<EstadoEmocion, string[]> = {
  feliz: [
    "¡Qué bien! Seguiste cuidando el agua como una superhéroe.",
    "Cada gota que ahorras ayuda a cuidar el planeta.",
    "¡Tu esfuerzo hace brillar a toda la ciudad!",
  ],
  triste: [
    "Hoy gastaste un poquito más de lo ideal, pero todavía puedes mejorar.",
    "Un pequeño cambio puede ayudar mucho a ahorrar agua.",
    "¡Vamos, tú puedes volver a ahorrar!",
  ],
  enojado: [
    "¡Ups! Se está escapando mucha agua, pero aún puedes corregirlo.",
    "Cierra el grifo y cuida cada gota como un campeón.",
    "¡Tú puedes hacerlo mejor y ahorrar más!",
  ],
};

const variantesPorEstado: Record<EstadoEmocion, string[]> = {
  feliz: [gotafeliz, gotafeliz2, gotafeliz3],
  triste: [gotatriste, gotatriste2],
  enojado: [gotaenojada, gotaenojada2],
};

function ZonaKids() {
  const [variantIndex, setVariantIndex] = useState(0);
  const [puntosGastados, setPuntosGastados] = useState(0);
  const [recompensaSeleccionada, setRecompensaSeleccionada] = useState<string | null>(null);
  const [recompensaModal, setRecompensaModal] = useState<string | null>(null);
  const objetivo = 3000;
  const hoy = total(serieDiaria());
  const pct = Math.min(100, Math.round((hoy / objetivo) * 100));

  let estado: EstadoEmocion = "feliz";
  if (hoy > objetivo * 1.1) {
    estado = "enojado";
  } else if (hoy > objetivo) {
    estado = "triste";
  }

  const variantes = variantesPorEstado[estado];
  const mensaje = mensajesPorEstado[estado][variantIndex % mensajesPorEstado[estado].length];
  const imagenActual = variantes[variantIndex % variantes.length];

  const ahorrosLitros = Math.max(0, objetivo - hoy);
  const puntosBase = Math.max(0, Math.round(ahorrosLitros / 10));
  const puntos = Math.max(0, puntosBase - puntosGastados);
  const racha = estado === "feliz" ? 7 : estado === "triste" ? 3 : 1;
  const xpActual = 180 + puntos * 12;
  const xpMeta = 500;
  const progressXp = Math.min(100, Math.round((xpActual / xpMeta) * 100));

  const insignias = useMemo(
    () => [
      { nombre: "Verano 2025", detalle: "Participaste en la campaña de verano", activo: true },
      { nombre: "Competencia Barrial 2026", detalle: "Ganaste por tu compromiso con el agua", activo: true },
      { nombre: "Racha de 7 días", detalle: "Mantuviste el consumo bajo el umbral", activo: racha >= 7 },
    ],
    [racha],
  );

  const tienda = [
    { nombre: "Participación sorteo televisión", puntos: 180, descripcion: "Tu entrada para un sorteo mensual" },
    { nombre: "Pase de feria familiar", puntos: 260, descripcion: "Canjea un ticket para la próxima feria" },
    { nombre: "Pack de stickers Gotita", puntos: 120, descripcion: "Colección de stickers para tus desafíos" },
  ];

  useEffect(() => {
    setVariantIndex(0);
  }, [estado]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
        <section className="rounded-[2rem] border border-primary/15 bg-gradient-to-br from-primary/10 via-sky-50 to-cyan-100 p-6 shadow-soft sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Zona Kids</p>
              <h1 className="mt-2 text-4xl font-black text-primary sm:text-5xl">
                Tu aventura por ahorrar agua empieza aquí
              </h1>
              <p className="mt-3 text-base text-foreground/75 sm:text-lg">
                Cada gota que cuidas se convierte en puntos, retos y premios para toda la familia.
              </p>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-white/80 px-4 py-3 shadow-sm">
              <p className="text-sm font-semibold text-primary">Puntos hoy</p>
              <p className="mt-1 text-3xl font-black text-primary">{puntos}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 rounded-3xl border border-border bg-card p-5 shadow-soft lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
          <div className="flex flex-col justify-center">
            <div className="rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-100 p-5 shadow-sm">
              <p className="text-sm font-semibold text-sky-800">Mensaje de Gotita</p>
              <div className="mt-3 rounded-2xl bg-white/90 p-4 shadow-sm">
                <p className="text-lg font-semibold text-sky-900">{mensaje}</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-border bg-surface/80 p-4">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-medium text-foreground/80">Objetivo diario</span>
                <span className="text-sm font-bold text-primary">
                  {hoy.toLocaleString("es-AR")} / {objetivo.toLocaleString("es-AR")} L
                </span>
              </div>
              <Progress value={pct} className="mt-3 h-3" aria-label="Progreso del consumo diario" />
            </div>

            <div className="mt-4 rounded-2xl border border-border bg-surface p-4 text-sm text-muted-foreground">
              {estado === "feliz" && "¡Estás dentro del objetivo! Sigue así para ahorrar más."}
              {estado === "triste" && "Te estás acercando al límite, pero aún puedes hacerlo mejor."}
              {estado === "enojado" && "Tu consumo está por encima de lo recomendado. Cuidar cada gota ayuda."}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-surface/80 p-6">
            <button
              type="button"
              onClick={() => setVariantIndex((prev) => prev + 1)}
              className="rounded-full transition-transform hover:scale-105 focus-ring"
              aria-label="Cambiar la expresión de Gotita"
            >
              <img src={imagenActual} alt={`Gotita ${estado}`} className="h-64 w-64 object-contain" />
            </button>
            <p className="mt-4 text-center text-sm font-medium text-muted-foreground">
              Haz clic en Gotita para ver otra versión de su {estado} expresión.
            </p>
            <Link
              to="/"
              className="mt-4 rounded-full border border-primary/25 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
            >
              Volver a mi consumo
            </Link>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-primary">Perfil de la casa</p>
                <h2 className="text-xl font-bold text-foreground">Nivel del usuario</h2>
              </div>
              <Link
                to="/perfil"
                className="rounded-full bg-primary/10 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/20"
              >
                Ver perfil
              </Link>
            </div>

            <div className="mt-5 rounded-2xl bg-gradient-to-br from-sky-50 to-cyan-100 p-4">
              <div className="flex items-center gap-3">
                <img
                  src={familiaProfile}
                  alt="Familia del perfil"
                  className="h-16 w-16 rounded-full border-2 border-white object-cover shadow-sm"
                />
                <div>
                  <p className="font-semibold text-foreground">Casa Río</p>
                  <p className="text-sm text-muted-foreground">Nivel 5 · Ahorrador en ascenso</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                  <span>XP acumulado</span>
                  <span>{xpActual}/{xpMeta}</span>
                </div>
                <Progress value={progressXp} className="mt-2 h-3" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Racha de consumo adecuado</h2>
            </div>
            <div className="mt-4 rounded-2xl bg-surface p-4">
              <div className="flex items-center justify-between rounded-full bg-background px-3 py-2 text-sm font-medium text-muted-foreground">
                <button type="button" className="rounded-full p-1 hover:bg-accent">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <p className="font-semibold text-foreground">Hoy · 1/8</p>
                <button type="button" className="rounded-full p-1 hover:bg-accent">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 grid grid-cols-7 gap-2">
                {[
                  { fecha: "31/7", activo: true },
                  { fecha: "1/8", activo: true },
                  { fecha: "2/8", activo: false },
                  { fecha: "3/8", activo: false },
                  { fecha: "4/8", activo: false },
                  { fecha: "5/8", activo: false },
                  { fecha: "6/8", activo: false },
                ].map((dia) => (
                  <div
                    key={dia.fecha}
                    className={`flex h-11 flex-col items-center justify-center rounded-xl border text-xs font-semibold ${dia.activo ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted text-muted-foreground"}`}
                  >
                    {dia.activo ? <Check className="h-4 w-4" /> : <span>{dia.fecha}</span>}
                    <span className="mt-1">{dia.fecha}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {estado === "feliz"
                  ? "¡Sigue así y mantén la racha!"
                  : "Un día más con buen consumo te acerca a la siguiente meta."}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-primary">Puntos y recompensas</p>
              <h2 className="text-xl font-bold text-foreground">Por cada m³ ahorrado sumas puntos</h2>
            </div>
            <div className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm">
              {puntos} puntos disponibles
            </div>
          </div>
          <div className="mt-5 grid gap-4 rounded-2xl bg-surface p-4 md:grid-cols-[1fr_0.9fr]">
            <div className="rounded-2xl border border-border bg-background p-4">
              <div className="flex items-center gap-2 text-primary">
                <Coins className="h-5 w-5" />
                <p className="font-semibold">Ahorraste {ahorrosLitros.toLocaleString("es-AR")} L hoy</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Por cada 10 litros ahorrados ganas 1 punto. Este valor se suma a tu saldo para canjear recompensas.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-4">
              <div className="flex items-center gap-2 text-primary">
                <Star className="h-5 w-5" />
                <p className="font-semibold">Tu recompensa actual</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Ahorro de {ahorrosLitros.toLocaleString("es-AR")} L = {puntos} puntos para canjear hoy.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-7">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Insignias acumuladas</h2>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { nombre: "Verano 2025", detalle: "Participaste en la campaña de verano", activo: true, imagen: insignia1 },
              { nombre: "Competencia Barrial 2026", detalle: "Ganaste por tu compromiso con el agua", activo: true, imagen: insignia2 },
              { nombre: "Racha de 7 días", detalle: "Mantuviste el consumo bajo el umbral", activo: racha >= 7, imagen: insignia3 },
              { nombre: "Eco hogar", detalle: "Tu casa ahorra cada semana", activo: true, imagen: insignia4 },
            ].map((insignia) => (
              <div
                key={insignia.nombre}
                className={`rounded-2xl border p-4 ${insignia.activo ? "border-primary/25 bg-primary/10" : "border-border bg-surface"}`}
              >
                <img src={insignia.imagen} alt={insignia.nombre} className="h-20 w-full rounded-xl object-contain" />
                <p className="mt-3 font-semibold text-foreground">{insignia.nombre}</p>
                <p className="mt-1 text-sm text-muted-foreground">{insignia.detalle}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-primary">Tienda de recompensas</p>
              <h2 className="text-xl font-bold text-foreground">Canjea tus puntos</h2>
            </div>
            <div className="rounded-full bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-700">
              Saldo: {puntos} pts
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              { nombre: "Participación sorteo televisión", puntos: 180, descripcion: "Tu entrada para un sorteo mensual", imagen: tvFlyer },
              { nombre: "Flyer de ofertas", puntos: 140, descripcion: "Canjea un voucher para comprar en la feria", imagen: saleOffer },
              { nombre: "Descuento en productos eco", puntos: 220, descripcion: "Cupón especial para artículos de ahorro", imagen: superSale },
            ].map((item) => (
              <div key={item.nombre} className="rounded-2xl border border-border bg-surface p-4">
                <img src={item.imagen} alt={item.nombre} className="h-28 w-full rounded-xl object-cover" />
                <p className="mt-3 font-semibold text-foreground">{item.nombre}</p>
                <p className="mt-2 text-sm text-muted-foreground">{item.descripcion}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                    {item.puntos} pts
                  </span>
                  <button
                    type="button"
                    className="rounded-full bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                    onClick={() => {
                      if (puntos >= item.puntos) {
                        setPuntosGastados((prev) => prev + item.puntos);
                        setRecompensaSeleccionada(item.nombre);
                        setRecompensaModal(item.nombre);
                      } else {
                        setRecompensaSeleccionada(item.nombre);
                        setRecompensaModal(`sin-puntos-${item.nombre}`);
                      }
                    }}
                    disabled={puntos < item.puntos}
                  >
                    {puntos >= item.puntos ? "Canjear" : "Sin puntos"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Dialog open={Boolean(recompensaModal)} onOpenChange={() => setRecompensaModal(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>¡Recompensa reservada!</DialogTitle>
            <DialogDescription>
              {recompensaModal?.startsWith("sin-puntos")
                ? "No tienes puntos suficientes para este premio en este momento."
                : recompensaSeleccionada
                  ? `Ya estás participando por ${recompensaSeleccionada.toLowerCase()}.`
                  : "Tu canje se ha registrado correctamente."}
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-2xl bg-primary/10 p-4 text-sm text-foreground">
            <p className="font-semibold text-primary">
              {recompensaModal?.startsWith("sin-puntos")
                ? "No hay saldo suficiente"
                : "¡Tu punto se usó con éxito!"}
            </p>
            <p className="mt-2 text-muted-foreground">
              {recompensaModal?.startsWith("sin-puntos")
                ? "Sigue ahorrando agua para acumular más puntos y volver a intentarlo."
                : "El cambio se registró en tu perfil y podrás ver el estado de la recompensa en la próxima visita."}
            </p>
          </div>
          <DialogFooter>
            <button
              type="button"
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              onClick={() => setRecompensaModal(null)}
            >
              Entendido
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
