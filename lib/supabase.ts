/**
 * lib/supabase.ts
 * Supabase browser/server client — uses the public/anon key ONLY.
 * NEVER import or use a service-role key here.
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? "";
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Single shared client instance
export const supabase = createClient(supabaseUrl, supabaseAnon);
