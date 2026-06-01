import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mpPayment } from "@/lib/mercadopago";
import { sendGiftThankYou } from "@/lib/email";
import { formatBRL } from "@/lib/utils";

/**
 * Webhook do Mercado Pago. Recebe notificações de pagamento.
 * Configurar a URL no painel MP: https://kafamento.com.br/api/webhooks/mercadopago
 * Quando o pagamento é aprovado, marca as cotas relacionadas como "paid".
 */
export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    let paymentId =
      url.searchParams.get("data.id") || url.searchParams.get("id") || null;

    // Mercado Pago também envia o corpo em JSON.
    let topic = url.searchParams.get("type") || url.searchParams.get("topic");
    try {
      const body = await req.json();
      paymentId = paymentId || body?.data?.id || body?.id || null;
      topic = topic || body?.type || body?.action;
    } catch {
      /* corpo vazio em alguns webhooks */
    }

    // Só nos interessam eventos de pagamento.
    if (topic && !String(topic).includes("payment")) {
      return NextResponse.json({ ignored: true });
    }
    if (!paymentId) {
      return NextResponse.json({ error: "Sem payment id." }, { status: 200 });
    }

    // Consulta detalhes do pagamento na API do MP.
    const payment = await mpPayment.get({ id: String(paymentId) });

    if (payment.status !== "approved") {
      return NextResponse.json({ status: payment.status, processed: false });
    }

    const meta = (payment.metadata ?? {}) as Record<string, unknown>;
    const externalRef = payment.external_reference ?? "";

    // Extrai quota_ids dos metadados ou do external_reference.
    let quotaIds: string[] = Array.isArray(meta.quota_ids)
      ? (meta.quota_ids as string[])
      : [];
    let giftId = (meta.gift_id as string) ?? "";

    if (quotaIds.length === 0 && externalRef.includes("quotas:")) {
      const giftPart = externalRef.match(/gift:([^|]+)/)?.[1];
      const quotasPart = externalRef.match(/quotas:([^|]+)/)?.[1];
      if (giftPart) giftId = giftPart;
      if (quotasPart) quotaIds = quotasPart.split(",").filter(Boolean);
    }

    if (quotaIds.length === 0) {
      return NextResponse.json({ error: "Sem cotas no pagamento." }, { status: 200 });
    }

    const pagadorNome =
      (meta.pagador_nome as string) ||
      `${payment.payer?.first_name ?? ""} ${payment.payer?.last_name ?? ""}`.trim() ||
      "Convidado";
    const pagadorEmail =
      (meta.pagador_email as string) || payment.payer?.email || "";

    const supabase = createAdminClient();

    // Idempotência: só atualiza cotas ainda pendentes.
    const { data: updated, error } = await supabase
      .from("gift_quotas")
      .update({
        status: "paid",
        pagador_nome: pagadorNome,
        pagador_email: pagadorEmail,
        mercadopago_payment_id: String(paymentId),
        paid_at: new Date().toISOString(),
      })
      .in("id", quotaIds)
      .eq("status", "pending")
      .select("id, gift_id");

    if (error) {
      console.error("[webhook] update error", error);
      return NextResponse.json({ error: "Erro ao atualizar cotas." }, { status: 500 });
    }

    // Envia agradecimento se algo foi efetivamente marcado como pago.
    if (updated && updated.length > 0 && pagadorEmail) {
      const { data: gift } = await supabase
        .from("gifts")
        .select("nome, valor_total, num_cotas")
        .eq("id", giftId)
        .single();
      if (gift) {
        const valorCota = gift.valor_total / gift.num_cotas;
        try {
          await sendGiftThankYou({
            nome: pagadorNome,
            email: pagadorEmail,
            presente: gift.nome,
            valor: formatBRL(valorCota * updated.length),
          });
        } catch (e) {
          console.error("[webhook] thank-you email error", e);
        }
      }
    }

    return NextResponse.json({ processed: true, cotas: updated?.length ?? 0 });
  } catch (e) {
    console.error("[webhook] error", e);
    // Retornamos 200 para o MP não ficar reenviando indefinidamente em erros transitórios.
    return NextResponse.json({ error: "Erro no processamento." }, { status: 200 });
  }
}

// O MP pode fazer um GET de verificação.
export async function GET() {
  return NextResponse.json({ ok: true });
}
