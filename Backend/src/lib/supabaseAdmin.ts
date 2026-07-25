import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env";

// Client ini pakai SERVICE_ROLE_KEY, beda dari client Frontend yang pakai anon key.
// service_role bisa bypass Row Level Security & verifikasi token milik user mana pun —
// makanya HARUS cuma ada di backend, jangan pernah dikirim/dipakai di sisi browser.
export const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
