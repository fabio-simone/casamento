import { getGiftOrders } from "@/lib/gifts";
import { formatBRL, formatDateSP } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPagamentosPage() {
  const orders = await getGiftOrders();
  const pagos = orders.filter((o) => o.status === "paid");
  const total = pagos.reduce((acc, o) => acc + (Number(o.total) || 0), 0);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-urbano">Histórico de pagamentos</h1>
      <p className="mt-1 text-urbano/60">
        Pedidos de presentes aprovados via Mercado Pago.
      </p>

      <div className="mt-6 mb-4 flex gap-4 text-sm text-urbano/70">
        <span><strong>{pagos.length}</strong> pedidos</span>
        <span>Total: <strong className="text-oceano">{formatBRL(total)}</strong></span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-areia bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-oceano/5 text-urbano/70">
            <tr>
              <th className="px-4 py-3">Pagador</th>
              <th className="px-4 py-3">Itens</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">ID MP</th>
              <th className="px-4 py-3">Data</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((o) => (
              <tr key={o.id} className="border-t border-areia/60 align-top">
                <td className="px-4 py-3 text-urbano/80">
                  <div className="font-medium text-urbano">{o.pagador_nome || "—"}</div>
                  {o.pagador_email && (
                    <div className="text-xs text-urbano/40">{o.pagador_email}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-urbano/70">
                  {o.itens.map((i, idx) => (
                    <div key={idx} className="text-xs">
                      {i.quantidade}× {i.nome}
                    </div>
                  ))}
                </td>
                <td className="px-4 py-3 font-semibold text-oceano">
                  {formatBRL(Number(o.total) || 0)}
                </td>
                <td className="px-4 py-3 text-xs text-urbano/40">
                  {o.mercadopago_payment_id || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-urbano/50">
                  {o.paid_at ? formatDateSP(o.paid_at) : "—"}
                </td>
              </tr>
            ))}
            {pagos.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-urbano/50">
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
