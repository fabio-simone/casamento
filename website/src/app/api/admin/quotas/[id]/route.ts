import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth-api";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Marca uma cota como paga ou pendente manualmente (ex.: Pix direto, dinheiro).
 * Body: { status: "paid" | "pending", pagador_nome?, pagador_email? }
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  try {
    const body = await req.json();
    const status = body.status === "paid" ? "paid" : "pending";
    const supabase = createAdminClient();

    if (status === "paid") {
      const pagadorNome = body.pagador_nome ? String(body.pagador_nome).trim() : "Pago manualmente";
      const pagadorEmail = body.pagador_email ? String(body.pagador_email).trim() : null;
      const { error } = await supabase
        .from("gift_quotas")
        .update({
          status: "paid",
          pagador_nome: pagadorNome,
          pagador_email: pagadorEmail,
          mercadopago_payment_id: "MANUAL",
          paid_at: new Date().toISOString(),
        })
        .eq("id", params.id);
      if (error) return NextResponse.json({ error: "Erro ao marcar." }, { status: 500 });
    } else {
      // Reverter para pendente — limpa os dados de pagamento.
      const { error } = await supabase
        .from("gift_quotas")
        .update({
          status: "pending",
          pagador_nome: null,
          pagador_email: null,
          mercadopago_payment_id: null,
          paid_at: null,
        })
        .eq("id", params.id);
      if (error) return NextResponse.json({ error: "Erro ao reverter." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro inesperado." }, { status: 500 });
  }
}
