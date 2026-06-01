import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendRsvpConfirmation } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const nome = String(body.nome ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const telefone = body.telefone ? String(body.telefone).trim() : null;
    const num_acompanhantes = Math.min(5, Math.max(0, Number(body.num_acompanhantes) || 0));
    const restricao_alimentar = body.restricao_alimentar
      ? String(body.restricao_alimentar).trim()
      : null;
    const mensagem = body.mensagem ? String(body.mensagem).trim() : null;

    if (!nome || !email) {
      return NextResponse.json({ error: "Nome e e-mail são obrigatórios." }, { status: 400 });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("rsvps").insert({
      nome,
      email,
      telefone,
      num_acompanhantes,
      restricao_alimentar,
      mensagem,
    });

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
