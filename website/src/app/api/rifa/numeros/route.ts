import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { RifaNumero } from "@/lib/types";

export async function GET() {
  try {
    const supabase = createAdminClient();

    // Expire reservations older than 15 minutes
    await supabase
      .from("rifa_numeros")
      .update({ status: "disponivel", comprador_nome: null, comprador_whatsapp: null, external_reference: null })
      .eq("status", "reservado")
      .lt("reservado_ate", new Date().toISOString());

    const { data, error } = await supabase
      .from("rifa_numeros")
      .select("numero, status, comprador_nome")
      .order("numero");

    if (error) throw error;

    const numeros: RifaNumero[] = (data ?? []).map((r) => ({
      numero: r.numero,
      status: r.status,
      comprador_nome: r.status === "pago" ? r.comprador_nome : null,
    }));

    return NextResponse.json({ numeros });
  } catch (e) {
    console.error("[rifa/numeros]", e);
    return NextResponse.json({ numeros: [] }, { status: 500 });
  }
}
