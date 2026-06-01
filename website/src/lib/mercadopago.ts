import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

if (!accessToken && process.env.NODE_ENV === "production") {
  // Em build sem env não quebramos; em runtime de produção é obrigatório.
  console.warn("[mercadopago] MERCADOPAGO_ACCESS_TOKEN não definido.");
}

export const mpClient = new MercadoPagoConfig({
  accessToken: accessToken ?? "TEST-TOKEN-PLACEHOLDER",
});

export const mpPreference = new Preference(mpClient);
export const mpPayment = new Payment(mpClient);
