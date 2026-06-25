import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth-api";
import { createAdminClient } from "@/lib/supabase/admin";

/** Edita um presente. Permite ajustar nome, descrição, valor e foto. */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  try {
    const body = await req.json();
    const update: Record<string, unknown> = {};
    if (body.nome !== undefined) update.nome = String(body.nome).trim();
    if (body.descricao !== undefined)
      update.descricao = body.descricao ? String(body.descricao).trim() : null;
    if (body.valor_total !== undefined) update.valor_total = Number(body.valor_total);
    if (body.foto_url !== undefined)
      update.foto_url = body.foto_url ? String(body.foto_url).trim() : null;

    const supabase = createAdminClient();
    const { error } = await supabase.from("gifts").update(update).eq("id", params.id);
    if (error) return NextResponse.json({ error: "Erro ao editar." }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro inesperado." }, { status: 500 });
  }
}

/** Remove um presente do catálogo. */
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const supabase = createAdminClient();
  const { error } = await supabase.from("gifts").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: "Erro ao remover." }, { status: 500 });

  return NextResponse.json({ ok: true });
}
