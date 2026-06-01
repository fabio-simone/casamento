import { createAdminClient } from "@/lib/supabase/admin";
import { formatBRL, formatDateSP } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PaidRow {
  id: string;
  numero_cota: number;
  pagador_nome: string | null;
  pagador_email: string | null;
  mercadopago_payment_id: string | null;
  paid_at: string | null;
  gifts: { nome: string; valor_total: number; num_cotas: number } | null;
}

export default async function AdminPagamentosPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("gift_quotas")
    .select(
      "id, numero_cota, pagador_nome, pagador_email, mercadopago_payment_id, paid_at, gifts(nome, valor_total, num_cotas)"
    )
    .eq("status", "paid")
    .order("paid_at", { ascending: false });

  const rows = (data ?? []) as unknown as PaidRow[];
  const total = rows.reduce((acc, r) => {
    if (!r.gifts) return acc;
    return acc + r.gifts.valor_total / r.gifts.num_cotas;
  }, 0);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-urbano">Histórico de pagamentos</h1>
      <p className="mt-1 text-urbano/60">
        Transações aprovadas recebidas via Mercado Pago.
      </p>

      <div className="mt-6 mb-4 flex gap-4 text-sm text-urbano/70">
        <span><strong>{rows.length}</strong> pagamentos</span>
        <span>Total: <strong className="text-oceano">{formatBRL(total)}</strong></span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-areia bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-oceano/5 text-urbano/70">
            <tr>
              <th className="px-4 py-3">Presente</th>
              <th className="px-4 py-3">Cota</th>
              <th className="px-4 py-3">Pagador</th>
              <th className="px-4 py-3">Valor</th>
              <th className="px-4 py-3">ID MP</th>
              <th className="px-4 py-3">Data</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-areia/60">
                <td className="px-4 py-3 font-medium text-urbano">{r.gifts?.nome ?? "—"}</td>
                <td className="px-4 py-3 text-urbano/70">#{r.numero_cota}</td>
                <td className="px-4 py-3 text-urbano/70">
                  {r.pagador_nome || "—"}
                  {r.pagador_email && (
                    <div className="text-xs text-urbano/40">{r.pagador_email}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-oceano">
                  {r.gifts ? formatBRL(r.gifts.valor_total / r.gifts.num_cotas) : "—"}
                </td>
                <td className="px-4 py-3 text-xs text-urbano/40">
                  {r.mercadopago_payment_id || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-urbano/50">
                  {r.paid_at ? formatDateSP(r.paid_at) : "—"}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-urbano/50">
                  Nenhum pagamento recebido ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
