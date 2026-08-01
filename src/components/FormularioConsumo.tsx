import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zonas } from "@/lib/consumo";

export type Registro = {
  zona: string;
  fecha: string;
  litros: number;
  hogares: number;
};

const esquema = z.object({
  zona: z.string().trim().min(1, "Selecciona una zona"),
  fecha: z.string().trim().min(1, "Indica la fecha"),
  litros: z.coerce.number().positive("Los litros deben ser mayores que 0").max(100_000_000),
  hogares: z.coerce.number().int().positive("Indica el número de hogares").max(1_000_000),
});

export function FormularioConsumo({ onAdd }: { onAdd: (r: Registro) => void }) {
  const [abierto, setAbierto] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(e.currentTarget));
    const res = esquema.safeParse(datos);
    if (!res.success) {
      setError(res.error.issues[0]?.message ?? "Revisa los datos introducidos");
      return;
    }
    setError(null);
    onAdd(res.data);
    setAbierto(false);
    toast.success("Registro de consumo añadido");
  }

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus aria-hidden="true" className="h-4 w-4" /> Añadir datos de consumo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Añadir datos de consumo</DialogTitle>
          <DialogDescription>
            Registra una lectura agregada de consumo para una zona de servicio.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={enviar} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="zona">Zona</Label>
            <Select name="zona" defaultValue={zonas[0]?.zona ?? ""}>
              <SelectTrigger id="zona">
                <SelectValue placeholder="Selecciona una zona" />
              </SelectTrigger>
              <SelectContent>
                {zonas.map((z) => (
                  <SelectItem key={z.zona} value={z.zona}>
                    {z.zona}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fecha">Fecha de lectura</Label>
            <Input
              id="fecha"
              name="fecha"
              type="date"
              required
              defaultValue={new Date().toISOString().slice(0, 10)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="litros">Litros consumidos</Label>
              <Input id="litros" name="litros" type="number" min={1} step={1} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hogares">Hogares medidos</Label>
              <Input id="hogares" name="hogares" type="number" min={1} step={1} required />
            </div>
          </div>
          {error ? (
            <p role="alert" className="text-sm font-medium text-destructive">
              {error}
            </p>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAbierto(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar registro</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
