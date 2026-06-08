import { unstable_noStore as noStore } from "next/cache";
import { createAdminClient } from "./supabase/admin";
import { WEDDING } from "./constants";

export interface TimelineItem {
  ano: string;
  titulo: string;
  texto: string;
  foto: string;
  lado: "rio" | "sp";
}

export interface InfoBloco {
  icone: string; // chave do ícone (ver ICONES_INFO no page)
  titulo: string;
  itens: string[];
}

export interface InformacoesContent {
  blocos: InfoBloco[];
  mapa_endereco: string;
  mapa_query: string; // usado no Google Maps embed
}

export interface SiteContent {
  hero_foto: string; // foto do casal na home
  hero_sub: string; // subtítulo da home
  historia_intro: string; // parágrafo de abertura da página Nossa História
  historia_foto: string; // foto do casal na página Nossa História
  timeline: TimelineItem[];
  galeria: string[]; // URLs das fotos da galeria
  informacoes: InformacoesContent; // página Informações (local, horários...)
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

export const DEFAULT_INFORMACOES: InformacoesContent = {
  blocos: [
    {
      icone: "igreja",
      titulo: "Cerimônia",
      itens: [
        "Local: Espaço Vila Cordeiro",
        "Endereço: Rua Exemplo, 1000 — Vila Olímpia, São Paulo — SP",
        "Horário: 16h (horário de SP — sim, pontual)",
      ],
    },
    {
      icone: "taca",
      titulo: "Recepção",
      itens: [
        "Local: mesmo da cerimônia",
        "A partir das 18h",
        "Open bar com caipirinha (Rio) e chopp gelado (SP).",
      ],
    },
    {
      icone: "roupa",
      titulo: "Dress code",
      itens: [
        "Esporte fino — sem havaianas, Fábio.",
        "Mulheres: vestido midi ou longo.",
        "Homens: terno ou social. Gravata opcional.",
      ],
    },
    {
      icone: "hotel",
      titulo: "Hospedagem",
      itens: [
        "Cariocas: reservem hotel na região da Vila Olímpia / Itaim.",
        "Bloqueio de quartos com desconto no Hotel Exemplo (cód. KAFAMENTO).",
        "Dica: SP é grande, fiquem perto do local.",
      ],
    },
    {
      icone: "mapa",
      titulo: "Como chegar",
      itens: [
        "Metrô: estação Vila Olímpia (linha 9-Esmeralda) + 10 min a pé.",
        "Carro: estacionamento com valet no local.",
        "App de transporte: digite o endereço acima.",
      ],
    },
    {
      icone: "carro",
      titulo: "Estacionamento",
      itens: ["Valet disponível no evento.", "Vagas na rua: boa sorte, é São Paulo."],
    },
  ],
  mapa_endereco: "Rua Exemplo, 1000 — Vila Olímpia, São Paulo — SP",
  mapa_query: "Vila Olímpia, São Paulo - SP",
};

export const DEFAULT_CONTENT: SiteContent = {
  hero_foto: "",
  hero_sub: `Ela do Rio, ele de SP. Dois mundos, uma garoa, uma praia — e um casamento em ${WEDDING.dataExtenso}, em ${WEDDING.cidade}.`,
  historia_intro: "Spoiler: deu certo. Uma linha do tempo (bem-humorada) da gente.",
  historia_foto: "",
  timeline: DEFAULT_TIMELINE,
  galeria: [],
  informacoes: DEFAULT_INFORMACOES,
};

/** Faz o parse seguro de um array JSON guardado como string. */
function parseArray<T>(raw: string | undefined, fallback: T[]): T[] {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

/** Faz o parse seguro de um objeto JSON guardado como string. */
function parseObject<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? { ...fallback, ...parsed } : fallback;
  } catch {
    return fallback;
  }
}

/** Lê o conteúdo editável do site (com fallback para os textos padrão). */
export async function getContent(): Promise<SiteContent> {
  noStore(); // nunca usa cache — sempre lê o conteúdo mais recente do banco
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from("site_settings").select("key, value");
    const map = new Map((data ?? []).map((r) => [r.key as string, r.value as string]));

    const timelineParsed = parseArray<TimelineItem>(
      map.get("historia_timeline"),
      DEFAULT_TIMELINE
    );
    const timeline = timelineParsed.length > 0 ? timelineParsed : DEFAULT_TIMELINE;

    return {
      hero_foto: map.get("hero_foto") ?? DEFAULT_CONTENT.hero_foto,
      hero_sub: map.get("hero_sub") ?? DEFAULT_CONTENT.hero_sub,
      historia_intro: map.get("historia_intro") ?? DEFAULT_CONTENT.historia_intro,
      historia_foto: map.get("historia_foto") ?? DEFAULT_CONTENT.historia_foto,
      timeline,
      galeria: parseArray<string>(map.get("galeria"), []),
      informacoes: parseObject<InformacoesContent>(
        map.get("informacoes"),
        DEFAULT_INFORMACOES
      ),
    };
  } catch {
    // tabela ainda não criada / sem env — usa os padrões.
    return DEFAULT_CONTENT;
  }
}
