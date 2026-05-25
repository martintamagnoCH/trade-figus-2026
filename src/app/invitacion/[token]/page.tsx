import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import FormularioInvitacion from "./FormularioInvitacion";

export default async function InvitacionPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();

  // Verificar que el token existe y está activo
  const { data: invitacion } = await supabase
    .from("invitaciones")
    .select("id, grupo_id, activa")
    .eq("token", token)
    .single();

  if (!invitacion || !invitacion.activa) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-sm w-full text-center">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-xl font-black text-gray-800 mb-2">
            Link inválido
          </h2>
          <p className="text-gray-500 text-sm">
            Este link de invitación no existe o fue desactivado. Pedile uno
            nuevo al que creó el grupo.
          </p>
        </div>
      </div>
    );
  }

  // Traer el nombre del grupo
  const { data: grupo } = await supabase
    .from("grupos")
    .select("nombre, codigo")
    .eq("id", invitacion.grupo_id)
    .single();

  if (!grupo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-sm w-full text-center">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-xl font-black text-gray-800 mb-2">Link inválido</h2>
          <p className="text-gray-500 text-sm">
            Este link de invitación no existe o fue desactivado.
          </p>
        </div>
      </div>
    );
  }

  // Si ya hay sesión activa, unirse directamente al grupo
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Ya está logueado: unirse al grupo y redirigir
    await supabase.from("miembros_grupo").insert({
      grupo_id: invitacion.grupo_id,
      usuario_id: user.id,
    });
    redirect(`/grupos/${grupo.codigo}`);
  }

  return (
    <FormularioInvitacion
      token={token}
      grupoNombre={grupo.nombre}
      grupoCodigo={grupo.codigo}
      grupoId={invitacion.grupo_id}
    />
  );
}
