import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth-api";
import { createAdminClient } from "@/lib/supabase/admin";

/** Apaga um pedido pendente ou falho (pedidos pagos não podem ser apagados). */
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("gift_orders")
    .delete()
    .eq("id", params.id)
    .neq("status", "paid");

  if (error) return NextResponse.json({ error: "Erro ao apagar pedido." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
