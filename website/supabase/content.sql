-- ============================================================
-- Kafamento — Tabela de conteúdo editável do site (CMS leve)
-- Rode no SQL Editor do Supabase (depois do schema.sql).
-- Guarda textos e URLs de fotos editáveis pelo painel /admin/conteudo.
-- ============================================================

create table if not exists public.site_settings (
  key        text primary key,
  value      text,
  updated_at timestamptz not null default now()
);

-- Acesso só pelo servidor (service role). RLS ativo, sem políticas anon.
alter table public.site_settings enable row level security;
