import { Resend } from "resend";
import { WEDDING } from "./constants";
import { getContent } from "./content";

const resendKey = process.env.RESEND_API_KEY;
const FROM = process.env.RESEND_FROM_EMAIL ?? "kafamento <casal@kafamento.com.br>";

const resend = resendKey ? new Resend(resendKey) : null;

/** Notifica o casal (ADMIN_EMAIL) quando alguém relata um problema. */
export async function sendSupportNotification(params: {
  nome: string;
  email: string;
  tipo: string;
  descricao: string;
  codigoErro?: string | null;
}) {
  const admin = process.env.ADMIN_EMAIL;
  if (!resend || !admin) {
    console.warn("[email] suporte: RESEND_API_KEY ou ADMIN_EMAIL ausente.");
    return;
  }

  const html = `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;background:#FAF9F6;border-radius:16px;overflow:hidden;border:1px solid #E8D5B0">
    <div style="background:#3A3A3A;color:#FAF9F6;padding:24px;text-align:center">
      <h1 style="margin:0;font-family:Georgia,serif;font-size:22px">⚠️ Alguém precisa de ajuda</h1>
    </div>
    <div style="padding:24px;color:#3A3A3A;line-height:1.6">
      <p><strong>De:</strong> ${params.nome} (${params.email})</p>
      <p><strong>Tipo:</strong> ${params.tipo}</p>
      ${params.codigoErro ? `<p><strong>Código de erro:</strong> ${params.codigoErro}</p>` : ""}
      <p><strong>Descrição:</strong></p>
      <p style="background:#fff;border:1px solid #E8D5B0;border-radius:8px;padding:12px;white-space:pre-wrap">${params.descricao}</p>
      <p style="margin-top:16px;font-size:13px;color:#666">Responda diretamente para ${params.email}.</p>
    </div>
  </div>`;

  await resend.emails.send({
    from: FROM,
    to: admin,
    replyTo: params.email,
    subject: `[kafamento] Problema relatado — ${params.tipo}`,
    html,
  });
}

/** E-mail de confirmação de presença para o convidado. */
export async function sendRsvpConfirmation(params: {
  nome: string;
  email: string;
  numAcompanhantes: number;
}) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY ausente — pulando envio.");
    return;
  }

  const total = 1 + params.numAcompanhantes;

  // Texto editável no painel, com marcadores {nome} {total} {data}.
  const content = await getContent();
  const titulo = content.email_rsvp_titulo || "Presença confirmada! 🎉";
  const textoTpl =
    content.email_rsvp_texto || "Oi, {nome}! Sua presença está confirmada.";
  const corpo = textoTpl
    .split("{nome}").join(params.nome)
    .split("{total}").join(`${total} ${total === 1 ? "pessoa" : "pessoas"}`)
    .split("{data}").join(WEDDING.dataCurta)
    .split("\n")
    .map((linha) => linha.trim())
    .filter(Boolean)
    .map((linha) => `<p>${linha}</p>`)
    .join("");

  const html = `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;background:#FAF9F6;border-radius:16px;overflow:hidden;border:1px solid #E8D5B0">
    <div style="background:#006994;color:#FAF9F6;padding:32px 24px;text-align:center">
      <h1 style="margin:0;font-family:Georgia,serif;font-size:28px">${titulo}</h1>
      <p style="margin:8px 0 0;opacity:.9">${WEDDING.dataExtenso} · ${WEDDING.cidade}</p>
    </div>
    <div style="padding:28px 24px;color:#3A3A3A;line-height:1.6">
      ${corpo}
      <p style="margin-top:24px">Com carinho,<br/><strong>${WEDDING.noivos}</strong></p>
    </div>
    <div style="background:#E8D5B0;color:#3A3A3A;padding:16px;text-align:center;font-size:12px">
      ${WEDDING.dominio} — O Rio encontra SP
    </div>
  </div>`;

  await resend.emails.send({
    from: FROM,
    to: params.email,
    subject: `Presença confirmada — ${WEDDING.noivos} 🎉`,
    html,
  });
}

/** E-mail de agradecimento por um presente pago. */
export async function sendGiftThankYou(params: {
  nome: string;
  email: string;
  presente: string;
  valor: string;
}) {
  if (!resend) return;

  const content = await getContent();
  const titulo = content.email_presente_titulo || "Obrigado! 💙";
  const texto = content.email_presente_texto || "Você acaba de contribuir para a paz mundial entre Vasco e a garoa paulistana. Gratidão! 🌊🏙️";

  const html = `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;background:#FAF9F6;border-radius:16px;overflow:hidden;border:1px solid #E8D5B0">
    <div style="background:#006994;color:#FAF9F6;padding:32px 24px;text-align:center">
      <h1 style="margin:0;font-family:Georgia,serif;font-size:26px">${titulo}</h1>
    </div>
    <div style="padding:28px 24px;color:#3A3A3A;line-height:1.6">
      <p>Oi, <strong>${params.nome}</strong>!</p>
      <p>Recebemos seu presente: <strong>${params.presente}</strong> (${params.valor}).</p>
      <p>${texto}</p>
      <p style="margin-top:24px">Com carinho,<br/><strong>${WEDDING.noivos}</strong></p>
    </div>
    <div style="background:#E8D5B0;color:#3A3A3A;padding:16px;text-align:center;font-size:12px">
      ${WEDDING.dominio}
    </div>
  </div>`;

  await resend.emails.send({
    from: FROM,
    to: params.email,
    subject: `Recebemos seu presente — ${WEDDING.noivos} 💙`,
    html,
  });
}

/** Notifica o casal (ADMIN_EMAIL) quando alguém paga um presente. */
export async function sendPaymentNotificationToCasal(params: {
  pagadorNome: string;
  presenteNome: string;
  numeroCota: number;
  valorCota: string;
}) {
  const admin = process.env.ADMIN_EMAIL;
  if (!resend || !admin) return;

  const html = `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;background:#FAF9F6;border-radius:16px;overflow:hidden;border:1px solid #E8D5B0">
    <div style="background:#006994;color:#FAF9F6;padding:24px;text-align:center">
      <h1 style="margin:0;font-family:Georgia,serif;font-size:22px">🎁 Presente pago!</h1>
    </div>
    <div style="padding:24px;color:#3A3A3A;line-height:1.6">
      <p><strong>${params.pagadorNome}</strong> acabou de pagar uma cota de presente:</p>
      <p style="background:#EEEEE8;border-left:4px solid #006994;padding:12px;margin:16px 0">
        <strong>${params.presenteNome}</strong><br/>
        Cota #${params.numeroCota} · ${params.valorCota}
      </p>
      <p style="margin-top:20px;font-size:14px">
        <a href="https://${process.env.NEXT_PUBLIC_BASE_URL?.replace('https://', '') || 'www.kafamento.com.br'}/admin/presentes" style="color:#006994;text-decoration:none;font-weight:bold">Ver no painel →</a>
      </p>
    </div>
  </div>`;

  await resend.emails.send({
    from: FROM,
    to: admin,
    subject: `[kafamento] ${params.pagadorNome} pagou um presente 🎁`,
    html,
  });
}
