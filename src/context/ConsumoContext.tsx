import React, { createContext, useContext, useState, useEffect } from "react";

export interface DistribucionUso {
  cocinaPct: number;
  banosPct: number;
  jardinPct: number;
}

export interface ConfigFamiliar {
  nombreFamilia: string;
  integrantes: number;
  objetivoDiario: number;
  consumoBaseDiario: number;
  distribucion: DistribucionUso;
}

export const CONFIG_DEFAULT: ConfigFamiliar = {
  nombreFamilia: "Familia Ruiz",
  integrantes: 4,
  objetivoDiario: 2400,
  consumoBaseDiario: 2410,
  distribucion: {
    cocinaPct: 25,
    banosPct: 50,
    jardinPct: 25,
  },
};

const STORAGE_KEY = "aguas_riojanas_consumo_config_v1";

interface ConsumoContextType {
  config: ConfigFamiliar;
  updateConfig: (newConfig: Partial<ConfigFamiliar>) => void;
  updateDistribucion: (dist: Partial<DistribucionUso>) => void;
  resetConfig: () => void;
  aplicarPreset: (preset: "eco" | "estandar" | "alto") => void;
}

const ConsumoContext = createContext<ConsumoContextType | undefined>(undefined);

export const ConsumoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ConfigFamiliar>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return { ...CONFIG_DEFAULT, ...parsed };
        }
      } catch (e) {
        console.error("Error reading consumo config from localStorage", e);
      }
    }
    return CONFIG_DEFAULT;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      } catch (e) {
        console.error("Error saving consumo config to localStorage", e);
      }
    }
  }, [config]);

  const updateConfig = (newConfig: Partial<ConfigFamiliar>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const updateDistribucion = (dist: Partial<DistribucionUso>) => {
    setConfig((prev) => ({
      ...prev,
      distribucion: { ...prev.distribucion, ...dist },
    }));
  };

  const resetConfig = () => {
    setConfig(CONFIG_DEFAULT);
  };

  const aplicarPreset = (preset: "eco" | "estandar" | "alto") => {
    if (preset === "eco") {
      setConfig((prev) => ({
        ...prev,
        objetivoDiario: 1600,
        consumoBaseDiario: 1550,
        distribucion: { cocinaPct: 30, banosPct: 55, jardinPct: 15 },
      }));
    } else if (preset === "estandar") {
      setConfig((prev) => ({
        ...prev,
        objetivoDiario: 2400,
        consumoBaseDiario: 2410,
        distribucion: { cocinaPct: 25, banosPct: 50, jardinPct: 25 },
      }));
    } else if (preset === "alto") {
      setConfig((prev) => ({
        ...prev,
        objetivoDiario: 3600,
        consumoBaseDiario: 3500,
        distribucion: { cocinaPct: 20, banosPct: 45, jardinPct: 35 },
      }));
    }
  };

  return (
    <ConsumoContext.Provider
      value={{
        config,
        updateConfig,
        updateDistribucion,
        resetConfig,
        aplicarPreset,
      }}
    >
      {children}
    </ConsumoContext.Provider>
  );
};

export const useConsumo = () => {
  const context = useContext(ConsumoContext);
  if (!context) {
    throw new Error("useConsumo debe ser usado dentro de un ConsumoProvider");
  }
  return context;
};
