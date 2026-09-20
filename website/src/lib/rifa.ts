import { cache } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { createAdminClient } from "./supabase/admin";

export interface RifaFaixa {
  min: number; // valor mínimo em R$ (inclusive)
  max: number | null; // valor máximo (null = ilimitado)
  mensagem: string;
}

export interface RifaConfig {
  titulo: string;
  descricao_premio: string;
  descricao_rifa: string;
  total_numeros: number;
  faixas: RifaFaixa[];
  ativa: boolean;
  // PIX direto (sem Mercado Pago)
  pix_chave: string;   // chave PIX do recebedor
  pix_nome: string;    // nome do recebedor (até 25 chars)
  pix_cidade: string;  // cidade (até 15 chars)
}

export const DEFAULT_FAIXAS: RifaFaixa[] = [
  { min: 0, max: 29, mensagem: "Sério mesmo? Até o Pix de R$0,01 tem mais dignidade 😅" },
  { min: 30, max: 49, mensagem: "Hmm... O vinho custa R$ 150. Mas tudo bem, conta o amor." },
  { min: 50, max: 99, mensagem: "Razoável! O casal agradece (com pequena ressalva)." },
  { min: 100, max: 199, mensagem: "Agora sim! Você está garantindo pelo menos a taça." },
  { min: 200, max: 399, mensagem: "Generoso! Desse jeito ganha abraço na festa." },
  { min: 400, max: 499, mensagem: "Isso é carinho com sobra! Você é uma pessoa incrível." },
  { min: 500, max: null, mensagem: "Ai sim, representou! Você é a pessoa favorita do casal agora 🍷" },
];

export const DEFAULT_RIFA_CONFIG: RifaConfig = {
  titulo: "Rifa do Casamento",
  descricao_premio: "Uma garrafa de vinho especial para o sortudo(a) que vai celebrar junto 🍷",
  descricao_rifa: "Escolha um ou mais números, pague quanto quiser por número e torça para a sorte jogar do seu lado. O sorteio será feito ao vivo na festa!",
  total_numeros: 50,
  faixas: DEFAULT_FAIXAS,
  ativa: true,
  pix_chave: "",
  pix_nome: "Kafamento",
  pix_cidade: "Sao Paulo",
};

export function getMensagemFaixa(valor: number, faixas: RifaFaixa[]): string {
  if (!valor || valor <= 0) return "";
  const faixa = faixas.find(
    (f) => valor >= f.min && (f.max === null || valor <= f.max)
  );
  return faixa?.mensagem ?? "";
}

function parseRifaConfig(raw: string | undefined): RifaConfig {
  if (!raw) return DEFAULT_RIFA_CONFIG;
  try {
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_RIFA_CONFIG,
      ...parsed,
      faixas: Array.isArray(parsed.faixas) && parsed.faixas.length > 0
        ? parsed.faixas
        : DEFAULT_RIFA_CONFIG.faixas,
    };
  } catch {
    return DEFAULT_RIFA_CONFIG;
  }
}

export const getRifaConfig = cache(async (): Promise<RifaConfig> => {
  noStore();
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "rifa_config")
      .single();
    return parseRifaConfig(data?.value);
  } catch {
    return DEFAULT_RIFA_CONFIG;
  }
});
