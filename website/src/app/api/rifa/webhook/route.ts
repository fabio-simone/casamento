import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mpPayment } from "@/lib/mercadopago";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // MP sends action=payment.updated and a data.id
    const paymentId = body?.data?.id;
    const action = body?.action ?? "";

    if (!paymentId || !action.startsWith("payment")) {
      return NextResponse.json({ ok: true });
    }

    const payment = await mpPayment.get({ id: String(paymentId) });
    const externalRef = payment.external_reference ?? "";

    if (!externalRef.startsWith("rifa_")) {
      return NextResponse.json({ ok: true }); // not a rifa payment
    }

    if (payment.status === "approved") {
      const supabase = createAdminClient();
      await supabase
        .from("rifa_numeros")
        .update({
          status: "pago",
          mp_payment_id: String(paymentId),
          paid_at: new Date().toISOString(),
          reservado_ate: null,
        })
        .eq("external_reference", externalRef)
        .eq("status", "reservado");
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[rifa/webhook]", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
