import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useRef, useState } from "react";
import type { Punto } from "@/lib/consumo";

function useAncho() {
  const ref = useRef<HTMLDivElement>(null);
  const [ancho, setAncho] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setAncho(Math.round(entry.contentRect.width));
    });
    ro.observe(el);
    setAncho(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  return [ref, ancho] as const;
}

type Props = { datos: Punto[]; tipo?: "area" | "barras"; unidad?: string };

function CustomTooltip({ active, payload, label, unidad }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-soft">
      <p className="font-semibold text-foreground">{label}</p>
      <p className="text-primary">
        {payload[0].value.toLocaleString("es-ES")} {unidad}
      </p>
    </div>
  );
}

export function ConsumoChart({ datos, tipo = "area", unidad = "litros" }: Props) {
  const [ref, ancho] = useAncho();
  const alto = 300;
  const ejes = [
    <CartesianGrid
      key="grid"
      strokeDasharray="3 3"
      stroke="var(--color-border)"
      vertical={false}
    />,
    <XAxis
      key="x"
      dataKey="etiqueta"
      stroke="var(--color-muted-foreground)"
      fontSize={12}
      tickLine={false}
      axisLine={false}
      interval="preserveStartEnd"
      minTickGap={16}
    />,
    <YAxis
      key="y"
      stroke="var(--color-muted-foreground)"
      fontSize={12}
      tickLine={false}
      axisLine={false}
      width={48}
    />,
    <Tooltip key="tt" content={<CustomTooltip unidad={unidad} />} />,
  ];


  return (
    <div
      ref={ref}
      className="w-full"
      style={{ height: alto }}
      role="img"
      aria-label={`Gráfico de consumo en ${unidad}`}
    >
      <ResponsiveContainer width={ancho || 300} height={alto}>
        {tipo === "area" ? (
          <AreaChart data={datos} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="fillAgua" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            {ejes}
            <Area
              type="monotone"
              dataKey="litros"
              stroke="var(--color-primary)"
              strokeWidth={2.5}
              fill="url(#fillAgua)"
              isAnimationActive={false}
            />
          </AreaChart>
        ) : (
          <BarChart data={datos} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            {ejes}
            <Bar
              dataKey="litros"
              fill="var(--color-teal)"
              radius={[6, 6, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
