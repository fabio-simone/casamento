"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import type { GiftOrder } from "@/lib/types";
import { formatBRL, formatDateSP } from "@/lib/utils";

type Filtro = "todos" | "paid" | "pending" | "failed";

const STATUS_INFO: Record<
  GiftOrder["status"],
  { label: string; classe: string }
> = {
  paid: { label: "Pago", classe: "bg-oceano/10 text-oceano" },
  pending: { label: "Pendente", classe: "bg-areia/60 text-urbano/70" },
  failed: { label: "Falhou", classe: "bg-red-100 text-red-700" },
};

export function OrdersTable({ orders }: { orders: GiftOrder[] }) {
  const router = useRouter();
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [busy, setBusy] = useState(false);

  const lista = useMemo(
    () => (filtro === "todos" ? orders : orders.filter((o) => o.status === filtro)),
    [orders, filtro]
  );

  const pagos = orders.filter((o) => o.status === "paid");
  const totalPago = pagos.reduce((a, o) => a + (Number(o.total) || 0), 0);
  const naoPagos = orders.filter((o) => o.status !== "paid").length;

  async function apagar(id: string) {
    if (!confirm("Apagar este pedido?")) return;
    setBusy(true);
    const res = await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) router.refresh();
    else alert("Erro ao apagar o pedido.");
  }

  async function limpar() {
    if (
      !confirm(
        `Apagar TODOS os ${naoPagos} pedidos pendentes e falhos? Os pagos são mantidos.`
      )
    )
      return;
    setBusy(true);
    const res = await fetch("/api/admin/orders", { method: "DELETE" });
    setBusy(false);
    if (res.ok) router.refresh();
    else alert("Erro ao limpar os pedidos.");
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value as Filtro)}
          className="rounded-xl border border-areia px-3 py-2 text-sm text-urbano outline-none focus:border-oceano"
        >
          <option value="todos">Todos ({orders.length})</option>
          <option value="paid">Pagos ({pagos.length})</option>
          <option value="pending">
            Pendentes ({orders.filter((o) => o.status === "pending").length})
          </option>
          <option value="failed">
            Falhos ({orders.filter((o) => o.status === "failed").length})
          </option>
        </select>
        {naoPagos > 0 && (
          <button
            onClick={limpar}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" /> Limpar pendentes e falhas
          </button>
        )}
      </div>

      <div className="mb-4 flex gap-4 text-sm text-urbano/70">
        <span><strong>{pagos.length}</strong> pagos</span>
        <span>Recebido: <strong className="text-oceano">{formatBRL(totalPago)}</strong></span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-areia bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-oceano/5 text-urbano/70">
            <tr>
              <th className="px-4 py-3">Pagador</th>
              <th className="px-4 py-3">Itens</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((o) => {
              const info = STATUS_INFO[o.status];
              const data = o.paid_at ?? o.created_at;
              return (
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
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${info.classe}`}>
                      {info.label}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-urbano/50">
                    {data ? formatDateSP(data, { dateStyle: "short" }) : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {o.status !== "paid" && (
                      <button
                        onClick={() => apagar(o.id)}
                        disabled={busy}
                        aria-label="Apagar pedido"
                        className="rounded-lg border border-red-200 p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {lista.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-urbano/50">
                  Nenhum pedido nesta categoria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
