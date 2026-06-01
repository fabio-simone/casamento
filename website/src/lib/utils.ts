import { TIMEZONE } from "./constants";

/** Formata centavos/reais para BRL. Recebe valor em reais (number). */
export function formatBRL(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

/** Formata uma data ISO no fuso de São Paulo. */
export function formatDateSP(
  iso: string,
  opts: Intl.DateTimeFormatOptions = { dateStyle: "short", timeStyle: "short" }
): string {
  return new Intl.DateTimeFormat("pt-BR", {
    ...opts,
    timeZone: TIMEZONE,
  }).format(new Date(iso));
}

/** Junta classes condicionalmente (mini clsx). */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
