import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref");
  if (!ref) return NextResponse.json({ error: "ref obrigatório" }, { status: 400 });

  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("rifa_numeros")
      .select("status, reservado_ate")
      .eq("external_reference", ref)
      .limit(1)
      .maybeSingle();

    if (!data) return NextResponse.json({ status: "nao_encontrado" });

    if (data.status === "pago") return NextResponse.json({ status: "pago" });

    if (data.status === "reservado") {
      const expired = data.reservado_ate && new Date(data.reservado_ate) < new Date();
      return NextResponse.json({ status: expired ? "expirado" : "aguardando" });
    }

    return NextResponse.json({ status: "expirado" });
  } catch (e) {
    console.error("[rifa/status]", e);
    return NextResponse.json({ error: "Erro" }, { status: 500 });
  }
}
