import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { RankingIoTDashboard } from "@/components/RankingIoTDashboard";

export const Route = createFileRoute("/ranking")({
  head: () => ({
    meta: [
      { title: "Ranking de Eficiencia Hídrica | Mi Agua Riojana" },
      {
        name: "description",
        content:
          "Ranking competitivo de eficiencia hídrica por zona, barrio y hogar en La Rioja Capital basándonos en lecturas de telemetría.",
      },
      {
        property: "og:title",
        content: "Ranking de Eficiencia Hídrica | Mi Agua Riojana",
      },
      {
        property: "og:description",
        content:
          "Ranking de eficiencia hídrica por zonas, barrios y hogares para La Rioja Capital.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RankingPage,
});

function RankingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <RankingIoTDashboard />
      </main>

      <footer className="border-t border-border bg-surface py-8">
        <p className="mx-auto max-w-6xl px-4 text-sm text-muted-foreground sm:px-6">
          Aguas Riojanas · Ranking y telemetría con fines demostrativos ·
          Atención al cliente 900 000 000
        </p>
      </footer>
    </div>
  );
}
