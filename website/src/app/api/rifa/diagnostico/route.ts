import { NextResponse } from "next/server";
import { mpPayment } from "@/lib/mercadopago";

// Rota de diagnóstico — só acessível internamente
export async function GET() {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN ?? "";
  const tokenTipo = token.startsWith("APP_USR-") ? "produção" : token.startsWith("TEST-") ? "teste" : "ausente/inválido";
  const tokenTrecho = token ? `${token.slice(0, 12)}...` : "(não definido)";

  // Tenta criar um pagamento PIX mínimo de R$ 0,01 para validar credenciais
  let pixOk = false;
  let pixErro = "";
  let pixDetalhe: unknown = null;
  try {
    const r = await mpPayment.create({
      body: {
        transaction_amount: 0.01,
        description: "Teste diagnóstico PIX",
        payment_method_id: "pix",
        payer: { email: "teste@kafamento.com.br" },
        external_reference: `diag_${Date.now()}`,
      },
    });
    pixOk = !!r.id;
    pixDetalhe = { id: r.id, status: r.status };
  } catch (e: unknown) {
    const err = e as { message?: string; cause?: unknown };
    pixErro = err?.message ?? String(e);
    pixDetalhe = err?.cause ?? null;
  }

  return NextResponse.json({
    token_tipo: tokenTipo,
    token_trecho: tokenTrecho,
    pix_ok: pixOk,
    pix_erro: pixErro || null,
    pix_detalhe: pixDetalhe,
  });
}
