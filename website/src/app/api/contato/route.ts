import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendSupportNotification } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const nome = String(body.nome ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const tipo = String(body.tipo ?? "Outro").trim();
    const descricao = String(body.descricao ?? "").trim();
    const codigo_erro = body.codigo_erro ? String(body.codigo_erro).trim() : null;

    if (!nome || !email || !descricao) {
      return NextResponse.json(
        { error: "Nome, e-mail e descrição são obrigatórios." },
        { status: 400 }
      );
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("support_messages")
      .insert({ nome, email, tipo, descricao, codigo_erro });

    if (error) {
      console.error("[contato] insert error", error);
      // Mesmo se a tabela não existir, tentamos notificar por e-mail.
    }

    try {
      await sendSupportNotification({
        nome,
        email,
        tipo,
        descricao,
        codigoErro: codigo_erro,
      });
    } catch (e) {
      console.error("[contato] email error", e);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[contato] unexpected", e);
    return NextResponse.json({ error: "Erro inesperado." }, { status: 500 });
  }
}
