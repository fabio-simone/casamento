// Dados centrais do casamento — fonte única de verdade.
export const WEDDING = {
  noivos: "Karina & Fábio",
  noivo: "Fábio",
  noiva: "Karina",
  // 22 de novembro de 2026, 15h, horário de São Paulo (America/Sao_Paulo, UTC-3)
  dataISO: "2026-11-22T15:00:00-03:00",
  dataExtenso: "22 de novembro de 2026",
  dataCurta: "22/11",
  dataNumerica: "22 · 11 · 2026",
  cidade: "São Paulo",
  dominio: "kafamento.com.br",
  cerimonia: {
    nome: "Espaço Vila Cordeiro",
    endereco: "Rua Exemplo, 1000 — Vila Olímpia, São Paulo — SP",
    horario: "15h",
    mapsQuery: "Vila Olímpia, São Paulo - SP",
  },
  recepcao: {
    nome: "Mesmo local",
    horario: "17h",
  },
  dressCode: "Esporte fino — sem havaianas, Fábio.",
} as const;

export const TIMEZONE = "America/Sao_Paulo";
