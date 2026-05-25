import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import CerrarSesion from "@/components/CerrarSesion";

export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("nombre")
    .eq("id", user.id)
    .single();

  const { data: membresías } = await supabase
    .from("miembros_grupo")
    .select("grupo_id")
    .eq("usuario_id", user.id);

  const grupoIds = (membresías ?? []).map((m) => m.grupo_id);

  const grupos =
    grupoIds.length > 0
      ? (
          await supabase
            .from("grupos")
            .select("id, nombre, codigo")
            .in("id", grupoIds)
        ).data ?? []
      : [];

  return (
    <div className="min-h-screen bg-green-50 pb-24">
      <div className="bg-gradient-to-r from-green-500 to-green-600 px-5 pt-12 pb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm">¡Hola,</p>
            <h1 className="text-2xl font-black">
              {perfil?.nombre ?? "jugador"}! 👋
            </h1>
          </div>
          <CerrarSesion />
        </div>
      </div>

      <div className="px-4 -mt-4">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link
            href="/mis-figuritas"
            className="bg-white rounded-3xl p-5 shadow-sm flex flex-col items-center gap-2 hover:shadow-md transition-shadow"
          >
            <span className="text-4xl">🃏</span>
            <span className="font-bold text-gray-700 text-center text-sm">
              Mis figuritas
            </span>
          </Link>
          <Link
            href="/grupos/unirse"
            className="bg-white rounded-3xl p-5 shadow-sm flex flex-col items-center gap-2 hover:shadow-md transition-shadow"
          >
            <span className="text-4xl">🔑</span>
            <span className="font-bold text-gray-700 text-center text-sm">
              Unirse a grupo
            </span>
          </Link>
          <Link
            href="/grupos/crear"
            className="bg-green-500 rounded-3xl p-5 shadow-sm flex flex-col items-center gap-2 hover:shadow-md transition-shadow col-span-2"
          >
            <span className="text-4xl">➕</span>
            <span className="font-bold text-white text-center">
              Crear nuevo grupo
            </span>
          </Link>
        </div>

        <h2 className="text-lg font-black text-gray-700 mb-3">Mis grupos</h2>

        {grupos.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center shadow-sm">
            <div className="text-5xl mb-3">🤝</div>
            <p className="text-gray-500 font-medium">
              Todavía no estás en ningún grupo.
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Creá uno o unite con un código.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {grupos.map((grupo) => (
              <Link
                key={grupo.id}
                href={`/grupos/${grupo.codigo}`}
                className="bg-white rounded-3xl p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow block"
              >
                <div>
                  <p className="font-bold text-gray-800">{grupo.nombre}</p>
                  <p className="text-gray-400 text-sm">Código: {grupo.codigo}</p>
                </div>
                <span className="text-2xl">⚽</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
