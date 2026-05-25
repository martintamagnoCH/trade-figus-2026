"use client";

import { useState } from "react";

type Props = {
  token: string;
  esCreador: boolean;
};

export default function BotonCopiarLink({ token, esCreador }: Props) {
  const [copiado, setCopiado] = useState(false);

  const link = typeof window !== "undefined"
    ? `${window.location.origin}/invitacion/${token}`
    : "";

  async function copiar() {
    const fullLink = `${window.location.origin}/invitacion/${token}`;
    await navigator.clipboard.writeText(fullLink);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  }

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-green-100">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
        {esCreador ? "🔗 Link de invitación (compartilo)" : "🔗 Link del grupo"}
      </p>
      <p className="text-gray-400 text-xs mb-3">
        {esCreador
          ? "Mandá este link por WhatsApp para que tus amigos se puedan registrar y unirse."
          : "Compartí este link con quien quieras invitar al grupo."}
      </p>
      {link && (
        <p className="text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2 mb-3 break-all font-mono">
          {link}
        </p>
      )}
      <button
        onClick={copiar}
        className={`w-full py-3 rounded-2xl font-black text-sm transition-colors ${
          copiado
            ? "bg-green-500 text-white"
            : "bg-green-100 text-green-700 hover:bg-green-200"
        }`}
      >
        {copiado ? "✅ ¡Link copiado!" : "📋 Copiar link de invitación"}
      </button>
    </div>
  );
}
