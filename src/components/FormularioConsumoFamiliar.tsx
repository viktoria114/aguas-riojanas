import { useConsumo } from "@/context/ConsumoContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Users,
  Target,
  Droplets,
  RotateCcw,
  Sparkles,
  Zap,
  Leaf,
  CircleDollarSign,
  PieChart,
} from "lucide-react";
import { ars, coste } from "@/lib/consumo";

export function FormularioConsumoFamiliar() {
  const { config, updateConfig, updateDistribucion, resetConfig, aplicarPreset } =
    useConsumo();

  const litrosPorPersona = Math.round(config.objetivoDiario / (config.integrantes || 1));
  const gastoDiarioBase = coste(config.consumoBaseDiario);
  const gastoMensualEstimado = coste(config.consumoBaseDiario * 30);

  const handlePreset = (tipo: "eco" | "estandar" | "alto", nombre: string) => {
    aplicarPreset(tipo);
    toast.success(`Preset "${nombre}" aplicado a toda la aplicación`);
  };

  const handleReset = () => {
    resetConfig();
    toast.info("Configuración restablecida a los valores por defecto");
  };

  return (
    <div className="rounded-3xl border border-primary/20 bg-card p-6 shadow-soft sm:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-teal/40 bg-teal/10 text-teal">
              <Sparkles className="mr-1 h-3.5 w-3.5" /> Administrador de Parámetros
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Afecta a toda la App
            </Badge>
          </div>
          <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
            Control de Consumo Familiar
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ajustá el nombre del hogar, integrantes, metas diarias de consumo y su distribución.
            Los cambios se actualizan en tiempo real en la vista familiar y en el panel general.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" /> Restablecer
        </Button>
      </div>

      {/* Quick Presets */}
      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Preajustes Rápidos de Consumo
        </p>
        <div className="mt-2.5 grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => handlePreset("eco", "Eco-Ahorro")}
            className={`flex items-center justify-between rounded-2xl border p-4 text-left transition-all ${
              config.objetivoDiario === 1600
                ? "border-success bg-success/10 text-foreground ring-2 ring-success/20"
                : "border-border bg-surface hover:border-success/50 hover:bg-accent"
            }`}
          >
            <div>
              <div className="flex items-center gap-1.5 font-semibold text-success">
                <Leaf className="h-4 w-4" /> Eco-Ahorro
              </div>
              <p className="mt-1 text-xs text-muted-foreground">1.600 L/día (400 L/pers)</p>
            </div>
            <Badge variant="secondary" className="bg-success/15 text-success">
              1.600 L
            </Badge>
          </button>

          <button
            type="button"
            onClick={() => handlePreset("estandar", "Estándar")}
            className={`flex items-center justify-between rounded-2xl border p-4 text-left transition-all ${
              config.objetivoDiario === 2400
                ? "border-primary bg-primary/10 text-foreground ring-2 ring-primary/20"
                : "border-border bg-surface hover:border-primary/50 hover:bg-accent"
            }`}
          >
            <div>
              <div className="flex items-center gap-1.5 font-semibold text-primary">
                <Zap className="h-4 w-4" /> Estándar
              </div>
              <p className="mt-1 text-xs text-muted-foreground">2.400 L/día (600 L/pers)</p>
            </div>
            <Badge variant="secondary" className="bg-primary/15 text-primary">
              2.400 L
            </Badge>
          </button>

          <button
            type="button"
            onClick={() => handlePreset("alto", "Alto Consumo")}
            className={`flex items-center justify-between rounded-2xl border p-4 text-left transition-all ${
              config.objetivoDiario === 3600
                ? "border-warning bg-warning/10 text-foreground ring-2 ring-warning/20"
                : "border-border bg-surface hover:border-warning/50 hover:bg-accent"
            }`}
          >
            <div>
              <div className="flex items-center gap-1.5 font-semibold text-warning">
                <Droplets className="h-4 w-4" /> Alto Consumo
              </div>
              <p className="mt-1 text-xs text-muted-foreground">3.600 L/día (900 L/pers)</p>
            </div>
            <Badge variant="secondary" className="bg-warning/15 text-warning">
              3.600 L
            </Badge>
          </button>
        </div>
      </div>

      {/* Main Grid Controls */}
      <div className="mt-7 grid gap-6 md:grid-cols-2">
        {/* Left Column: Identificación & Integrantes */}
        <div className="space-y-5 rounded-2xl border border-border bg-surface/50 p-5">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Users className="h-5 w-5 text-teal" />
            <h3 className="font-semibold text-foreground">Identificación del Hogar</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombreFamilia" className="text-sm font-medium">
              Nombre de la Familia u Hogar
            </Label>
            <Input
              id="nombreFamilia"
              type="text"
              value={config.nombreFamilia}
              onChange={(e) => updateConfig({ nombreFamilia: e.target.value })}
              placeholder="Ej. Familia Ruiz"
              className="bg-card"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <Label htmlFor="integrantes" className="font-medium">
                Cantidad de Integrantes
              </Label>
              <span className="font-bold text-primary tabular-nums">
                {config.integrantes} personas
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Slider
                id="integrantes"
                min={1}
                max={10}
                step={1}
                value={[config.integrantes]}
                onValueChange={([val]) => {
                  if (typeof val === "number") updateConfig({ integrantes: val });
                }}
                className="flex-1"
              />
              <Input
                type="number"
                min={1}
                max={10}
                value={config.integrantes}
                onChange={(e) =>
                  updateConfig({ integrantes: Math.max(1, parseInt(e.target.value) || 1) })
                }
                className="w-20 text-center font-bold bg-card"
              />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Consumo por persona derivado</p>
            <p className="mt-1 font-display text-2xl font-bold text-primary tabular-nums">
              {litrosPorPersona.toLocaleString("es-AR")} L{" "}
              <span className="text-sm font-normal text-muted-foreground">/ persona / día</span>
            </p>
          </div>
        </div>

        {/* Right Column: Objetivos y Mediciones */}
        <div className="space-y-5 rounded-2xl border border-border bg-surface/50 p-5">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Metas y Consumo Base</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <Label htmlFor="objetivoDiario" className="font-medium">
                Objetivo Diario del Hogar (L)
              </Label>
              <span className="font-bold text-primary tabular-nums">
                {config.objetivoDiario.toLocaleString("es-AR")} L/día
              </span>
            </div>
            <Slider
              id="objetivoDiario"
              min={800}
              max={6000}
              step={50}
              value={[config.objetivoDiario]}
              onValueChange={([val]) => {
                if (typeof val === "number") updateConfig({ objetivoDiario: val });
              }}
            />
            <Input
              type="number"
              min={500}
              max={10000}
              step={50}
              value={config.objetivoDiario}
              onChange={(e) =>
                updateConfig({ objetivoDiario: Math.max(100, parseInt(e.target.value) || 0) })
              }
              className="bg-card font-bold tabular-nums"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="consumoBaseDiario" className="text-sm font-medium">
              Consumo Diario Registrado/Base (L)
            </Label>
            <Input
              id="consumoBaseDiario"
              type="number"
              min={100}
              max={15000}
              step={10}
              value={config.consumoBaseDiario}
              onChange={(e) =>
                updateConfig({ consumoBaseDiario: Math.max(0, parseInt(e.target.value) || 0) })
              }
              className="bg-card font-bold tabular-nums"
            />
            <p className="text-xs text-muted-foreground">
              Este valor define el consumo actual utilizado para calcular la facturación y la barra de progreso en la app.
            </p>
          </div>
        </div>
      </div>

      {/* Distribution by Room / Use Case */}
      <div className="mt-6 rounded-2xl border border-border bg-surface/50 p-5">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <PieChart className="h-5 w-5 text-teal" />
          <h3 className="font-semibold text-foreground">Distribución del Agua en Casa (%)</h3>
        </div>

        <div className="mt-4 grid gap-6 sm:grid-cols-3">
          {/* Cocina */}
          <div className="space-y-2 rounded-xl border border-border bg-card p-4">
            <div className="flex justify-between text-sm font-medium">
              <span>Cocina</span>
              <span className="font-bold text-primary">{config.distribucion.cocinaPct}%</span>
            </div>
            <Slider
              min={5}
              max={80}
              step={5}
              value={[config.distribucion.cocinaPct]}
              onValueChange={([val]) => {
                if (typeof val === "number") updateDistribucion({ cocinaPct: val });
              }}
            />
            <p className="text-xs text-muted-foreground tabular-nums">
              ≈ {Math.round((config.consumoBaseDiario * config.distribucion.cocinaPct) / 100).toLocaleString("es-AR")} L/día
            </p>
          </div>

          {/* Baños */}
          <div className="space-y-2 rounded-xl border border-border bg-card p-4">
            <div className="flex justify-between text-sm font-medium">
              <span>Baños</span>
              <span className="font-bold text-primary">{config.distribucion.banosPct}%</span>
            </div>
            <Slider
              min={5}
              max={80}
              step={5}
              value={[config.distribucion.banosPct]}
              onValueChange={([val]) => {
                if (typeof val === "number") updateDistribucion({ banosPct: val });
              }}
            />
            <p className="text-xs text-muted-foreground tabular-nums">
              ≈ {Math.round((config.consumoBaseDiario * config.distribucion.banosPct) / 100).toLocaleString("es-AR")} L/día
            </p>
          </div>

          {/* Jardín */}
          <div className="space-y-2 rounded-xl border border-border bg-card p-4">
            <div className="flex justify-between text-sm font-medium">
              <span>Jardín / Exterior</span>
              <span className="font-bold text-primary">{config.distribucion.jardinPct}%</span>
            </div>
            <Slider
              min={0}
              max={80}
              step={5}
              value={[config.distribucion.jardinPct]}
              onValueChange={([val]) => {
                if (typeof val === "number") updateDistribucion({ jardinPct: val });
              }}
            />
            <p className="text-xs text-muted-foreground tabular-nums">
              ≈ {Math.round((config.consumoBaseDiario * config.distribucion.jardinPct) / 100).toLocaleString("es-AR")} L/día
            </p>
          </div>
        </div>
      </div>

      {/* Live Preview Card */}
      <div className="mt-6 rounded-2xl bg-gradient-agua p-5 shadow-soft">
        <div className="flex items-center gap-2 font-bold text-primary">
          <CircleDollarSign className="h-5 w-5" /> Vista Previa en Vivo (Impacto en la App)
        </div>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-surface/80 p-3.5">
            <p className="text-xs font-medium text-muted-foreground">Familia Configurada</p>
            <p className="mt-0.5 text-lg font-bold text-foreground">
              {config.nombreFamilia} ({config.integrantes} personas)
            </p>
          </div>
          <div className="rounded-xl bg-surface/80 p-3.5">
            <p className="text-xs font-medium text-muted-foreground">Gasto Diario Estimado</p>
            <p className="mt-0.5 font-display text-lg font-bold text-primary tabular-nums">
              {ars(gastoDiarioBase)}
            </p>
          </div>
          <div className="rounded-xl bg-surface/80 p-3.5">
            <p className="text-xs font-medium text-muted-foreground">Proyección Mensual</p>
            <p className="mt-0.5 font-display text-lg font-bold text-primary tabular-nums">
              {ars(gastoMensualEstimado)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
