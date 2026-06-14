// Fontes escolhíveis no painel para os títulos/destaques do site.
// As fontes são carregadas no layout raiz (next/font) e expostas como variáveis CSS.
// Módulo client-safe (sem imports de servidor).

export interface FonteOpcao {
  id: string;
  nome: string;
  cssVar: string; // variável CSS da fonte (definida no layout raiz)
  descricao: string;
}

export const FONTES: FonteOpcao[] = [
  {
    id: "playfair",
    nome: "Playfair Display",
    cssVar: "var(--font-playfair)",
    descricao: "Atual — clássica e marcante",
  },
  {
    id: "cormorant",
    nome: "Cormorant Garamond",
    cssVar: "var(--font-cormorant)",
    descricao: "Delicada e fininha",
  },
  {
    id: "eb_garamond",
    nome: "EB Garamond",
    cssVar: "var(--font-eb-garamond)",
    descricao: "Suave e atemporal",
  },
  {
    id: "marcellus",
    nome: "Marcellus",
    cssVar: "var(--font-marcellus)",
    descricao: "Elegante e leve",
  },
  {
    id: "tenor",
    nome: "Tenor Sans",
    cssVar: "var(--font-tenor)",
    descricao: "Sutil e arejada",
  },
];

export const FONTE_PADRAO = "playfair";

export function getFonte(id: string | undefined): FonteOpcao {
  return FONTES.find((f) => f.id === id) ?? FONTES[0];
}

/** CSS que aponta a fonte de títulos (--font-display) para a fonte escolhida. */
export function fonteCss(id: string | undefined): string {
  return `:root{--font-display:${getFonte(id).cssVar};}`;
}
