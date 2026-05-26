"use client";

import "flag-icons/css/flag-icons.min.css";
import { EQUIPOS, getPrefijo } from "@/lib/equipos";

// ── Bandera ──────────────────────────────────────────────────────────────────
type BanderaProps = { prefijo: string; size?: "sm" | "lg" };

export function Bandera({ prefijo, size = "sm" }: BanderaProps) {
  const equipo = EQUIPOS[prefijo];
  const fontSize = size === "lg" ? "1.25rem" : "0.95rem";
  if (!equipo)              return <span style={{ fontSize }}>🏳️</span>;
  if (!equipo.iso)          return <span style={{ fontSize }}>{equipo.emoji}</span>;
  return <span className={`fi fi-${equipo.iso} rounded-sm`} style={{ fontSize }} />;
}

// ── FiguPill ─────────────────────────────────────────────────────────────────
export type Variant = "verde" | "rojo" | "azul" | "gris";

const VARIANTES: Record<Variant, { pill: string; badge: string }> = {
  verde: { pill: "bg-green-50",  badge: "bg-green-200 text-green-800" },
  rojo:  { pill: "bg-red-50",   badge: "bg-red-200   text-red-800"   },
  azul:  { pill: "bg-blue-100", badge: "bg-blue-200  text-blue-800"  },
  gris:  { pill: "bg-gray-100", badge: "bg-gray-200  text-gray-700"  },
};

type FiguPillProps = {
  codigo: string;
  variant?: Variant;
  cantidad?: number;
  onRemove?: () => void;
  isRemoving?: boolean;
};

export default function FiguPill({ codigo, variant = "gris", cantidad, onRemove, isRemoving }: FiguPillProps) {
  const prefijo = getPrefijo(codigo);
  const { pill, badge } = VARIANTES[variant];

  return (
    <div className={`${pill} rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 transition-opacity ${isRemoving ? "opacity-40" : ""}`}>
      <Bandera prefijo={prefijo} />
      <span className="font-mono font-bold text-gray-700 text-xs">{codigo}</span>
      {cantidad !== undefined && cantidad > 1 && (
        <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${badge}`}>
          x{cantidad}
        </span>
      )}
      {onRemove && (
        isRemoving
          ? <span className="ml-0.5 inline-block w-3 h-3 border-2 border-red-300 border-t-transparent rounded-full animate-spin" />
          : <button onClick={onRemove} className="text-red-300 hover:text-red-500 text-xs font-bold ml-0.5 leading-none">✕</button>
      )}
    </div>
  );
}
