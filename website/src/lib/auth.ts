import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

/**
 * Garante que há um usuário autenticado e que ele é o admin autorizado.
 * Redireciona para /admin/login caso contrário. Retorna o usuário.
 */
export async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  // Se ADMIN_EMAIL estiver definido, restringe o acesso a esse e-mail.
  if (adminEmail && user.email?.toLowerCase() !== adminEmail) {
    redirect("/admin/login?erro=nao-autorizado");
  }

  return user;
}
