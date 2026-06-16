import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mpPreference } from "@/lib/mercadopago";
import type { GiftOrderItem } from "@/lib/types";

/**
 * Deriva a origem real da requisição (o host que está de fato no ar).
 * Evita que um NEXT_PUBLIC_BASE_URL apontando para um domínio fora do ar
 * quebre silenciosamente o webhook de pagamento. Env fica como fallback.
 */
function getOrigin(req: Request): string {
  const h = req.headers;
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) {
    const proto =
      h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
    return `${proto}://${host}`;
  }
  return process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
}

/**
 * Cria uma preferência de pagamento (Checkout Pro) para um carrinho de presentes.
 * Body: { itens: [{ gift_id, quantidade }], pagador_nome, pagador_email, mensagem }
 */
export async function POST(req: Request) {
  try {
    const origin = getOrigin(req);
    const body = await req.json();
    const pagadorNome = String(body.pagador_nome ?? "").trim();
    const pagadorEmail = String(body.pagador_email ?? "").trim().toLowerCase();
    const mensagem = body.mensagem ? String(body.mensagem).trim().slice(0, 500) : "";

    // Normaliza o carrinho: { gift_id -> quantidade }.
    const carrinho = new Map<string, number>();
    if (Array.isArray(body.itens)) {
      for (const it of body.itens) {
        const id = String(it?.gift_id ?? "");
        const q = Math.max(1, Math.floor(Number(it?.quantidade) || 0));
        if (id && q > 0) carrinho.set(id, (carrinho.get(id) ?? 0) + q);
      }
    }

    if (!pagadorNome || !pagadorEmail) {
      return NextResponse.json(
        { error: "Nome e e-mail são obrigatórios." },
        { status: 400 }
      );
    }
    if (carrinho.size === 0) {
      return NextResponse.json({ error: "Carrinho vazio." }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Busca os presentes do carrinho para validar nome/preço (não confia no cliente).
    const ids = [...carrinho.keys()];
    const { data: gifts, error: giftsErr } = await supabase
      .from("gifts")
      .select("id, nome, valor_total")
      .in("id", ids);

    if (giftsErr || !gifts || gifts.length === 0) {
      return NextResponse.json({ error: "Presentes não encontrados." }, { status: 404 });
    }

    const itens: GiftOrderItem[] = [];
    const mpItems = [];
    let total = 0;
    for (const g of gifts) {
      const quantidade = carrinho.get(g.id) ?? 0;
      if (quantidade <= 0) continue;
      const preco = Number((Number(g.valor_total) || 0).toFixed(2));
      if (preco <= 0) continue;
      itens.push({ gift_id: g.id, nome: g.nome, preco, quantidade });
      total += preco * quantidade;
      mpItems.push({
        id: g.id,
        title: g.nome,
        quantity: quantidade,
        unit_price: preco,
        currency_id: "BRL",
      });
    }

    if (itens.length === 0) {
      return NextResponse.json({ error: "Nenhum item válido no carrinho." }, { status: 400 });
    }
    total = Number(total.toFixed(2));

    // Registra o pedido (pendente). O webhook marca como pago.
    const { data: order, error: orderErr } = await supabase
      .from("gift_orders")
      .insert({
        pagador_nome: pagadorNome,
        pagador_email: pagadorEmail,
        mensagem,
        itens,
        total,
        status: "pending",
      })
      .select("id")
      .single();

    if (orderErr || !order) {
      console.error("[checkout] order insert error", orderErr);
      return NextResponse.json({ error: "Erro ao criar pedido." }, { status: 500 });
    }

    const preference = await mpPreference.create({
      body: {
        items: mpItems,
        payer: { name: pagadorNome, email: pagadorEmail },
        external_reference: order.id,
        metadata: {
          order_id: order.id,
          pagador_nome: pagadorNome,
          pagador_email: pagadorEmail,
          mensagem,
        },
        back_urls: {
          success: `${origin}/presentes?status=sucesso`,
          failure: `${origin}/presentes?status=falha`,
          pending: `${origin}/presentes?status=pendente`,
        },
        auto_return: "approved",
        notification_url: `${origin}/api/webhooks/mercadopago`,
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
