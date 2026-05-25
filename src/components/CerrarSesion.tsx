"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function CerrarSesion() {
  const router = useRouter();
  const supabase = createClient();

  async function cerrarSesion() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={cerrarSesion}
      className="bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-2xl hover:bg-white/30 transition-colors"
    >
      Salir
    </button>
  );
}
