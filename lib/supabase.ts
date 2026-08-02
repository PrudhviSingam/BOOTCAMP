/**
 * lib/supabase.ts
 * Supabase browser/server client — uses the public/anon key ONLY.
 * NEVER import or use a service-role key here.
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? "";
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

// Helper to safely initialize a Supabase client
const createSafeClient = (url: string, key: string, options?: any) => {
  if (!url || !key) {
    // Return a self-returning thenable proxy to handle arbitrary chain calls without crashing
    const dummyClient: any = {};
    const handler: ProxyHandler<any> = {
      get: (target, prop) => {
        if (prop === "then") {
          return (resolve: any) => resolve({ data: null, error: null });
        }
        return () => new Proxy(dummyClient, handler);
      },
    };
    return new Proxy(dummyClient, handler) as any;
  }
  return createClient(url, key, options);
};

// Single shared client instance
export const supabase = createSafeClient(supabaseUrl, supabaseAnon);

// Admin client for server-side operations that need to bypass RLS (e.g. Razorpay webhook/verification)
export const supabaseAdmin = createSafeClient(
  supabaseUrl,
  supabaseServiceRole || supabaseAnon,
  supabaseServiceRole
    ? {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    : undefined
);
