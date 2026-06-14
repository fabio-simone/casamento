// Paletas de cores escolhíveis no painel. Valores são canais RGB (ex.: "0 105 148"),
// usados nas variáveis CSS --color-*. Módulo client-safe (sem imports de servidor).

export interface Paleta {
  id: string;
  nome: string;
  cores: {
    oceano: string;
    oceanoDark: string;
    laranja: string;
    areia: string;
    urbano: string;
    offwhite: string;
  };
}

export const PALETAS: Paleta[] = [
  {
    id: "rio_sp",
    nome: "Rio × SP (azul & laranja)",
    cores: {
      oceano: "0 105 148",
      oceanoDark: "4 71 106",
      laranja: "224 122 63",
      areia: "232 213 176",
      urbano: "58 58 58",
      offwhite: "250 249 246",
    },
  },
  {
    id: "por_do_sol",
    nome: "Pôr do sol (terracota)",
    cores: {
      oceano: "184 85 46",
      oceanoDark: "74 41 26",
      laranja: "216 154 78",
      areia: "237 217 184",
      urbano: "60 50 45",
      offwhite: "251 246 239",
    },
  },
  {
    id: "oliva",
    nome: "Oliva & areia (verde)",
    cores: {
      oceano: "94 115 85",
      oceanoDark: "42 56 39",
      laranja: "198 107 61",
      areia: "226 216 190",
      urbano: "56 56 52",
      offwhite: "249 248 243",
    },
  },
  {
    id: "vinho",
    nome: "Vinho & dourado",
    cores: {
      oceano: "123 45 58",
      oceanoDark: "66 22 31",
      laranja: "201 162 75",
      areia: "232 220 197",
      urbano: "58 52 52",
      offwhite: "250 248 244",
    },
  },
  {
    id: "marinho",
    nome: "Azul-marinho & dourado",
    cores: {
      oceano: "31 58 95",
      oceanoDark: "18 34 56",
      laranja: "201 162 75",
      areia: "230 220 200",
      urbano: "51 51 51",
      offwhite: "250 250 248",
    },
  },
];

export const PALETA_PADRAO = "rio_sp";

/** Cores escolhidas manualmente no modo "Personalizada" (valores em hex). */
export interface PaletaCustom {
  oceano: string; // cor principal
  laranja: string; // destaque
  areia: string; // tom claro / fundo
  urbano: string; // texto escuro
}

export const PALETA_CUSTOM_PADRAO: PaletaCustom = {
  oceano: "#006994",
  laranja: "#e07a3f",
  areia: "#e8d5b0",
  urbano: "#3a3a3a",
};

/** "#rrggbb" → "r g b" (canais usados nas variáveis CSS). */
function hexParaCanais(hex: string): string {
  const h = (hex || "").replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  if (full.length !== 6 || Number.isNaN(n)) return "0 105 148";
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/** Escurece canais "r g b" por um fator (0–1) — usado p/ derivar o tom escuro. */
function escurecerCanais(canais: string, fator: number): string {
  return canais
    .split(" ")
    .map((v) => Math.max(0, Math.round(Number(v) * fator)))
    .join(" ");
}

export function getPaleta(id: string | undefined): Paleta {
  return PALETAS.find((p) => p.id === id) ?? PALETAS[0];
}

/** Gera o CSS (:root { --color-...}) para uma paleta (ou cores personalizadas). */
export function paletaCss(id: string | undefined, custom?: PaletaCustom): string {
  let cores;
  if (id === "custom" && custom) {
    const oceano = hexParaCanais(custom.oceano);
    cores = {
      oceano,
      oceanoDark: escurecerCanais(oceano, 0.5),
      laranja: hexParaCanais(custom.laranja),
      areia: hexParaCanais(custom.areia),
      urbano: hexParaCanais(custom.urbano),
      offwhite: "250 249 246",
    };
  } else {
    cores = getPaleta(id).cores;
  }
  return `:root{--color-oceano:${cores.oceano};--color-oceanoDark:${cores.oceanoDark};--color-laranja:${cores.laranja};--color-areia:${cores.areia};--color-urbano:${cores.urbano};--color-offwhite:${cores.offwhite};}`;
}
