import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mpPayment } from "@/lib/mercadopago";

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
    const numeros: number[] = (body.numeros ?? []).filter(
      (n: unknown) => typeof n === "number" && n >= 1 && n <= 50
    );
    const nome = String(body.nome ?? "").trim().slice(0, 120);
    const whatsapp = String(body.whatsapp ?? "").trim().slice(0, 20);
    const valorPorNumero = Math.max(1, Number(body.valor_por_numero) || 1);

    if (!nome || !whatsapp) {
      return NextResponse.json({ error: "Nome e WhatsApp são obrigatórios." }, { status: 400 });
    }
    if (numeros.length === 0) {
      return NextResponse.json({ error: "Selecione ao menos um número." }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Expire old reservations first
    await supabase
      .from("rifa_numeros")
      .update({ status: "disponivel", comprador_nome: null, comprador_whatsapp: null, external_reference: null })
      .eq("status", "reservado")
      .lt("reservado_ate", new Date().toISOString());

    // Check availability
    const { data: rows } = await supabase
      .from("rifa_numeros")
      .select("numero, status")
      .in("numero", numeros);

    const indisponiveis = (rows ?? []).filter((r) => r.status !== "disponivel").map((r) => r.numero);
    if (indisponiveis.length > 0) {
      return NextResponse.json(
        { error: `Número(s) ${indisponiveis.join(", ")} já ${indisponiveis.length === 1 ? "foi" : "foram"} reservado(s). Escolha outros.` },
        { status: 409 }
      );
    }

    const total = Number((valorPorNumero * numeros.length).toFixed(2));
    const externalRef = `rifa_${crypto.randomUUID()}`;
    const reservadoAte = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    // Reserve the numbers
    const { error: updateErr } = await supabase
      .from("rifa_numeros")
      .update({
        status: "reservado",
        comprador_nome: nome,
        comprador_whatsapp: whatsapp,
        valor_pago: valorPorNumero,
        external_reference: externalRef,
        reservado_ate: reservadoAte,
      })
      .in("numero", numeros)
      .eq("status", "disponivel");

    if (updateErr) throw updateErr;

    // Create PIX payment via MP Payment API
    const payment = await mpPayment.create({
      body: {
        transaction_amount: total,
        description: `Rifa Kafamento — números: ${numeros.join(", ")}`,
        payment_method_id: "pix",
        payer: {
          email: "rifa@kafamento.com.br",
          first_name: nome,
          identification: { type: "CPF", number: "00000000000" },
        },
        external_reference: externalRef,
        metadata: { numeros, nome, whatsapp },
        notification_url: `${origin}/api/rifa/webhook`,
        date_of_expiration: reservadoAte,
      },
    });

    const txData = payment.point_of_interaction?.transaction_data;
    if (!txData?.qr_code) {
      // Roll back reservations on MP failure
      await supabase
        .from("rifa_numeros")
        .update({ status: "disponivel", comprador_nome: null, comprador_whatsapp: null, external_reference: null })
        .in("numero", numeros);
      throw new Error("MP não retornou QR Code PIX.");
    }

    return NextResponse.json({
      payment_id: payment.id,
      external_reference: externalRef,
      qr_code: txData.qr_code,
      qr_code_base64: txData.qr_code_base64 ?? "",
      total,
      numeros,
      expira_em: reservadoAte,
    });
  } catch (e) {
    console.error("[rifa/reservar]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erro ao criar reserva." },
      { status: 500 }
    );
  }
}
