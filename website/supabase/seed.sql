-- ============================================================
-- Kafamento — Seed de presentes iniciais
-- Rode DEPOIS do schema.sql. Cria os presentes de exemplo e
-- gera automaticamente as cotas (pending) de cada um.
-- ============================================================

do $$
declare
  g_id uuid;
  i int;
begin
  -- Limpa seeds anteriores (opcional — comente se não quiser apagar)
  -- delete from public.gifts;

  -- 1) Fundo de emergência — R$ 500 (1 cota)
  insert into public.gifts (nome, descricao, valor_total, num_cotas)
  values (
    'Fundo de emergência para não brigar sobre Flamengo',
    'Para manter a paz mundial entre o Rio e SP nos dias de clássico. Investimento em terapia de casal incluso.',
    500.00, 1
  ) returning id into g_id;
  for i in 1..1 loop
    insert into public.gift_quotas (gift_id, numero_cota) values (g_id, i);
  end loop;

  -- 2) Passagem Rio–SP para visita da sogra — R$ 800 (4 cotas de R$ 200)
  insert into public.gifts (nome, descricao, valor_total, num_cotas)
  values (
    'Passagem Rio–SP para visita da sogra',
    'A ponte aérea mais importante do casamento. A sogra agradece, o casal... também (juramos).',
    800.00, 4
  ) returning id into g_id;
  for i in 1..4 loop
    insert into public.gift_quotas (gift_id, numero_cota) values (g_id, i);
  end loop;

  -- 3) Kit sobrevivência do Fabio no Rio — R$ 300 (1 cota)
  insert into public.gifts (nome, descricao, valor_total, num_cotas)
  values (
    'Kit sobrevivência do Fabio no Rio: havaianas + protetor solar 70',
    'Para o paulistano não derreter na praia nem voltar vermelho que nem pimentão. FPS 70, no mínimo.',
    300.00, 1
  ) returning id into g_id;
  for i in 1..1 loop
    insert into public.gift_quotas (gift_id, numero_cota) values (g_id, i);
  end loop;

  -- 4) Kit sobrevivência da Karina em SP — R$ 250 (1 cota)
  insert into public.gifts (nome, descricao, valor_total, num_cotas)
  values (
    'Kit sobrevivência da Karina em SP: agasalho + cartão do metrô',
    'Porque 18°C em SP, para a carioca, é praticamente uma nevasca. Bilhete Único recarregado de brinde.',
    250.00, 1
  ) returning id into g_id;
  for i in 1..1 loop
    insert into public.gift_quotas (gift_id, numero_cota) values (g_id, i);
  end loop;

  -- 5) Lua de mel — R$ 5.000 (10 cotas de R$ 500)
  insert into public.gifts (nome, descricao, valor_total, num_cotas)
  values (
    'Lua de mel',
    'Um lugar neutro, sem garoa e sem Cristo Redentor, onde Rio e SP fazem as pazes definitivamente. 🌴',
    5000.00, 10
  ) returning id into g_id;
  for i in 1..10 loop
    insert into public.gift_quotas (gift_id, numero_cota) values (g_id, i);
  end loop;
end $$;
