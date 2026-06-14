import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth-api";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Salva o conteúdo editável do site na tabela site_settings (upsert por chave).
 * Body: { hero_foto, hero_sub, historia_intro, historia_foto, timeline[] }
 */
export async function POST(req: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  try {
    const body = await req.json();

    const rows: { key: string; value: string; updated_at: string }[] = [];
    const now = new Date().toISOString();
    const push = (key: string, value: unknown) =>
      rows.push({ key, value: value == null ? "" : String(value), updated_at: now });

    push("paleta", body.paleta);
    push("hero_foto", body.hero_foto);
    push("hero_sub", body.hero_sub);
    push("historia_intro", body.historia_intro);
    push("historia_foto", body.historia_foto);
    push("email_presente_titulo", body.email_presente_titulo);
    push("email_presente_texto", body.email_presente_texto);

    const pushJson = (key: string, value: unknown) => {
      if (Array.isArray(value)) {
        rows.push({ key, value: JSON.stringify(value), updated_at: now });
      }
    };
    pushJson("historia_timeline", body.timeline);
    pushJson("galeria", body.galeria);
    pushJson("cronograma", body.cronograma);
    pushJson("faq", body.faq);

    const pushObj = (key: string, value: unknown) => {
      if (value && typeof value === "object") {
        rows.push({ key, value: JSON.stringify(value), updated_at: now });
      }
    };
    pushObj("informacoes", body.informacoes);
    pushObj("paginas", body.paginas);
    pushObj("home", body.home);

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("site_settings")
      .upsert(rows, { onConflict: "key" });

    if (error) {
      console.error("[settings] upsert error", error);
      return NextResponse.json(
        { error: "Erro ao salvar. A tabela site_settings existe?" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[settings] unexpected", e);
    return NextResponse.json({ error: "Erro inesperado." }, { status: 500 });
  }
}
