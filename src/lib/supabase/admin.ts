import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Cliente con service_role — bypasea RLS. Solo usar en server components/actions.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!serviceKey) {
    throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY en las variables de entorno.");
  }

  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false },
  });
}
