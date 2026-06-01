-- ============================================================
-- Kafamento — Setup do banco de dados (Supabase / PostgreSQL)
-- Rode este script no SQL Editor do Supabase.
-- ============================================================

-- Extensão para gerar UUIDs
create extension if not exists "pgcrypto";

-- ─── Confirmações de presença (RSVP) ────────────────────────
create table if not exists public.rsvps (
  id                  uuid primary key default gen_random_uuid(),
  nome                text not null,
  email               text not null,
  telefone            text,
  num_acompanhantes   int  not null default 0 check (num_acompanhantes >= 0 and num_acompanhantes <= 5),
  restricao_alimentar text,
  mensagem            text,
  created_at          timestamptz not null default now()
);

-- ─── Presentes ──────────────────────────────────────────────
create table if not exists public.gifts (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  descricao   text,
  valor_total numeric(10,2) not null check (valor_total > 0),
  num_cotas   int not null default 1 check (num_cotas >= 1),
  foto_url    text,
  created_at  timestamptz not null default now()
);

-- ─── Cotas de presentes ─────────────────────────────────────
create table if not exists public.gift_quotas (
  id                     uuid primary key default gen_random_uuid(),
  gift_id                uuid not null references public.gifts(id) on delete cascade,
  numero_cota            int not null,
  status                 text not null default 'pending' check (status in ('pending','paid')),
  pagador_nome           text,
  pagador_email          text,
  mercadopago_payment_id text,
  paid_at                timestamptz,
  unique (gift_id, numero_cota)
);

create index if not exists idx_gift_quotas_gift on public.gift_quotas(gift_id);
create index if not exists idx_gift_quotas_status on public.gift_quotas(status);

-- ─── Recados (mural de mensagens dos convidados) ────────────
create table if not exists public.recados (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  mensagem   text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- O app acessa os dados pelo lado servidor usando a SERVICE ROLE
-- KEY (que ignora RLS). Por isso, mantemos RLS ATIVO e sem
-- políticas para o papel anônimo — ninguém lê/escreve direto do
-- navegador com a anon key. Auth do admin usa o Supabase Auth.
-- ============================================================
alter table public.rsvps       enable row level security;
alter table public.gifts       enable row level security;
alter table public.gift_quotas enable row level security;
alter table public.recados     enable row level security;

-- (Sem políticas para anon = acesso negado por padrão. Service role bypassa.)

-- ============================================================
-- Storage: bucket para fotos do casal/presentes
-- ============================================================
insert into storage.buckets (id, name, public)
values ('fotos', 'fotos', true)
on conflict (id) do nothing;
