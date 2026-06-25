import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth-api";
import { createAdminClient } from "@/lib/supabase/admin";

/** Apaga TODOS os pedidos pendentes e falhos (limpeza). Pagos são preservados. */
export async function DELETE() {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("gift_orders")
    .delete()
    .neq("status", "paid");

  if (error) return NextResponse.json({ error: "Erro ao limpar pedidos." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
