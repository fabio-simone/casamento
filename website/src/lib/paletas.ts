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

export function getPaleta(id: string | undefined): Paleta {
  return PALETAS.find((p) => p.id === id) ?? PALETAS[0];
}

/** Gera o CSS (:root { --color-...}) para uma paleta. */
export function paletaCss(id: string | undefined): string {
  const { cores } = getPaleta(id);
  return `:root{--color-oceano:${cores.oceano};--color-oceanoDark:${cores.oceanoDark};--color-laranja:${cores.laranja};--color-areia:${cores.areia};--color-urbano:${cores.urbano};--color-offwhite:${cores.offwhite};}`;
}
