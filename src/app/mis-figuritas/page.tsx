"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

type Figurita = { id: string; numero: string; repetidas: number };
type Faltante = { id: string; numero: string };
type CatalogoItem = { codigo: string; descripcion: string; seccion: string };

const EQUIPOS: Record<string, { nombre: string; bandera: string }> = {
  FWC: { nombre: "Apertura",             bandera: "⚽" },
  MUS: { nombre: "FIFA Museum",          bandera: "🏆" },
  ALG: { nombre: "Algeria",             bandera: "🇩🇿" },
  ARG: { nombre: "Argentina",           bandera: "🇦🇷" },
  AUS: { nombre: "Australia",           bandera: "🇦🇺" },
  AUT: { nombre: "Austria",             bandera: "🇦🇹" },
  BEL: { nombre: "Bélgica",             bandera: "🇧🇪" },
  BIH: { nombre: "Bosnia y Herzegovina",bandera: "🇧🇦" },
  BRA: { nombre: "Brasil",              bandera: "🇧🇷" },
  CAN: { nombre: "Canadá",              bandera: "🇨🇦" },
  CIV: { nombre: "Costa de Marfil",     bandera: "🇨🇮" },
  COD: { nombre: "Congo DR",            bandera: "🇨🇩" },
  COL: { nombre: "Colombia",            bandera: "🇨🇴" },
  CPV: { nombre: "Cabo Verde",          bandera: "🇨🇻" },
  CRO: { nombre: "Croacia",             bandera: "🇭🇷" },
  CUW: { nombre: "Curaçao",             bandera: "🇨🇼" },
  CZE: { nombre: "República Checa",     bandera: "🇨🇿" },
  ECU: { nombre: "Ecuador",             bandera: "🇪🇨" },
  EGY: { nombre: "Egipto",              bandera: "🇪🇬" },
  ENG: { nombre: "Inglaterra",          bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  ESP: { nombre: "España",              bandera: "🇪🇸" },
  FRA: { nombre: "Francia",             bandera: "🇫🇷" },
  GER: { nombre: "Alemania",            bandera: "🇩🇪" },
  GHA: { nombre: "Ghana",               bandera: "🇬🇭" },
  HAI: { nombre: "Haití",               bandera: "🇭🇹" },
  IRN: { nombre: "Irán",                bandera: "🇮🇷" },
  IRQ: { nombre: "Irak",                bandera: "🇮🇶" },
  JOR: { nombre: "Jordania",            bandera: "🇯🇴" },
  JPN: { nombre: "Japón",               bandera: "🇯🇵" },
  KOR: { nombre: "Corea del Sur",       bandera: "🇰🇷" },
  KSA: { nombre: "Arabia Saudita",      bandera: "🇸🇦" },
  MAR: { nombre: "Marruecos",           bandera: "🇲🇦" },
  MEX: { nombre: "México",              bandera: "🇲🇽" },
  NED: { nombre: "Países Bajos",        bandera: "🇳🇱" },
  NOR: { nombre: "Noruega",             bandera: "🇳🇴" },
  NZL: { nombre: "Nueva Zelanda",       bandera: "🇳🇿" },
  PAN: { nombre: "Panamá",              bandera: "🇵🇦" },
  PAR: { nombre: "Paraguay",            bandera: "🇵🇾" },
  POR: { nombre: "Portugal",            bandera: "🇵🇹" },
  QAT: { nombre: "Qatar",               bandera: "🇶🇦" },
  RSA: { nombre: "Sudáfrica",           bandera: "🇿🇦" },
  SCO: { nombre: "Escocia",             bandera: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  SEN: { nombre: "Senegal",             bandera: "🇸🇳" },
  SUI: { nombre: "Suiza",               bandera: "🇨🇭" },
  SWE: { nombre: "Suecia",              bandera: "🇸🇪" },
  TUN: { nombre: "Túnez",               bandera: "🇹🇳" },
  TUR: { nombre: "Turquía",             bandera: "🇹🇷" },
  URU: { nombre: "Uruguay",             bandera: "🇺🇾" },
  USA: { nombre: "Estados Unidos",      bandera: "🇺🇸" },
  UZB: { nombre: "Uzbekistán",          bandera: "🇺🇿" },
};

function getPrefijo(codigo: string): string {
  return codigo.match(/^([A-Z]+)/)?.[1] ?? "?";
}

export default function MisFiguritas() {
  const supabase = createClient();

  const [tab, setTab] = useState<"repetidas" | "faltantes">("repetidas");
  const [repetidas, setRepetidas] = useState<Figurita[]>([]);
  const [faltantes, setFaltantes] = useState<Faltante[]>([]);
  const [catalogo, setCatalogo] = useState<CatalogoItem[]>([]);
  const [input, setInput] = useState("");
  const [pills, setPills] = useState<string[]>([]);
  const [sugerencias, setSugerencias] = useState<CatalogoItem[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [errorValidacion, setErrorValidacion] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const codigosValidos = useMemo(() => new Set(catalogo.map((c) => c.codigo)), [catalogo]);

  const repetidasAgrupadas = useMemo(() => {
    const grupos = new Map<string, Figurita[]>();
    for (const f of repetidas) {
      const prefijo = getPrefijo(f.numero);
      if (!grupos.has(prefijo)) grupos.set(prefijo, []);
      grupos.get(prefijo)!.push(f);
    }
    return grupos;
  }, [repetidas]);

  const faltantesAgrupadas = useMemo(() => {
    const grupos = new Map<string, Faltante[]>();
    for (const f of faltantes) {
      const prefijo = getPrefijo(f.numero);
      if (!grupos.has(prefijo)) grupos.set(prefijo, []);
      grupos.get(prefijo)!.push(f);
    }
    return grupos;
  }, [faltantes]);

  const cargarDatos = useCallback(async (uid: string) => {
    const [{ data: rep }, { data: fal }] = await Promise.all([
      supabase.from("figuritas").select("id, numero, repetidas").eq("usuario_id", uid).order("numero"),
      supabase.from("me_faltan").select("id, numero").eq("usuario_id", uid).order("numero"),
    ]);
    setRepetidas(rep ?? []);
    setFaltantes(fal ?? []);
    setCargando(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        cargarDatos(user.id);
      }
    });
    supabase.from("catalogo_figuritas").select("codigo, descripcion, seccion").then(({ data }) => {
      setCatalogo(data ?? []);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const termino = input.trim().toUpperCase();
    if (!termino) {
      setSugerencias([]);
      return;
    }
    const matches = catalogo.filter((c) => c.codigo.startsWith(termino)).slice(0, 6);
    setSugerencias(matches);
  }, [input, catalogo]);

  function agregarPill(codigo: string) {
    const code = codigo.trim().toUpperCase();
    if (!code) return;
    if (!pills.includes(code)) {
      setPills((prev) => [...prev, code]);
    }
    setInput("");
    setSugerencias([]);
    setErrorValidacion([]);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function quitarPill(index: number) {
    setPills((prev) => prev.filter((_, i) => i !== index));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Tab" || e.key === "Enter") {
      e.preventDefault();
      const termino = input.trim().toUpperCase();
      if (!termino) return;
      if (sugerencias.length > 0) {
        agregarPill(sugerencias[0].codigo);
      } else if (codigosValidos.has(termino)) {
        agregarPill(termino);
      } else {
        setErrorValidacion([termino]);
      }
    } else if (e.key === "Backspace" && input === "" && pills.length > 0) {
      setPills((prev) => prev.slice(0, -1));
    }
  }

  function resolverCodigos(): { validos: string[]; invalidos: string[] } {
    const todos = [...pills];
    const termino = input.trim().toUpperCase();
    if (termino && codigosValidos.has(termino) && !todos.includes(termino)) {
      todos.push(termino);
    }
    return {
      validos: todos.filter((n) => codigosValidos.has(n)),
      invalidos: todos.filter((n) => !codigosValidos.has(n)),
    };
  }

  async function agregarRepetidas(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setErrorValidacion([]);

    const { validos, invalidos } = resolverCodigos();
    if (invalidos.length > 0) { setErrorValidacion(invalidos); return; }
    if (validos.length === 0) return;

    setGuardando(true);
    for (const numero of validos) {
      const existente = repetidas.find((r) => r.numero === numero);
      if (existente) {
        await supabase.from("figuritas").update({ repetidas: existente.repetidas + 1 }).eq("id", existente.id);
      } else {
        await supabase.from("figuritas").insert({ usuario_id: userId, numero, repetidas: 1 });
      }
    }
    setPills([]);
    setInput("");
    setSugerencias([]);
    await cargarDatos(userId);
    setGuardando(false);
  }

  async function agregarFaltantes(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setErrorValidacion([]);

    const { validos, invalidos } = resolverCodigos();
    if (invalidos.length > 0) { setErrorValidacion(invalidos); return; }
    if (validos.length === 0) return;

    setGuardando(true);
    for (const numero of validos) {
      if (!faltantes.find((f) => f.numero === numero)) {
        await supabase.from("me_faltan").insert({ usuario_id: userId, numero });
      }
    }
    setPills([]);
    setInput("");
    setSugerencias([]);
    await cargarDatos(userId);
    setGuardando(false);
  }

  async function quitarRepetida(id: string, cantidad: number) {
    if (!userId) return;
    if (cantidad > 1) {
      await supabase.from("figuritas").update({ repetidas: cantidad - 1 }).eq("id", id);
    } else {
      await supabase.from("figuritas").delete().eq("id", id);
    }
    await cargarDatos(userId);
  }

  async function quitarFaltante(id: string) {
    if (!userId) return;
    await supabase.from("me_faltan").delete().eq("id", id);
    await cargarDatos(userId);
  }

  function cambiarTab(t: "repetidas" | "faltantes") {
    setTab(t);
    setInput("");
    setPills([]);
    setErrorValidacion([]);
    setSugerencias([]);
  }

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-4xl animate-bounce">⚽</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 pb-24">
      <div className="bg-gradient-to-r from-green-500 to-green-600 px-5 pt-12 pb-8 text-white">
        <Link href="/dashboard" className="text-green-100 text-sm font-semibold mb-4 block">
          ← Volver
        </Link>
        <h1 className="text-2xl font-black">Mis figuritas 🃏</h1>
        <div className="flex gap-4 mt-2 text-green-100 text-sm">
          <span>🔵 {repetidas.length} para dar</span>
          <span>❌ {faltantes.length} me faltan</span>
        </div>
      </div>

      <div className="px-4 -mt-4">
        <div className="flex bg-white rounded-2xl p-1 mb-5 shadow-sm">
          <button
            onClick={() => cambiarTab("repetidas")}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${tab === "repetidas" ? "bg-green-500 text-white shadow" : "text-gray-500"}`}
          >
            🔵 Para dar ({repetidas.length})
          </button>
          <button
            onClick={() => cambiarTab("faltantes")}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${tab === "faltantes" ? "bg-red-400 text-white shadow" : "text-gray-500"}`}
          >
            ❌ Me faltan ({faltantes.length})
          </button>
        </div>

        <form
          onSubmit={tab === "repetidas" ? agregarRepetidas : agregarFaltantes}
          className="bg-white rounded-3xl p-5 shadow-sm mb-5"
        >
          <label className="block text-sm font-bold text-gray-700 mb-1">
            {tab === "repetidas" ? "Agregar repetidas" : "Agregar figuritas que te faltan"}
          </label>
          <p className="text-xs text-gray-400 mb-3">
            Escribí el código, elegí la sugerencia o presioná <kbd className="bg-gray-100 px-1 rounded text-gray-500">TAB</kbd> para agregar. Repetí para cargar varias a la vez.
          </p>

          <div className="relative">
            <div className="flex gap-2 items-start">
              {/* Pills + input container */}
              <div
                className="flex-1 border-2 border-gray-200 rounded-2xl px-3 py-2 flex flex-wrap gap-1.5 items-center focus-within:border-green-400 bg-white min-h-[50px] cursor-text"
                onClick={() => inputRef.current?.focus()}
              >
                {pills.map((p, i) => (
                  <span
                    key={i}
                    className={`text-xs font-bold font-mono px-2 py-1 rounded-lg flex items-center gap-1 shrink-0 ${
                      tab === "repetidas"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {p}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); quitarPill(i); }}
                      className="opacity-60 hover:opacity-100 leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => { setInput(e.target.value.toUpperCase()); setErrorValidacion([]); }}
                  onKeyDown={handleKeyDown}
                  placeholder={pills.length === 0 ? "Ej: ARG5, luego TAB..." : ""}
                  className="flex-1 min-w-[110px] outline-none text-sm font-mono py-1 bg-transparent placeholder:text-gray-300"
                />
              </div>

              <button
                type="submit"
                disabled={guardando || (pills.length === 0 && !input.trim())}
                className={`px-5 py-3 rounded-2xl font-black text-white transition-colors disabled:opacity-50 shrink-0 ${
                  tab === "repetidas" ? "bg-green-500 hover:bg-green-600" : "bg-red-400 hover:bg-red-500"
                }`}
              >
                {guardando ? "..." : "➕"}
              </button>
            </div>

            {/* Sugerencias */}
            {sugerencias.length > 0 && (
              <div className="absolute top-full left-0 right-12 bg-white border-2 border-green-200 rounded-2xl shadow-lg mt-1 z-10 overflow-hidden">
                {sugerencias.map((s) => (
                  <button
                    key={s.codigo}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => agregarPill(s.codigo)}
                    className="w-full text-left px-4 py-2 hover:bg-green-50 flex items-center gap-3 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-base">{EQUIPOS[getPrefijo(s.codigo)]?.bandera ?? "🏳️"}</span>
                    <span className="font-mono font-bold text-green-700 text-sm">{s.codigo}</span>
                    <span className="text-gray-500 text-xs truncate">{s.descripcion}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {errorValidacion.length > 0 && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-2xl p-3">
              <p className="text-red-600 text-xs font-bold mb-1">
                ❌ {errorValidacion.length === 1 ? "Código inválido:" : "Códigos inválidos:"}
              </p>
              <p className="text-red-500 text-xs font-mono">{errorValidacion.join(", ")}</p>
              <p className="text-red-400 text-xs mt-1">Verificá el código en tu álbum físico.</p>
            </div>
          )}
        </form>

        {tab === "repetidas" && (
          <div className="space-y-4">
            {repetidas.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-2">📭</div>
                <p className="font-medium">No cargaste figuritas repetidas todavía</p>
              </div>
            ) : (
              Array.from(repetidasAgrupadas.entries()).map(([prefijo, items]) => {
                const equipo = EQUIPOS[prefijo] ?? { nombre: prefijo, bandera: "🏳️" };
                return (
                  <div key={prefijo} className="bg-white rounded-3xl px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{equipo.bandera}</span>
                      <span className="font-black text-gray-700 text-sm">{equipo.nombre}</span>
                      <span className="ml-auto text-xs text-gray-400 font-semibold">{items.length} figurita{items.length !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {items.map((f) => (
                        <div key={f.id} className="bg-green-50 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5">
                          <span className="text-sm">{equipo.bandera}</span>
                          <span className="font-mono font-bold text-gray-700 text-xs">{f.numero}</span>
                          {f.repetidas > 1 && (
                            <span className="bg-green-200 text-green-800 text-xs font-bold px-1.5 py-0.5 rounded-full">
                              x{f.repetidas}
                            </span>
                          )}
                          <button onClick={() => quitarRepetida(f.id, f.repetidas)} className="text-red-300 hover:text-red-500 text-xs font-bold ml-0.5">
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {tab === "faltantes" && (
          <div className="space-y-4">
            {faltantes.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-2">🎉</div>
                <p className="font-medium">¡No tenés figuritas pendientes cargadas!</p>
              </div>
            ) : (
              Array.from(faltantesAgrupadas.entries()).map(([prefijo, items]) => {
                const equipo = EQUIPOS[prefijo] ?? { nombre: prefijo, bandera: "🏳️" };
                return (
                  <div key={prefijo} className="bg-white rounded-3xl px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{equipo.bandera}</span>
                      <span className="font-black text-gray-700 text-sm">{equipo.nombre}</span>
                      <span className="ml-auto text-xs text-gray-400 font-semibold">{items.length} figurita{items.length !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {items.map((f) => (
                        <div key={f.id} className="bg-red-50 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5">
                          <span className="text-sm">{equipo.bandera}</span>
                          <span className="font-mono font-bold text-gray-700 text-xs">{f.numero}</span>
                          <button onClick={() => quitarFaltante(f.id)} className="text-red-300 hover:text-red-500 text-xs font-bold ml-0.5">
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
