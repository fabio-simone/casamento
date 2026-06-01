import { createClient } from "./supabase/server";

/**
 * Verifica admin em rotas de API. Retorna o usuário ou null (sem redirect).
 */
export async function getAdminUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  if (adminEmail && user.email?.toLowerCase() !== adminEmail) return null;

  return user;
}
