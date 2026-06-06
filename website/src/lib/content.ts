import { createAdminClient } from "./supabase/admin";
import { WEDDING } from "./constants";

export interface TimelineItem {
  ano: string;
  titulo: string;
  texto: string;
  foto: string;
  lado: "rio" | "sp";
}

export interface SiteContent {
  hero_foto: string; // foto do casal na home
  hero_sub: string; // subtítulo da home
  historia_intro: string; // parágrafo de abertura da página Nossa História
  historia_foto: string; // foto do casal na página Nossa História
  timeline: TimelineItem[];
}

export const DEFAULT_TIMELINE: TimelineItem[] = [
  {
    ano: "O encontro",
    titulo: "Ela do Rio, ele de SP",
    texto:
      "Karina dizia 'maravilhoso', Fábio respondia 'mano, que isso'. Foi amor à primeira tradução simultânea.",
    foto: "",
    lado: "rio",
  },
  {
    ano: "O primeiro date",
    titulo: "Praia ou rodízio?",
    texto:
      "Empate técnico: foram à praia de manhã (ideia dela) e a um rodízio de pizza à noite (ideia dele). Ninguém saiu perdendo.",
    foto: "",
    lado: "sp",
  },
  {
    ano: "A primeira viagem",
    titulo: "Ponte aérea oficial",
    texto:
      "A GOL e a LATAM deviam dar milhas extras pra esse casal. Rio–SP virou rotina, e a sogra ganhou quarto fixo nas duas cidades.",
    foto: "",
    lado: "rio",
  },
  {
    ano: "O pedido",
    titulo: "Sim, com sotaque",
    texto:
      "Ele ensaiou em 'paulistanês', ela respondeu em 'carioquês'. No fim, o 'sim' é universal — e veio com choro dos dois.",
    foto: "",
    lado: "sp",
  },
  {
    ano: "Agora",
    titulo: `${WEDDING.dataCurta} — o grande dia`,
    texto:
      "Onde o oceano de Copacabana encontra o concreto da Paulista. Vem ver de perto essa fusão dar certo.",
    foto: "",
    lado: "rio",
  },
];

export const DEFAULT_CONTENT: SiteContent = {
  hero_foto: "",
  hero_sub: `Ela do Rio, ele de SP. Dois mundos, uma garoa, uma praia — e um casamento em ${WEDDING.dataExtenso}, em ${WEDDING.cidade}.`,
  historia_intro: "Spoiler: deu certo. Uma linha do tempo (bem-humorada) da gente.",
  historia_foto: "",
  timeline: DEFAULT_TIMELINE,
};

/** Lê o conteúdo editável do site (com fallback para os textos padrão). */
export async function getContent(): Promise<SiteContent> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from("site_settings").select("key, value");
    const map = new Map((data ?? []).map((r) => [r.key as string, r.value as string]));

    let timeline = DEFAULT_TIMELINE;
    const raw = map.get("historia_timeline");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) timeline = parsed;
      } catch {
        /* mantém o padrão */
      }
    }

    return {
      hero_foto: map.get("hero_foto") ?? DEFAULT_CONTENT.hero_foto,
      hero_sub: map.get("hero_sub") ?? DEFAULT_CONTENT.hero_sub,
      historia_intro: map.get("historia_intro") ?? DEFAULT_CONTENT.historia_intro,
      historia_foto: map.get("historia_foto") ?? DEFAULT_CONTENT.historia_foto,
      timeline,
    };
  } catch {
    // tabela ainda não criada / sem env — usa os padrões.
    return DEFAULT_CONTENT;
  }
}
