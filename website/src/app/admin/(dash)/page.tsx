import { ClipboardCheck, Users, Wallet, Gift, type LucideIcon } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getGifts, getGiftOrders } from "@/lib/gifts";
import { formatBRL, formatDateSP } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = createAdminClient();

  const { data: rsvps } = await supabase.from("rsvps").select("num_acompanhantes");
  const gifts = await getGifts();
  const orders = await getGiftOrders();
  const pagos = orders.filter((o) => o.status === "paid");

  const totalConfirmacoes = rsvps?.length ?? 0;
  const totalPessoas =
    rsvps?.reduce((acc, r) => acc + 1 + (r.num_acompanhantes ?? 0), 0) ?? 0;
  const arrecadado = pagos.reduce((acc, o) => acc + (Number(o.total) || 0), 0);

  const cards: { label: string; value: string | number; icon: LucideIcon }[] = [
    { label: "Confirmações (RSVP)", value: totalConfirmacoes, icon: ClipboardCheck },
    { label: "Total de pessoas", value: totalPessoas, icon: Users },
    { label: "Arrecadado em presentes", value: formatBRL(arrecadado), icon: Wallet },
    { label: "Pedidos pagos", value: `${pagos.length}`, icon: Gift },
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
        <h2 className="font-display text-xl font-bold text-urbano">Pedidos recentes</h2>
        <div className="mt-4 space-y-3">
          {pagos.slice(0, 6).map((o) => (
            <div key={o.id} className="card flex items-center justify-between gap-4">
              <div>
                <span className="font-medium text-urbano">{o.pagador_nome || "—"}</span>
                <p className="text-sm text-urbano/60">
                  {o.itens.reduce((a, i) => a + i.quantidade, 0)} item(ns) ·{" "}
                  {o.paid_at ? formatDateSP(o.paid_at, { dateStyle: "short" }) : "—"}
                </p>
              </div>
              <span className="font-semibold text-oceano">{formatBRL(Number(o.total) || 0)}</span>
            </div>
          ))}
          {pagos.length === 0 && (
            <p className="card text-center text-urbano/50">
              Nenhum presente comprado ainda. {gifts.length} presente(s) no catálogo.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
