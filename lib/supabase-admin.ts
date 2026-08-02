import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-admin-key";

if (supabaseServiceRole === "placeholder-admin-key") {
  console.warn("Missing SUPABASE_SERVICE_ROLE_KEY! Admin client will likely fail on RLS policies.");
}

// Admin client using the service role key to bypass RLS
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
