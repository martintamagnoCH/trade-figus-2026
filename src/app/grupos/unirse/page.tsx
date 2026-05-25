"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UnirseGrupo() {
  const router = useRouter();
  const supabase = createClient();

  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const codigoUpper = codigo.toUpperCase().trim();

    const { data: grupo } = await supabase
      .from("grupos")
      .select("id, nombre")
      .eq("codigo", codigoUpper)
      .single();

    if (!grupo) {
      setError("Código incorrecto. Pedile el código al que creó el grupo.");
      setCargando(false);
      return;
    }

    const { error: errorMiembro } = await supabase
      .from("miembros_grupo")
      .insert({ grupo_id: grupo.id, usuario_id: user.id });

    if (errorMiembro && errorMiembro.code !== "23505") {
      setError("No se pudo unir al grupo. Intentá de nuevo.");
      setCargando(false);
      return;
    }

    router.push(`/grupos/${codigoUpper}`);
  }

  return (
    <div className="min-h-screen bg-green-50 p-4">
      <div className="max-w-sm mx-auto pt-8">
        <Link href="/dashboard" className="text-green-600 font-semibold text-sm mb-6 block">
          ← Volver
        </Link>

        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔑</div>
          <h1 className="text-2xl font-black text-gray-800">Unirse a grupo</h1>
          <p className="text-gray-500 text-sm mt-1">
            Ingresá el código que te mandó tu amigo o la seño
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Código del grupo
            </label>
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              placeholder="Ej: AB12CD"
              required
              maxLength={6}
              className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-lg font-bold tracking-widest text-center focus:outline-none focus:border-green-400 uppercase"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 rounded-xl p-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando || codigo.length < 4}
            className="w-full bg-green-500 text-white py-3 rounded-2xl font-black text-lg hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {cargando ? "Buscando..." : "¡Unirme!"}
          </button>
        </form>
      </div>
    </div>
  );
}
