"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

function generarCodigo() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generarToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(18)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function CrearGrupo() {
  const router = useRouter();
  const supabase = createClient();

  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const codigo = generarCodigo();
    const token = generarToken();

    const { data: grupo, error: errorGrupo } = await supabase
      .from("grupos")
      .insert({ nombre, codigo, creado_por: user.id })
      .select()
      .single();

    if (errorGrupo || !grupo) {
      setError("No se pudo crear el grupo. Intentá de nuevo.");
      setCargando(false);
      return;
    }

    // Crear la invitación para el grupo
    await supabase.from("invitaciones").insert({
      token,
      grupo_id: grupo.id,
      creado_por: user.id,
    });

    // El creador se une automáticamente
    await supabase.from("miembros_grupo").insert({
      grupo_id: grupo.id,
      usuario_id: user.id,
    });

    router.push(`/grupos/${codigo}`);
  }

  return (
    <div className="min-h-screen bg-green-50 p-4">
      <div className="max-w-sm mx-auto pt-8">
        <Link
          href="/dashboard"
          className="text-green-600 font-semibold text-sm mb-6 block"
        >
          ← Volver
        </Link>

        <div className="text-center mb-8">
          <div className="text-5xl mb-3">➕</div>
          <h1 className="text-2xl font-black text-gray-800">Crear grupo</h1>
          <p className="text-gray-500 text-sm mt-1">
            Se genera un link de invitación para compartir con tus amigos
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 shadow-sm space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nombre del grupo
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: 4to B, Los pibes del barrio..."
              required
              maxLength={40}
              className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-green-400"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 rounded-xl p-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-green-500 text-white py-3 rounded-2xl font-black text-lg hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {cargando ? "Creando..." : "¡Crear grupo!"}
          </button>
        </form>
      </div>
    </div>
  );
}
