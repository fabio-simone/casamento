import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mpPayment } from "@/lib/mercadopago";
import { sendGiftThankYou, sendPaymentNotificationToCasal } from "@/lib/email";
import { formatBRL } from "@/lib/utils";
import type { GiftOrderItem } from "@/lib/types";

/**
 * Webhook do Mercado Pago. Recebe notificações de pagamento.
 * Quando o pagamento é aprovado, marca o pedido (gift_orders) como "paid".
 */
export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    let paymentId =
      url.searchParams.get("data.id") || url.searchParams.get("id") || null;

    let topic = url.searchParams.get("type") || url.searchParams.get("topic");
    try {
      const body = await req.json();
      paymentId = paymentId || body?.data?.id || body?.id || null;
      topic = topic || body?.type || body?.action;
    } catch {
      /* corpo vazio em alguns webhooks */
    }

    if (topic && !String(topic).includes("payment")) {
      return NextResponse.json({ ignored: true });
    }
    if (!paymentId) {
      return NextResponse.json({ error: "Sem payment id." }, { status: 200 });
    }

    const payment = await mpPayment.get({ id: String(paymentId) });

    const meta = (payment.metadata ?? {}) as Record<string, unknown>;
    const orderId =
      (meta.order_id as string) || payment.external_reference || "";

    if (!orderId) {
      return NextResponse.json({ error: "Sem pedido no pagamento." }, { status: 200 });
    }

    const supabase = createAdminClient();

    // Pagamento recusado/cancelado: marca o pedido como falho (se ainda pendente).
    if (payment.status === "rejected" || payment.status === "cancelled") {
      await supabase
        .from("gift_orders")
        .update({ status: "failed", mercadopago_payment_id: String(paymentId) })
        .eq("id", orderId)
        .eq("status", "pending");
      return NextResponse.json({ status: payment.status, processed: false });
    }

    // Ainda não aprovado (pending/in_process): mantém pendente.
    if (payment.status !== "approved") {
      return NextResponse.json({ status: payment.status, processed: false });
    }

    // Idempotência: só marca pedidos ainda pendentes.
    const { data: order, error } = await supabase
      .from("gift_orders")
      .update({
        status: "paid",
        mercadopago_payment_id: String(paymentId),
        paid_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .eq("status", "pending")
      .select("id, pagador_nome, pagador_email, mensagem, itens, total")
      .single();

    if (error || !order) {
      // Já processado (não é erro) ou pedido inexistente.
      return NextResponse.json({ processed: false });
    }

    const itens = (order.itens ?? []) as GiftOrderItem[];
    const pagadorNome = order.pagador_nome || "Convidado";
    const pagadorEmail = order.pagador_email || "";
    const totalFmt = formatBRL(Number(order.total) || 0);

    // Mensagem vira recado no mural.
    const mensagem = (order.mensagem || "").trim();
    if (mensagem) {
      const { error: recadoErr } = await supabase
        .from("recados")
        .insert({ nome: pagadorNome, mensagem: mensagem.slice(0, 500) });
      if (recadoErr) console.error("[webhook] recado insert error", recadoErr);
    }

    // Agradecimento ao pagador.
    if (pagadorEmail) {
      try {
        await sendGiftThankYou({
          nome: pagadorNome,
          email: pagadorEmail,
          itens,
          total: totalFmt,
        });
      } catch (e) {
        console.error("[webhook] thank-you email error", e);
      }
    }

    // Aviso ao casal.
    try {
      await sendPaymentNotificationToCasal({
        pagadorNome,
        itens,
        total: totalFmt,
      });
    } catch (e) {
      console.error("[webhook] casal notification error", e);
    }

    return NextResponse.json({ processed: true, order_id: order.id });
  } catch (e) {
    console.error("[webhook] error", e);
    return NextResponse.json({ error: "Erro no processamento." }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
