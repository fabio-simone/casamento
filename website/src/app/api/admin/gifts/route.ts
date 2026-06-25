import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth-api";
import { createAdminClient } from "@/lib/supabase/admin";

/** Cria um presente e gera suas cotas. */
export async function POST(req: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  try {
    const body = await req.json();
    const nome = String(body.nome ?? "").trim();
    const descricao = body.descricao ? String(body.descricao).trim() : null;
    const valor_total = Number(body.valor_total);
    const foto_url = body.foto_url ? String(body.foto_url).trim() : null;

    if (!nome || !valor_total || valor_total <= 0) {
      return NextResponse.json({ error: "Nome e preço são obrigatórios." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data: gift, error } = await supabase
      .from("gifts")
      .insert({ nome, descricao, valor_total, foto_url })
      .select()
      .single();

    if (error || !gift) {
      return NextResponse.json({ error: "Erro ao criar presente." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, gift });
  } catch {
    return NextResponse.json({ error: "Erro inesperado." }, { status: 500 });
  }
}
