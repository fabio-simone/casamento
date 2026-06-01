import { Resend } from "resend";
import { WEDDING } from "./constants";

const resendKey = process.env.RESEND_API_KEY;
const FROM = process.env.RESEND_FROM_EMAIL ?? "Kafamento <casal@kafamento.com.br>";

const resend = resendKey ? new Resend(resendKey) : null;

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
  const html = `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;background:#FAF9F6;border-radius:16px;overflow:hidden;border:1px solid #E8D5B0">
    <div style="background:#006994;color:#FAF9F6;padding:32px 24px;text-align:center">
      <h1 style="margin:0;font-family:Georgia,serif;font-size:28px">${WEDDING.noivos}</h1>
      <p style="margin:8px 0 0;opacity:.9">${WEDDING.dataExtenso} · ${WEDDING.cidade}</p>
    </div>
    <div style="padding:28px 24px;color:#3A3A3A;line-height:1.6">
      <p>Oi, <strong>${params.nome}</strong>! 🌊🏙️</p>
      <p>Sua presença está <strong>confirmadíssima</strong>. Anotamos <strong>${total} ${
        total === 1 ? "pessoa" : "pessoas"
      }</strong> no nosso mapa (sim, com sotaque carioca e paulistano misturados).</p>
      <p>Agora é só contar os dias para o dia <strong>${WEDDING.dataCurta}</strong>. Prometemos feijoada <em>e</em> pastel de feira. 😄</p>
      <p style="margin-top:24px">Com carinho,<br/><strong>Fabio & Karina</strong></p>
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

  const html = `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;background:#FAF9F6;border-radius:16px;overflow:hidden;border:1px solid #E8D5B0">
    <div style="background:#006994;color:#FAF9F6;padding:32px 24px;text-align:center">
      <h1 style="margin:0;font-family:Georgia,serif;font-size:26px">Obrigado! 💙</h1>
    </div>
    <div style="padding:28px 24px;color:#3A3A3A;line-height:1.6">
      <p>Oi, <strong>${params.nome}</strong>!</p>
      <p>Recebemos seu presente: <strong>${params.presente}</strong> (${params.valor}).</p>
      <p>Você acaba de contribuir para a paz mundial entre Flamengo e a garoa paulistana. Gratidão! 🌊🏙️</p>
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
