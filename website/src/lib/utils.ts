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

/**
 * Extrai a posição de enquadramento embutida na URL (ex.: "...jpg#pos=50,35")
 * e devolve um valor de object-position. Padrão: topo (preserva rostos).
 */
export function objectPositionFromUrl(url: string | null | undefined): string {
  if (!url) return "50% 30%";
  const m = url.match(/#pos=(\d{1,3}),(\d{1,3})/);
  return m ? `${m[1]}% ${m[2]}%` : "50% 30%";
}
