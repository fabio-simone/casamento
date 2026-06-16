export type QuotaStatus = "pending" | "paid";

export type FaixaIdade = "ate7" | "8mais";

export const FAIXA_LABEL: Record<FaixaIdade, string> = {
  ate7: "Até 7 anos",
  "8mais": "A partir de 8 anos",
};

export const MAX_ACOMPANHANTES = 3;

export interface Acompanhante {
  nome: string;
  faixa: FaixaIdade;
}

export interface Rsvp {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  num_acompanhantes: number;
  acompanhantes: Acompanhante[] | null;
  restricao_alimentar: string | null;
  mensagem: string | null;
  created_at: string;
}

export interface Gift {
  id: string;
  nome: string;
  descricao: string | null;
  valor_total: number;
  num_cotas: number;
  foto_url: string | null;
  created_at: string;
}

export interface GiftQuota {
  id: string;
  gift_id: string;
  numero_cota: number;
  status: QuotaStatus;
  pagador_nome: string | null;
  pagador_email: string | null;
  mercadopago_payment_id: string | null;
  paid_at: string | null;
}

export interface GiftWithQuotas extends Gift {
  gift_quotas: GiftQuota[];
}

/** Item de um pedido (carrinho): presente + quantidade comprada. */
export interface GiftOrderItem {
  gift_id: string;
  nome: string;
  preco: number;
  quantidade: number;
}

/** Pedido de presentes (carrinho) — substitui o modelo de cotas. */
export interface GiftOrder {
  id: string;
  pagador_nome: string | null;
  pagador_email: string | null;
  mensagem: string | null;
  itens: GiftOrderItem[];
  total: number;
  status: "pending" | "paid";
  mercadopago_payment_id: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface Recado {
  id: string;
  nome: string;
  mensagem: string;
  created_at: string;
}

export interface SupportMessage {
  id: string;
  nome: string;
  email: string;
  tipo: string;
  descricao: string;
  codigo_erro: string | null;
  created_at: string;
}
