import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const nome = String(body.nome ?? "").trim().slice(0, 80);
    const mensagem = String(body.mensagem ?? "").trim().slice(0, 500);

    if (!nome || !mensagem) {
      return NextResponse.json({ error: "Nome e mensagem obrigatórios." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("recados").insert({ nome, mensagem });
    if (error) {
      return NextResponse.json({ error: "Erro ao salvar recado." }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro inesperado." }, { status: 500 });
  }
}
