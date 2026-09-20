import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth-api";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  try {
    const config = await req.json();
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("site_settings")
      .upsert(
        { key: "rifa_config", value: JSON.stringify(config), updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/rifa-settings]", e);
    return NextResponse.json({ error: "Erro ao salvar." }, { status: 500 });
  }
}
