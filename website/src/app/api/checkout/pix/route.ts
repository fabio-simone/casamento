import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mpPayment } from "@/lib/mercadopago";
import type { GiftOrderItem } from "@/lib/types";

function getOrigin(req: Request): string {
  const h = req.headers;
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) {
    const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
    return `${proto}://${host}`;
  }
  return process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
}

export async function POST(req: NextRequest) {
  try {
    const origin = getOrigin(req);
    const body = await req.json();
    const pagadorNome = String(body.pagador_nome ?? "").trim();
    const pagadorEmail = String(body.pagador_email ?? "").trim().toLowerCase();
    const mensagem = body.mensagem ? String(body.mensagem).trim().slice(0, 500) : "";

    const carrinho = new Map<string, number>();
    if (Array.isArray(body.itens)) {
      for (const it of body.itens) {
        const id = String(it?.gift_id ?? "");
        const q = Math.max(1, Math.floor(Number(it?.quantidade) || 0));
        if (id && q > 0) carrinho.set(id, (carrinho.get(id) ?? 0) + q);
      }
    }

    if (!pagadorNome || !pagadorEmail) {
      return NextResponse.json({ error: "Nome e e-mail são obrigatórios." }, { status: 400 });
    }
    if (carrinho.size === 0) {
      return NextResponse.json({ error: "Carrinho vazio." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const ids = [...carrinho.keys()];
    const { data: gifts, error: giftsErr } = await supabase
      .from("gifts")
      .select("id, nome, valor_total")
      .in("id", ids);

    if (giftsErr || !gifts || gifts.length === 0) {
      return NextResponse.json({ error: "Presentes não encontrados." }, { status: 404 });
    }

    const itens: GiftOrderItem[] = [];
    let total = 0;
    for (const g of gifts) {
      const quantidade = carrinho.get(g.id) ?? 0;
      if (quantidade <= 0) continue;
      const preco = Number((Number(g.valor_total) || 0).toFixed(2));
      if (preco <= 0) continue;
      itens.push({ gift_id: g.id, nome: g.nome, preco, quantidade });
      total += preco * quantidade;
    }

    if (itens.length === 0) {
      return NextResponse.json({ error: "Nenhum item válido no carrinho." }, { status: 400 });
    }
    total = Number(total.toFixed(2));

    const { data: order, error: orderErr } = await supabase
      .from("gift_orders")
      .insert({ pagador_nome: pagadorNome, pagador_email: pagadorEmail, mensagem, itens, total, status: "pending" })
      .select("id")
      .single();

    if (orderErr || !order) {
      console.error("[checkout/pix] order insert error", orderErr);
      return NextResponse.json({ error: "Erro ao criar pedido." }, { status: 500 });
    }

    const expiraEm = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    let payment;
    try {
      payment = await mpPayment.create({
        body: {
          transaction_amount: total,
          description: `Presentes Kafamento — ${itens.map((i) => i.nome).join(", ").slice(0, 200)}`,
          payment_method_id: "pix",
          payer: { email: pagadorEmail, first_name: pagadorNome },
          external_reference: order.id,
          metadata: { order_id: order.id, pagador_nome: pagadorNome, pagador_email: pagadorEmail, mensagem },
          notification_url: `${origin}/api/webhooks/mercadopago`,
          date_of_expiration: expiraEm,
        },
      });
    } catch (mpErr) {
      await supabase.from("gift_orders").delete().eq("id", order.id);
      throw mpErr;
    }

    const txData = payment.point_of_interaction?.transaction_data;
    if (!txData?.qr_code) {
      await supabase.from("gift_orders").delete().eq("id", order.id);
      throw new Error("Mercado Pago não retornou QR Code PIX.");
    }

    return NextResponse.json({
      order_id: order.id,
      payment_id: payment.id,
      qr_code: txData.qr_code,
      qr_code_base64: txData.qr_code_base64 ?? "",
      total,
      expira_em: expiraEm,
    });
  } catch (e: unknown) {
    const err = e as { message?: string; cause?: unknown };
    console.error("[checkout/pix]", err?.cause ?? e);
    return NextResponse.json({ error: err?.message ?? "Erro ao gerar PIX." }, { status: 500 });
  }
}
