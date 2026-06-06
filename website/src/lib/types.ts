export type QuotaStatus = "pending" | "paid";

export interface Rsvp {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  num_acompanhantes: number;
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
