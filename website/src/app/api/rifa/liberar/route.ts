import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/auth-api";

// Admin libera número(s) de volta para disponível
export async function POST(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  try {
    const { numeros } = await req.json();
    if (!Array.isArray(numeros) || numeros.length === 0) {
      return NextResponse.json({ error: "numeros[] obrigatório." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("rifa_numeros")
      .update({
        status: "disponivel",
        comprador_nome: null,
        comprador_whatsapp: null,
        valor_pago: null,
        mp_payment_id: null,
        external_reference: null,
        reservado_ate: null,
        paid_at: null,
      })
      .in("numero", numeros);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[rifa/liberar]", e);
    return NextResponse.json({ error: "Erro ao liberar." }, { status: 500 });
  }
}
