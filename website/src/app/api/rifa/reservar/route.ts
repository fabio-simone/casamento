import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getRifaConfig } from "@/lib/rifa";
import { gerarPixPayload } from "@/lib/pix";
import QRCode from "qrcode";

export async function POST(req: NextRequest) {
  try {
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

    const config = await getRifaConfig();
    if (!config.pix_chave) {
      return NextResponse.json({ error: "Chave PIX não configurada. Acesse o painel admin → Rifa para configurar." }, { status: 503 });
    }

    const supabase = createAdminClient();

    // Expire stale reservations
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

    const indisponiveis = (rows ?? [])
      .filter((r) => r.status !== "disponivel")
      .map((r) => r.numero);

    if (indisponiveis.length > 0) {
      return NextResponse.json(
        { error: `Número(s) ${indisponiveis.join(", ")} já ${indisponiveis.length === 1 ? "foi" : "foram"} reservado(s). Escolha outros.` },
        { status: 409 }
      );
    }

    const total = Number((valorPorNumero * numeros.length).toFixed(2));
    const txid = `KF${Date.now().toString(36).toUpperCase()}`;
    const externalRef = `rifa_${txid}`;
    const reservadoAte = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    // Reserve numbers
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

    // Generate PIX payload
    const pixString = gerarPixPayload(
      config.pix_chave,
      config.pix_nome || "Kafamento",
      config.pix_cidade || "Sao Paulo",
      total,
      txid
    );

    // Generate QR code as base64 PNG
    const qrBase64 = await QRCode.toDataURL(pixString, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 300,
    });
    // Strip the data:image/png;base64, prefix
    const qrCodeBase64 = qrBase64.replace(/^data:image\/png;base64,/, "");

    return NextResponse.json({
      external_reference: externalRef,
      qr_code: pixString,
      qr_code_base64: qrCodeBase64,
      total,
      numeros,
      expira_em: reservadoAte,
    });
  } catch (e: unknown) {
    const err = e as { message?: string };
    console.error("[rifa/reservar]", e);
    return NextResponse.json(
      { error: err?.message ?? "Erro ao criar reserva." },
      { status: 500 }
    );
  }
}
