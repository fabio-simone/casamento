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

    // Ajuste de número de cotas (cria/remove cotas pendentes conforme necessário).
    if (body.num_cotas !== undefined) {
      const novoNum = Math.max(1, Math.floor(Number(body.num_cotas)));
      update.num_cotas = novoNum;

      const { data: cotas } = await supabase
        .from("gift_quotas")
        .select("id, numero_cota, status")
        .eq("gift_id", params.id)
        .order("numero_cota", { ascending: true });

      const atual = cotas?.length ?? 0;
      if (novoNum > atual) {
        const novas = Array.from({ length: novoNum - atual }, (_, i) => ({
          gift_id: params.id,
          numero_cota: atual + i + 1,
          status: "pending" as const,
        }));
        await supabase.from("gift_quotas").insert(novas);
      } else if (novoNum < atual) {
        // Remove apenas cotas pendentes do final.
        const remover = (cotas ?? [])
          .filter((c) => c.status === "pending")
          .sort((a, b) => b.numero_cota - a.numero_cota)
          .slice(0, atual - novoNum)
          .map((c) => c.id);
        if (remover.length) {
          await supabase.from("gift_quotas").delete().in("id", remover);
        }
      }
    }

    const { error } = await supabase.from("gifts").update(update).eq("id", params.id);
    if (error) return NextResponse.json({ error: "Erro ao editar." }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro inesperado." }, { status: 500 });
  }
}

/** Remove um presente (e suas cotas via cascade). */
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
