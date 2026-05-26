import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import BotonCopiarLink from "./BotonCopiarLink";
import FiguPill from "@/components/FiguPill";
import BottomNav from "@/components/BottomNav";

const ADMIN_EMAIL = "mtamagno@gmail.com";

type Match = {
  usuario: string;
  userId: string;
  puedesDarle: string[];
  puedesDarte: string[];
};

export default async function GrupoPage({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const { codigo } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const esAdmin = user.email === ADMIN_EMAIL;
  // Admin usa cliente privilegiado para ver grupos donde no es miembro
  const groupClient = esAdmin ? createAdminClient() : supabase;

  const { data: grupo } = await groupClient
    .from("grupos")
    .select("id, nombre, codigo, creado_por")
    .eq("codigo", codigo)
    .single();

  if (!grupo) redirect("/dashboard");

  const { data: esMiembro } = await supabase
    .from("miembros_grupo")
    .select("id")
    .eq("grupo_id", grupo.id)
    .eq("usuario_id", user.id)
    .single();

  // El admin puede ver cualquier grupo aunque no sea miembro
  if (!esMiembro && !esAdmin) redirect("/dashboard");

  const { data: miembros } = await groupClient
    .from("miembros_grupo")
    .select("usuario_id")
    .eq("grupo_id", grupo.id);

  const todosUsuarioIds = (miembros ?? []).map((m) => m.usuario_id);
  const otrosIds = todosUsuarioIds.filter((id) => id !== user.id);

  const { data: perfiles } = await groupClient
    .from("perfiles")
    .select("id, nombre")
    .in("id", todosUsuarioIds.length > 0 ? todosUsuarioIds : [user.id]);

  const perfilMap = Object.fromEntries(
    (perfiles ?? []).map((p) => [p.id, p.nombre])
  );

  // Traer el token de invitación activo
  const { data: invitacion } = await groupClient
    .from("invitaciones")
    .select("token")
    .eq("grupo_id", grupo.id)
    .eq("activa", true)
    .single();

  const { data: misRepetidas } = await supabase
    .from("figuritas")
    .select("numero")
    .eq("usuario_id", user.id);

  const { data: misFaltantes } = await supabase
    .from("me_faltan")
    .select("numero")
    .eq("usuario_id", user.id);

  const misReptidasSet = new Set((misRepetidas ?? []).map((f) => f.numero));
  const misFaltantesSet = new Set((misFaltantes ?? []).map((f) => f.numero));

  const matches: Match[] = [];

  for (const otroId of otrosIds) {
    const { data: susRepetidas } = await groupClient
      .from("figuritas")
      .select("numero")
      .eq("usuario_id", otroId);

    const { data: susFaltantes } = await groupClient
      .from("me_faltan")
      .select("numero")
      .eq("usuario_id", otroId);

    const susReptidasSet = new Set((susRepetidas ?? []).map((f) => f.numero));
    const susFaltantesSet = new Set((susFaltantes ?? []).map((f) => f.numero));

    const puedesDarle = [...misReptidasSet].filter((n) => susFaltantesSet.has(n));
    const puedesDarte = [...susReptidasSet].filter((n) => misFaltantesSet.has(n));

    if (puedesDarle.length > 0 || puedesDarte.length > 0) {
      matches.push({
        usuario: perfilMap[otroId] ?? "Jugador",
        userId: otroId,
        puedesDarle,
        puedesDarte,
      });
    }
  }

  const esCreador = grupo.creado_por === user.id;
  const vistaAdmin = esAdmin && !esMiembro;

  return (
    <div className="min-h-screen bg-green-50 pb-24">
      <div className="bg-gradient-to-r from-green-500 to-green-600 px-5 pt-12 pb-8 text-white">
        <Link
          href={vistaAdmin ? "/admin" : "/dashboard"}
          className="text-green-100 text-sm font-semibold mb-4 block"
        >
          {vistaAdmin ? "← Panel admin" : "← Mis grupos"}
        </Link>
        <h1 className="text-2xl font-black">{grupo.nombre}</h1>
        <p className="text-green-100 text-sm mt-1">
          👥 {todosUsuarioIds.length}{" "}
          {todosUsuarioIds.length === 1 ? "miembro" : "miembros"}
        </p>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Banner modo admin */}
        {vistaAdmin && (
          <div className="bg-gray-800 text-white rounded-2xl px-4 py-3 flex items-center gap-2 text-sm">
            <span>🛡️</span>
            <span className="font-semibold">Vista de administrador — solo lectura</span>
          </div>
        )}

        {/* Link de invitación */}
        {invitacion && (
          <BotonCopiarLink token={invitacion.token} esCreador={esCreador} />
        )}

        {/* Aviso si no tiene figuritas */}
        {misReptidasSet.size === 0 && misFaltantesSet.size === 0 && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-3xl p-5 text-center">
            <div className="text-3xl mb-2">⚠️</div>
            <p className="text-yellow-800 font-semibold text-sm">
              Todavía no cargaste tus figuritas.
            </p>
            <Link
              href="/mis-figuritas"
              className="mt-3 inline-block bg-yellow-400 text-yellow-900 font-bold px-4 py-2 rounded-2xl text-sm"
            >
              Cargar ahora
            </Link>
          </div>
        )}

        {/* Matches */}
        <div>
          <h2 className="text-lg font-black text-gray-700 mb-3">
            🔄 Intercambios posibles
          </h2>

          {matches.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center shadow-sm">
              <div className="text-5xl mb-3">😔</div>
              <p className="text-gray-600 font-semibold">
                Por ahora no hay intercambios posibles.
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Asegurate de que todos carguen sus figuritas.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match) => (
                <div
                  key={match.userId}
                  className="bg-white rounded-3xl p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-lg font-bold text-green-700">
                      {match.usuario[0].toUpperCase()}
                    </div>
                    <p className="font-black text-gray-800 text-lg">
                      {match.usuario}
                    </p>
                  </div>

                  {match.puedesDarte.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-bold text-green-600 uppercase tracking-wide mb-2">
                        ✅ Te puede dar ({match.puedesDarte.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {match.puedesDarte.map((n) => (
                          <FiguPill key={n} codigo={n} variant="verde" />
                        ))}
                      </div>
                    </div>
                  )}

                  {match.puedesDarle.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-2">
                        🔵 Le podés dar vos ({match.puedesDarle.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {match.puedesDarle.map((n) => (
                          <FiguPill key={n} codigo={n} variant="azul" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Miembros */}
        <div>
          <h2 className="text-lg font-black text-gray-700 mb-3">
            👥 Miembros del grupo
          </h2>
          <div className="bg-white rounded-3xl p-5 shadow-sm">
            <div className="space-y-2">
              {todosUsuarioIds.map((uid) => {
                const nombre = perfilMap[uid] ?? "Jugador";
                const esTuyo = uid === user.id;
                return (
                  <div key={uid} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-700">
                      {nombre[0].toUpperCase()}
                    </div>
                    <span className="text-gray-700 font-medium">
                      {nombre}
                      {esTuyo && (
                        <span className="ml-2 text-xs text-green-500 font-bold">
                          (vos)
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
