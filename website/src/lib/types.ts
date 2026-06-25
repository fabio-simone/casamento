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
  created_at: string;
}

export interface Gift {
  id: string;
  nome: string;
  descricao: string | null;
  valor_total: number;
  foto_url: string | null;
  created_at: string;
}

/** Item de um pedido (carrinho): presente + quantidade comprada. */
export interface GiftOrderItem {
  gift_id: string;
  nome: string;
  preco: number;
  quantidade: number;
}

/** Pedido de presentes (carrinho). */
export interface GiftOrder {
  id: string;
  pagador_nome: string | null;
  pagador_email: string | null;
  mensagem: string | null;
  itens: GiftOrderItem[];
  total: number;
  status: "pending" | "paid" | "failed";
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
