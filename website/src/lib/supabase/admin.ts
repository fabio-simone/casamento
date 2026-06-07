import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase com service role — ignora RLS.
 * USE APENAS no servidor (route handlers, webhooks). Nunca no client.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
      // Nunca deixa o Next.js cachear as leituras do Supabase.
      global: {
        fetch: (input: RequestInfo | URL, init?: RequestInit) =>
          fetch(input, { ...init, cache: "no-store" }),
      },
    }
  );
}
