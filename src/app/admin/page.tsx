import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";

const ADMIN_EMAIL = "mtamagno@gmail.com";

export default async function AdminPage() {
  // 1. Verificar sesión normal
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (user.email !== ADMIN_EMAIL) redirect("/dashboard");

  // 2. Consultar TODO con el cliente admin (bypasea RLS)
  const adminSupabase = createAdminClient();

  const { data: grupos } = await adminSupabase
    .from("grupos")
    .select(`
      id,
      nombre,
      codigo,
      created_at,
      miembros_grupo(count)
    `)
    .order("created_at", { ascending: false });

  const { count: totalUsuarios } = await adminSupabase
    .from("perfiles")
    .select("id", { count: "exact", head: true });

  const { count: totalFaltantes } = await adminSupabase
    .from("faltantes")
    .select("id", { count: "exact", head: true });

  const { count: totalRepetidas } = await adminSupabase
    .from("repetidas")
    .select("id", { count: "exact", head: true });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-900 px-5 pt-12 pb-8 text-white">
        <Link href="/dashboard" className="text-gray-400 text-sm mb-4 block">
          ← Volver al dashboard
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-4xl">🛡️</span>
          <div>
            <h1 className="text-2xl font-black">Panel Admin</h1>
            <p className="text-gray-400 text-sm">FiguTrade · Vista global</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Stats rápidas */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="text-3xl font-black text-green-600">{grupos?.length ?? 0}</p>
            <p className="text-gray-500 text-xs mt-1">Grupos creados</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="text-3xl font-black text-blue-600">{totalUsuarios ?? 0}</p>
            <p className="text-gray-500 text-xs mt-1">Usuarios registrados</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="text-3xl font-black text-orange-500">{totalFaltantes ?? 0}</p>
            <p className="text-gray-500 text-xs mt-1">Figuritas faltantes</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="text-3xl font-black text-purple-500">{totalRepetidas ?? 0}</p>
            <p className="text-gray-500 text-xs mt-1">Figuritas repetidas</p>
          </div>
        </div>

        {/* Lista de grupos */}
        <div>
          <h2 className="text-lg font-black text-gray-700 mb-3">
            Todos los grupos ({grupos?.length ?? 0})
          </h2>

          {!grupos || grupos.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm text-gray-400">
              No hay grupos todavía.
            </div>
          ) : (
            <div className="space-y-3">
              {grupos.map((grupo) => {
                const cantMiembros =
                  (grupo.miembros_grupo as unknown as { count: number }[])?.[0]
                    ?.count ?? 0;
                const fechaCreacion = new Date(grupo.created_at).toLocaleDateString(
                  "es-AR",
                  { day: "2-digit", month: "short", year: "numeric" }
                );

                return (
                  <Link
                    key={grupo.id}
                    href={`/grupos/${grupo.codigo}`}
                    className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow block"
                  >
                    <div>
                      <p className="font-bold text-gray-800">{grupo.nombre}</p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        Código: <span className="font-mono font-semibold">{grupo.codigo}</span>
                        {" · "}
                        {fechaCreacion}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="text-lg font-black text-gray-700">
                        {cantMiembros}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {cantMiembros === 1 ? "miembro" : "miembros"}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
