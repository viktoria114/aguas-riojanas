import { HORAS_MAPA, mapaCalor } from "@/lib/consumo";

const maximo = Math.max(...mapaCalor.flatMap((f) => f.valores));

function tono(v: number) {
  const p = v / maximo;
  if (p > 0.85) return "bg-primary text-primary-foreground";
  if (p > 0.65) return "bg-primary/75 text-primary-foreground";
  if (p > 0.45) return "bg-primary/50 text-foreground";
  if (p > 0.3) return "bg-primary/30 text-foreground";
  return "bg-primary/12 text-foreground";
}

export function MapaCalor() {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">
            Mapa de calor por zona y hora
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Litros medios por hogar en cada tramo horario. Los tonos intensos marcan las horas punta.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          Bajo
          <span className="h-3 w-6 rounded bg-primary/12" />
          <span className="h-3 w-6 rounded bg-primary/30" />
          <span className="h-3 w-6 rounded bg-primary/50" />
          <span className="h-3 w-6 rounded bg-primary/75" />
          <span className="h-3 w-6 rounded bg-primary" />
          Alto
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[560px] border-separate border-spacing-1">
          <caption className="sr-only">
            Consumo medio por hogar en litros, por zona de servicio y tramo horario
          </caption>
          <thead>
            <tr>
              <th scope="col" className="text-left text-sm font-medium text-muted-foreground">
                Zona
              </th>
              {HORAS_MAPA.map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="text-center text-xs font-medium text-muted-foreground"
                >
                  {h}h
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mapaCalor.map((fila) => (
              <tr key={fila.zona}>
                <th
                  scope="row"
                  className="whitespace-nowrap pr-2 text-left text-sm font-medium text-foreground"
                >
                  {fila.zona}
                </th>
                {fila.valores.map((v, i) => (
                  <td key={i} className="p-0">
                    <div
                      className={`rounded-lg px-2 py-3 text-center text-xs font-semibold tabular-nums ${tono(v)}`}
                      title={`${fila.zona} · ${HORAS_MAPA[i]}h · ${v} L`}
                    >
                      {v}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
