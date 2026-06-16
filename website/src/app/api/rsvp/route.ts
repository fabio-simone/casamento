import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendRsvpConfirmation } from "@/lib/email";
import { MAX_ACOMPANHANTES, type Acompanhante, type FaixaIdade } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const nome = String(body.nome ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const telefone = body.telefone ? String(body.telefone).trim() : null;

    // Normaliza os acompanhantes (nome + faixa de idade), limitando ao máximo.
    const faixasValidas: FaixaIdade[] = ["ate7", "8mais"];
    const acompanhantes: Acompanhante[] = Array.isArray(body.acompanhantes)
      ? body.acompanhantes
          .slice(0, MAX_ACOMPANHANTES)
          .map((a: unknown) => {
            const obj = (a ?? {}) as Record<string, unknown>;
            const nomeAc = String(obj.nome ?? "").trim();
            const faixa = faixasValidas.includes(obj.faixa as FaixaIdade)
              ? (obj.faixa as FaixaIdade)
              : "8mais";
            return { nome: nomeAc, faixa };
          })
          .filter((a: Acompanhante) => a.nome.length > 0)
      : [];
    const num_acompanhantes = acompanhantes.length;

    if (!nome || !email) {
      return NextResponse.json({ error: "Nome e e-mail são obrigatórios." }, { status: 400 });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
    }

    const supabase = createAdminClient();
    let { error } = await supabase.from("rsvps").insert({
      nome,
      email,
      telefone,
      num_acompanhantes,
      acompanhantes,
    });

    // Se a coluna `acompanhantes` ainda não existir no banco, salva sem ela
    // (mantém o RSVP funcionando até a migração ser aplicada).
    if (error && /acompanhantes/i.test(error.message || "")) {
      ({ error } = await supabase.from("rsvps").insert({
        nome,
        email,
        telefone,
        num_acompanhantes,
      }));
    }

    if (error) {
      console.error("[rsvp] insert error", error);
      return NextResponse.json({ error: "Erro ao salvar confirmação." }, { status: 500 });
    }

    // E-mail de confirmação (não bloqueia o sucesso se falhar).
    try {
      await sendRsvpConfirmation({ nome, email, numAcompanhantes: num_acompanhantes });
    } catch (e) {
      console.error("[rsvp] email error", e);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[rsvp] unexpected", e);
    return NextResponse.json({ error: "Erro inesperado." }, { status: 500 });
  }
}
