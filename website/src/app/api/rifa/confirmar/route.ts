import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

// Confirmação manual de pagamento pelo admin
export async function POST(req: NextRequest) {
  try {
    // Valida sessão de admin
    const userClient = createClient();
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

    const { external_reference } = await req.json();
    if (!external_reference) return NextResponse.json({ error: "external_reference obrigatório." }, { status: 400 });

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("rifa_numeros")
      .update({ status: "pago", paid_at: new Date().toISOString(), reservado_ate: null })
      .eq("external_reference", external_reference)
      .eq("status", "reservado");

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[rifa/confirmar]", e);
    return NextResponse.json({ error: "Erro ao confirmar." }, { status: 500 });
  }
}
