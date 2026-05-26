"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Props = {
  token: string;
  grupoNombre: string;
  grupoCodigo: string;
  grupoId: string;
};

export default function FormularioInvitacion({
  grupoNombre,
  grupoCodigo,
  grupoId,
}: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [modo, setModo] = useState<"registro" | "login">("registro");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);

    if (modo === "registro") {
      const { data, error: errorRegistro } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nombre } },
      });

      if (errorRegistro) {
        setError("No se pudo crear la cuenta. Intentá de nuevo.");
        setCargando(false);
        return;
      }

      // Si el email no requiere confirmación, unirse al grupo de inmediato
      if (data.user && data.session) {
        await supabase.from("miembros_grupo").insert({
          grupo_id: grupoId,
          usuario_id: data.user.id,
        });
        router.push(`/grupos/${grupoCodigo}`);
        router.refresh();
      } else {
        // Requiere confirmar email — guardar grupoId para después
        setEmailEnviado(true);
      }
    } else {
      const { data, error: errorLogin } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (errorLogin || !data.user) {
        setError("Email o contraseña incorrectos.");
        setCargando(false);
        return;
      }

      await supabase.from("miembros_grupo").insert({
        grupo_id: grupoId,
        usuario_id: data.user.id,
      });

      router.push(`/grupos/${grupoCodigo}`);
      router.refresh();
    }

    setCargando(false);
  }

  if (emailEnviado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-sm w-full text-center">
          <div className="text-6xl mb-4">📧</div>
          <h2 className="text-2xl font-black text-green-700 mb-2">
            ¡Revisá tu email!
          </h2>
          <p className="text-gray-600 text-sm">
            Te mandamos un link de confirmación a{" "}
            <span className="font-semibold">{email}</span>. Una vez confirmado
            vas a quedar en el grupo <strong>{grupoNombre}</strong> automáticamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-sm w-full">
        {/* Cabecera con nombre del grupo */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">⚽</div>
          <p className="text-gray-500 text-sm">Te invitaron a</p>
          <h1 className="text-2xl font-black text-green-700">{grupoNombre}</h1>
          <p className="text-gray-400 text-xs mt-1">FiguTrade · Mundial FIFA 2026</p>
        </div>

        {/* Toggle registro / ya tengo cuenta */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
          <button
            onClick={() => setModo("registro")}
            className={`flex-1 py-2 rounded-xl font-bold text-sm transition-colors ${
              modo === "registro"
                ? "bg-white text-green-700 shadow"
                : "text-gray-500"
            }`}
          >
            Crear cuenta
          </button>
          <button
            onClick={() => setModo("login")}
            className={`flex-1 py-2 rounded-xl font-bold text-sm transition-colors ${
              modo === "login"
                ? "bg-white text-green-700 shadow"
                : "text-gray-500"
            }`}
          >
            Ya tengo cuenta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {modo === "registro" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                ¿Cómo te llamás?
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre o apodo"
                required
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-green-400"
              />
            </div>
          )}

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
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
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
            {cargando
              ? <span className="flex items-center justify-center gap-2"><span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />{modo === "registro" ? "Creando cuenta..." : "Entrando..."}</span>
              : modo === "registro" ? "¡Unirme al grupo!" : "¡Entrar y unirme!"}
          </button>
        </form>
      </div>
    </div>
  );
}
