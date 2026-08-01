import { Link } from "@tanstack/react-router";
import logo from "../assets/aguas-riojanas-logo.png";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-3 rounded-lg focus-ring">
          <img
            src={logo}
            alt="Mi Agua Riojana"
            width={48}
            height={48}
            className="h-11 w-11 shrink-0"
          />
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold text-primary">
              Mi Agua Riojana
            </span>
            <span className="block text-xs text-muted-foreground">Aguas Riojanas · en familia</span>
          </span>
        </Link>

        <nav aria-label="Navegación principal" className="flex items-center gap-1 text-sm">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className="rounded-lg px-3 py-2 font-medium text-foreground/80 transition-colors hover:bg-accent focus-ring data-[status=active]:bg-accent data-[status=active]:text-primary"
          >
            Mi consumo
          </Link>
          <Link
            to="/ranking"
            className="rounded-lg px-3 py-2 font-medium text-foreground/80 transition-colors hover:bg-accent focus-ring data-[status=active]:bg-accent data-[status=active]:text-primary"
          >
            Ranking &amp; IoT
          </Link>
          <Link
            to="/admin"
            className="rounded-lg px-3 py-2 font-medium text-foreground/80 transition-colors hover:bg-accent focus-ring data-[status=active]:bg-accent data-[status=active]:text-primary"
          >
            Administración
          </Link>
        </nav>
      </div>
    </header>
  );
}
