// Dados centrais do casamento — fonte única de verdade.
export const WEDDING = {
  noivos: "Fabio & Karina",
  noivo: "Fabio",
  noiva: "Karina",
  // 22 de novembro de 2026, 16h, horário de São Paulo (America/Sao_Paulo, UTC-3)
  dataISO: "2026-11-22T16:00:00-03:00",
  dataExtenso: "22 de novembro de 2026",
  dataCurta: "22/11",
  dataNumerica: "22 · 11 · 2026",
  cidade: "São Paulo",
  dominio: "kafamento.com.br",
  cerimonia: {
    nome: "Espaço Vila Cordeiro",
    endereco: "Rua Exemplo, 1000 — Vila Olímpia, São Paulo — SP",
    horario: "16h",
    mapsQuery: "Vila Olímpia, São Paulo - SP",
  },
  recepcao: {
    nome: "Mesmo local",
    horario: "18h",
  },
  dressCode: "Esporte fino — sem havaianas, Fabio.",
} as const;

export const TIMEZONE = "America/Sao_Paulo";
