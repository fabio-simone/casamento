import { ClipboardCheck, Users, Wallet, Gift, type LucideIcon } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getGiftsWithQuotas } from "@/lib/gifts";
import { formatBRL } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = createAdminClient();

  const { data: rsvps } = await supabase
    .from("rsvps")
    .select("num_acompanhantes");
  const gifts = await getGiftsWithQuotas();

  const totalConfirmacoes = rsvps?.length ?? 0;
  const totalPessoas =
    rsvps?.reduce((acc, r) => acc + 1 + (r.num_acompanhantes ?? 0), 0) ?? 0;

  let arrecadado = 0;
  let presentesCompletos = 0;
  for (const g of gifts) {
    const valorCota = g.valor_total / g.num_cotas;
    const pagas = g.gift_quotas.filter((q) => q.status === "paid").length;
    arrecadado += pagas * valorCota;
    if (pagas >= g.num_cotas) presentesCompletos += 1;
  }

  const cards: { label: string; value: string | number; icon: LucideIcon }[] = [
    { label: "Confirmações (RSVP)", value: totalConfirmacoes, icon: ClipboardCheck },
    { label: "Total de pessoas", value: totalPessoas, icon: Users },
    { label: "Arrecadado em presentes", value: formatBRL(arrecadado), icon: Wallet },
    { label: "Presentes 100% pagos", value: `${presentesCompletos} / ${gifts.length}`, icon: Gift },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-urbano">Dashboard</h1>
      <p className="mt-1 text-urbano/60">Visão geral do casamento Karina &amp; Fábio.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
          <div key={c.label} className="card">
            <Icon className="h-7 w-7 text-oceano" strokeWidth={1.5} />
            <p className="mt-3 text-2xl font-bold text-oceano">{c.value}</p>
            <p className="text-sm text-urbano/60">{c.label}</p>
          </div>
          );
        })}
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl font-bold text-urbano">
          Progresso dos presentes
        </h2>
        <div className="mt-4 space-y-3">
          {gifts.map((g) => {
            const pagas = g.gift_quotas.filter((q) => q.status === "paid").length;
            const pct = Math.round((pagas / g.num_cotas) * 100);
            return (
              <div key={g.id} className="card">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-urbano">{g.nome}</span>
                  <span className="text-sm text-urbano/60">
                    {pagas}/{g.num_cotas} · {formatBRL((g.valor_total / g.num_cotas) * pagas)}
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-areia/60">
                  <div className="h-full rounded-full bg-oceano" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
