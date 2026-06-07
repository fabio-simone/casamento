import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("recados")
    .select("id, nome, mensagem, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ recados: [] }, { status: 200 });
  }
  return NextResponse.json({ recados: data });
}

// Recados são criados apenas ao enviar um presente (via webhook do Mercado Pago).
