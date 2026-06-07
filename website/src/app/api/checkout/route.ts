import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mpPreference } from "@/lib/mercadopago";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

/**
 * Cria uma preferência de pagamento (Checkout Pro) para 1+ cotas de um presente.
 * Body: { gift_id, quantidade, pagador_nome, pagador_email }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const giftId = String(body.gift_id ?? "");
    const quantidade = Math.max(1, Number(body.quantidade) || 1);
    const pagadorNome = String(body.pagador_nome ?? "").trim();
    const pagadorEmail = String(body.pagador_email ?? "").trim().toLowerCase();
    const mensagem = body.mensagem ? String(body.mensagem).trim().slice(0, 500) : "";

    if (!giftId || !pagadorNome || !pagadorEmail) {
      return NextResponse.json(
        { error: "Dados incompletos (presente, nome e e-mail)." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Busca o presente
    const { data: gift, error: giftErr } = await supabase
      .from("gifts")
      .select("id, nome, valor_total, num_cotas")
      .eq("id", giftId)
      .single();

    if (giftErr || !gift) {
      return NextResponse.json({ error: "Presente não encontrado." }, { status: 404 });
    }

    const valorCota = Number((gift.valor_total / gift.num_cotas).toFixed(2));

    // Seleciona as próximas cotas pendentes disponíveis
    const { data: cotas, error: cotasErr } = await supabase
      .from("gift_quotas")
      .select("id, numero_cota")
      .eq("gift_id", giftId)
      .eq("status", "pending")
      .order("numero_cota", { ascending: true })
      .limit(quantidade);

    if (cotasErr || !cotas || cotas.length === 0) {
      return NextResponse.json(
        { error: "Não há cotas disponíveis para este presente." },
        { status: 409 }
      );
    }

    const quotaIds = cotas.map((c) => c.id);

    // Guarda intenção de pagamento (pagador) nas cotas, mantendo status pending.
    await supabase
      .from("gift_quotas")
      .update({ pagador_nome: pagadorNome, pagador_email: pagadorEmail })
      .in("id", quotaIds);

    // external_reference linka o pagamento às cotas (usado no webhook).
    const externalReference = `gift:${giftId}|quotas:${quotaIds.join(",")}`;

    const preference = await mpPreference.create({
      body: {
        items: [
          {
            id: gift.id,
            title: `Presente: ${gift.nome}`,
            description: `${cotas.length} cota(s) de ${gift.nome}`,
            quantity: cotas.length,
            unit_price: valorCota,
            currency_id: "BRL",
          },
        ],
        payer: {
          name: pagadorNome,
          email: pagadorEmail,
        },
        external_reference: externalReference,
        metadata: {
          gift_id: giftId,
          quota_ids: quotaIds,
          pagador_nome: pagadorNome,
          pagador_email: pagadorEmail,
          mensagem,
        },
        back_urls: {
          success: `${BASE_URL}/presentes?status=sucesso`,
          failure: `${BASE_URL}/presentes?status=falha`,
          pending: `${BASE_URL}/presentes?status=pendente`,
        },
        auto_return: "approved",
        notification_url: `${BASE_URL}/api/webhooks/mercadopago`,
        statement_descriptor: "KAFAMENTO",
      },
    });

    return NextResponse.json({
      id: preference.id,
      init_point: preference.init_point,
    });
  } catch (e) {
    console.error("[checkout] error", e);
    return NextResponse.json({ error: "Erro ao criar pagamento." }, { status: 500 });
  }
}
