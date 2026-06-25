import { cache } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { createAdminClient } from "./supabase/admin";
import { WEDDING } from "./constants";
import { PALETA_CUSTOM_PADRAO, type PaletaCustom } from "./paletas";
import { FONTE_PADRAO } from "./fontes";

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

export interface EventoItem {
  hora: string;
  titulo: string;
  texto: string;
  icone: string;
  lado: "rio" | "sp";
}

export interface FaqItem {
  pergunta: string;
  resposta: string;
}

export interface PageHeader {
  eyebrow: string;
  titulo: string;
  intro: string;
}

export interface TextosContent {
  // Hero (home)
  hero_eyebrow: string;
  hero_btn_confirmar: string;
  hero_btn_presentes: string;
  // Status de pagamento (página Presentes)
  pgto_sucesso: string;
  pgto_pendente: string;
  pgto_falha: string;
  // RSVP (formulário)
  rsvp_btn: string;
  rsvp_sucesso_titulo: string;
  rsvp_sucesso_texto: string; // marcadores: {nome} {email}
  rsvp_ph_nome: string;
  rsvp_ph_email: string;
  rsvp_ph_telefone: string;
  // Presentes (card + modal)
  gift_btn_presentear: string;
  gift_btn_esgotado: string;
  gift_btn_pagar: string; // prefixo antes do valor
  gift_ph_nome: string;
  gift_ph_email: string;
  gift_ph_mensagem: string;
  // Contato / Suporte
  contato_btn: string;
  // Rodapé
  footer_tagline: string;
  footer_ajuda: string;
  footer_assinatura: string;
  // SEO (aba do navegador e compartilhamento)
  seo_titulo: string;
  seo_descricao: string;
}

export interface HomeContent {
  boas_vindas_titulo: string;
  contador_titulo: string;
  contador_texto: string;
  lado_rio_titulo: string;
  lado_rio_texto: string;
  lado_sp_titulo: string;
  lado_sp_texto: string;
  recados_eyebrow: string;
  recados_titulo: string;
  recados_texto: string;
  galeria_eyebrow: string;
  galeria_titulo: string;
  cta_titulo: string;
}

export interface SiteContent {
  paleta: string; // id da paleta de cores escolhida ("custom" usa paleta_custom)
  paleta_custom: PaletaCustom; // cores personalizadas (hex) quando paleta === "custom"
  fonte: string; // id da fonte de títulos escolhida
  textos: TextosContent; // botões e mensagens gerais do site
  hero_foto: string; // foto do casal na home
  hero_sub: string; // subtítulo da home
  home: HomeContent; // demais textos da home
  historia_intro: string; // parágrafo de abertura da página Nossa História
  historia_foto: string; // foto do casal na página Nossa História
  timeline: TimelineItem[];
  galeria: string[]; // URLs das fotos da galeria
  informacoes: InformacoesContent; // página Informações (local, horários...)
  cronograma: EventoItem[]; // momentos do dia
  faq: FaqItem[]; // perguntas e respostas
  paginas: Record<string, PageHeader>; // títulos/intro de cada página
  email_presente_titulo: string; // título do email de agradecimento por presente
  email_presente_texto: string; // corpo do email de agradecimento por presente
  email_rsvp_titulo: string; // título do email de confirmação de presença
  email_rsvp_texto: string; // corpo do email de confirmação (marcadores: {nome} {total} {data})
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

export const DEFAULT_CRONOGRAMA: EventoItem[] = [
  { hora: "Ontem", titulo: "Fábio chega ao local", texto: "Paulistano que é paulistano já está lá conferindo se tudo começa no horário.", icone: "predio", lado: "sp" },
  { hora: "15h30", titulo: "Recepção dos convidados", texto: "Welcome drink: água de coco para os cariocas, água com gás para os paulistas.", icone: "taca", lado: "rio" },
  { hora: "16h00", titulo: "Cerimônia", texto: "Início pontual (relógio de SP). Tragam lencinho — vai ter choro garantido.", icone: "anel", lado: "sp" },
  { hora: "16h20", titulo: "Karina entra", texto: "Karina chega no 'horário carioca' — ou seja, atrasada e linda. Vale a pena esperar.", icone: "estrela", lado: "rio" },
  { hora: "17h00", titulo: "Fotos & cumprimentos", texto: "Hora de tirar foto com todo mundo. Sim, inclusive com a tia que você não vê há 10 anos.", icone: "camera", lado: "sp" },
  { hora: "18h00", titulo: "Festa & jantar", texto: "Feijoada E pastel de feira. A diplomacia Rio-SP venceu. Open bar liberado.", icone: "prato", lado: "rio" },
  { hora: "20h00", titulo: "Pista liberada", texto: "Samba do Rio se mistura com o pop rock paulistano. Ninguém senta.", icone: "musica", lado: "sp" },
  { hora: "23h00", titulo: "Bem-casados & despedida", texto: "Leve seu bem-casado. O Fábio volta pra SP, a Karina sonha com a praia. Felizes para sempre.", icone: "coracao", lado: "rio" },
];

export const DEFAULT_FAQ: FaqItem[] = [
  { pergunta: "Vai ter feijoada ou pastel de feira?", resposta: "Os dois! A diplomacia Rio-SP foi negociada com carinho. Feijoada para os cariocas, pastel de feira para os paulistas, e todo mundo come das duas coisas mesmo." },
  { pergunta: "Posso ir de havaianas?", resposta: "Karina diria que sim. Fábio implora que não. O dress code é esporte fino, então deixe a havaiana para a praia (ou para o presente do Fábio na lista)." },
  { pergunta: "O Fábio já aprendeu a falar 'maravilhoso'?", resposta: "Está em treinamento intensivo. Já consegue dizer 'maravilhoso' sem fazer careta. Em troca, a Karina já fala 'mano' e até reclama do trânsito como uma paulistana raiz." },
  { pergunta: "Que horas começa, no horário carioca ou paulistano?", resposta: "Horário paulistano, ou seja: pontual. A cerimônia começa às 16h em ponto. Cariocas, por favor, somem 20 minutos do seu relógio interno." },
  { pergunta: "Posso levar acompanhante?", resposta: "Depende do seu convite — você indica o número de acompanhantes (até 3) na confirmação de presença. Confirme com antecedência para a gente organizar as mesas (e a feijoada)." },
  { pergunta: "Vai ter estacionamento?", resposta: "Sim, com valet no local. Se você é carioca e tem medo de dirigir em SP, recomendamos app de transporte ou o metrô (que, orgulho paulistano, funciona)." },
  { pergunta: "Crianças são bem-vindas?", resposta: "Amamos crianças! Confirme a presença delas como acompanhantes para garantirmos cardápio e cadeirinhas." },
  { pergunta: "Como faço para dar um presente?", resposta: "Na página de Presentes! Escolha um ou mais presentes, ajuste a quantidade e finalize o pagamento com cartão, Pix ou boleto via Mercado Pago." },
  { pergunta: "Qual o time da casa: Flamengo ou Corinthians?", resposta: "Essa é proibida. Por isso temos um item na lista de presentes: 'Fundo de emergência para não brigar sobre Flamengo'. Contribua pela paz do casal." },
];

export const DEFAULT_PAGINAS: Record<string, PageHeader> = {
  nossa_historia: { eyebrow: "Nossa História", titulo: "Como o Rio e SP decidiram morar juntos", intro: "" },
  informacoes: { eyebrow: "Informações", titulo: "Tudo que você precisa saber", intro: "" },
  cronograma: { eyebrow: "Cronograma · 22 de novembro", titulo: "O grande dia, minuto a minuto", intro: "Todos os horários no fuso de São Paulo. Cariocas, ajustem o relógio interno. 😉" },
  galeria: { eyebrow: "Galeria", titulo: "Nossos momentos", intro: "Um pouquinho da gente — do Rio a SP e por onde mais a vida levar." },
  presentes: { eyebrow: "Lista de Presentes", titulo: "Ajude a financiar essa fusão Rio-SP", intro: "Mais importante que o presente é a sua presença. Mas se quiser presentear, temos opções que vão de \"lua de mel\" a \"kit sobrevivência do Fábio no Rio\". 😄" },
  faq: { eyebrow: "FAQ", titulo: "Perguntas (quase) frequentes", intro: "Tudo que você queria perguntar, com a dose certa de Rio vs SP." },
  confirmar: { eyebrow: "RSVP", titulo: "Confirme sua presença", intro: "Bora celebrar o encontro do Rio com SP? Preenche aí embaixo que a gente já reserva seu lugar (e sua porção de feijoada)." },
  contato: { eyebrow: "Suporte", titulo: "Precisa de ajuda?", intro: "Teve algum problema para confirmar presença, pagar um presente ou abrir o site? Conta pra gente aqui embaixo — o casal recebe na hora e te ajuda a resolver." },
  mensagens: { eyebrow: "Mural de carinho", titulo: "Mensagens dos convidados", intro: "Todo o carinho que recebemos de quem é importante pra gente." },
};

export const DEFAULT_HOME: HomeContent = {
  boas_vindas_titulo: "Sejam bem-vindos!",
  contador_titulo: "Faltam só...",
  contador_texto:
    "...para a Karina chegar (no horário carioca) e o Fábio reclamar do trânsito.",
  lado_rio_titulo: "Lado Karina (Rio)",
  lado_rio_texto:
    'Praia, samba no pé, "maravilhoso!" a cada cinco minutos e a certeza de que 25°C é frio.',
  lado_sp_titulo: "Lado Fábio (SP)",
  lado_sp_texto:
    'Garoa, rodízio de pizza às sextas, "mano" no vocabulário e orgulho do metrô que funciona.',
  recados_eyebrow: "Mural de carinho",
  recados_titulo: "Recados dos convidados",
  recados_texto: "O que quem ama a gente anda mandando junto com os presentes. 💙",
  galeria_eyebrow: "Galeria",
  galeria_titulo: "Nossos momentos",
  cta_titulo: "Vem celebrar com a gente essa mistura improvável que deu super certo.",
};

export const DEFAULT_TEXTOS: TextosContent = {
  hero_eyebrow: "O Rio encontra SP",
  hero_btn_confirmar: "Confirmar presença",
  hero_btn_presentes: "Lista de presentes",
  pgto_sucesso:
    "🎉 Pagamento recebido! Assim que confirmado, seu presente é registrado. Muito obrigado!",
  pgto_pendente:
    "⏳ Pagamento pendente. Assim que for aprovado, registramos seu presente.",
  pgto_falha:
    "😕 O pagamento não foi concluído. Você pode tentar de novo quando quiser.",
  rsvp_btn: "Confirmar presença",
  rsvp_sucesso_titulo: "Presença confirmada!",
  rsvp_sucesso_texto:
    "Obrigado, {nome}! Enviamos um e-mail de confirmação para {email}. Já já a gente se vê em SP — com sotaque misturado e tudo.",
  rsvp_ph_nome: "Seu nome completo",
  rsvp_ph_email: "voce@email.com",
  rsvp_ph_telefone: "(11) 99999-9999",
  gift_btn_presentear: "Presentear",
  gift_btn_esgotado: "Presente completo 💙",
  gift_btn_pagar: "Pagar",
  gift_ph_nome: "Para o casal saber quem presenteou 💙",
  gift_ph_email: "voce@email.com",
  gift_ph_mensagem: "Deixe um recado carinhoso — ele aparece no mural do site 💙",
  contato_btn: "Enviar mensagem",
  footer_tagline: "O Rio encontra SP",
  footer_ajuda: "Precisa de ajuda? Fale com a gente",
  footer_assinatura: "Feito com café paulistano e água de coco carioca.",
  seo_titulo: `${WEDDING.noivos} — Casamento`,
  seo_descricao: `O Rio encontra SP. ${WEDDING.noivos} vão se casar em ${WEDDING.dataExtenso}, em ${WEDDING.cidade}. Confirme presença e veja a lista de presentes.`,
};

export const DEFAULT_CONTENT: SiteContent = {
  paleta: "rio_sp",
  paleta_custom: PALETA_CUSTOM_PADRAO,
  fonte: FONTE_PADRAO,
  textos: DEFAULT_TEXTOS,
  hero_foto: "",
  hero_sub: `Ela do Rio, ele de SP. Dois mundos, uma garoa, uma praia — e um casamento em ${WEDDING.dataExtenso}, em ${WEDDING.cidade}.`,
  home: DEFAULT_HOME,
  historia_intro: "Spoiler: deu certo. Uma linha do tempo (bem-humorada) da gente.",
  historia_foto: "",
  timeline: DEFAULT_TIMELINE,
  galeria: [],
  informacoes: DEFAULT_INFORMACOES,
  cronograma: DEFAULT_CRONOGRAMA,
  faq: DEFAULT_FAQ,
  paginas: DEFAULT_PAGINAS,
  email_presente_titulo: "Obrigado! 💙",
  email_presente_texto: "Você acaba de contribuir para a paz mundial entre Vasco e a garoa paulistana. Gratidão! 🌊🏙️",
  email_rsvp_titulo: "Presença confirmada! 🎉",
  email_rsvp_texto:
    "Oi, {nome}! 🌊🏙️\nSua presença está confirmadíssima. Anotamos {total} no nosso mapa (sim, com sotaque carioca e paulistano misturados).\nAgora é só contar os dias para o dia {data}. Prometemos feijoada e pastel de feira. 😄",
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

/**
 * Lê o conteúdo editável do site (com fallback para os textos padrão).
 * Memoizado por request (React.cache): layout, metadata e página compartilham
 * uma única consulta ao banco em vez de repetir a query.
 */
export const getContent = cache(async (): Promise<SiteContent> => {
  noStore(); // sempre lê o conteúdo mais recente do banco (request a request)
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
      paleta: map.get("paleta") ?? DEFAULT_CONTENT.paleta,
      paleta_custom: parseObject<PaletaCustom>(
        map.get("paleta_custom"),
        PALETA_CUSTOM_PADRAO
      ),
      fonte: map.get("fonte") ?? DEFAULT_CONTENT.fonte,
      textos: parseObject<TextosContent>(map.get("textos"), DEFAULT_TEXTOS),
      hero_foto: map.get("hero_foto") ?? DEFAULT_CONTENT.hero_foto,
      hero_sub: map.get("hero_sub") ?? DEFAULT_CONTENT.hero_sub,
      home: parseObject<HomeContent>(map.get("home"), DEFAULT_HOME),
      historia_intro: map.get("historia_intro") ?? DEFAULT_CONTENT.historia_intro,
      historia_foto: map.get("historia_foto") ?? DEFAULT_CONTENT.historia_foto,
      timeline,
      galeria: parseArray<string>(map.get("galeria"), []),
      informacoes: parseObject<InformacoesContent>(
        map.get("informacoes"),
        DEFAULT_INFORMACOES
      ),
      cronograma: (() => {
        const c = parseArray<EventoItem>(map.get("cronograma"), DEFAULT_CRONOGRAMA);
        return c.length > 0 ? c : DEFAULT_CRONOGRAMA;
      })(),
      faq: (() => {
        const f = parseArray<FaqItem>(map.get("faq"), DEFAULT_FAQ);
        return f.length > 0 ? f : DEFAULT_FAQ;
      })(),
      paginas: parseObject<Record<string, PageHeader>>(
        map.get("paginas"),
        DEFAULT_PAGINAS
      ),
      email_presente_titulo: map.get("email_presente_titulo") ?? DEFAULT_CONTENT.email_presente_titulo,
      email_presente_texto: map.get("email_presente_texto") ?? DEFAULT_CONTENT.email_presente_texto,
      email_rsvp_titulo: map.get("email_rsvp_titulo") ?? DEFAULT_CONTENT.email_rsvp_titulo,
      email_rsvp_texto: map.get("email_rsvp_texto") ?? DEFAULT_CONTENT.email_rsvp_texto,
    };
  } catch {
    // tabela ainda não criada / sem env — usa os padrões.
    return DEFAULT_CONTENT;
  }
});
