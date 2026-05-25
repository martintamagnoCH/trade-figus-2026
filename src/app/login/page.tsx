"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Email o contraseña incorrectos");
    } else {
      router.push("/dashboard");
      router.refresh();
    }

    setCargando(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-sm w-full">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚽</div>
          <h1 className="text-3xl font-black text-green-700">FiguTrade</h1>
          <p className="text-gray-500 text-sm mt-1">Mundial FIFA 2026</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-green-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              required
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
            {cargando ? "Entrando..." : "¡Entrar!"}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          ¿No tenés cuenta? Necesitás un{" "}
          <span className="font-semibold text-green-600">link de invitación</span>{" "}
          de tu grupo para registrarte.
        </p>

        <p className="text-center text-gray-300 text-xs mt-6">
          Aplicación creada por el papá de Ele y Mati 💚
        </p>
      </div>
    </div>
  );
}
