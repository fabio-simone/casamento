import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/** Registra um voto na enquete. Body: { opcao } */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const opcao = String(body.opcao ?? "").trim().slice(0, 200);
    if (!opcao) {
      return NextResponse.json({ error: "Opção inválida." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("poll_votes").insert({ opcao });
    if (error) {
      return NextResponse.json({ error: "Erro ao votar." }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro inesperado." }, { status: 500 });
  }
}

/** Retorna a contagem de votos por opção. */
export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("poll_votes").select("opcao");
    if (error) return NextResponse.json({ total: 0, counts: {} });

    const counts: Record<string, number> = {};
    for (const row of data ?? []) {
      const o = (row as { opcao: string }).opcao;
      counts[o] = (counts[o] ?? 0) + 1;
    }
    return NextResponse.json({ total: data?.length ?? 0, counts });
  } catch {
    return NextResponse.json({ total: 0, counts: {} });
  }
}
