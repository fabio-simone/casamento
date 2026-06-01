"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { GiftWithQuotas } from "@/lib/types";
import { formatBRL, formatDateSP } from "@/lib/utils";

interface FormData {
  nome: string;
  descricao: string;
  valor_total: string;
  num_cotas: string;
  foto_url: string;
}

const empty: FormData = { nome: "", descricao: "", valor_total: "", num_cotas: "1", foto_url: "" };

export function AdminGifts({ gifts }: { gifts: GiftWithQuotas[] }) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandido, setExpandido] = useState<string | null>(null);

  function abrirNovo() {
    setForm(empty);
    setEditId(null);
    setOpen(true);
  }

  function abrirEdicao(g: GiftWithQuotas) {
    setForm({
      nome: g.nome,
      descricao: g.descricao ?? "",
      valor_total: String(g.valor_total),
      num_cotas: String(g.num_cotas),
      foto_url: g.foto_url ?? "",
    });
    setEditId(g.id);
    setOpen(true);
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      nome: form.nome,
      descricao: form.descricao,
      valor_total: Number(form.valor_total),
      num_cotas: Number(form.num_cotas),
      foto_url: form.foto_url,
    };
    const url = editId ? `/api/admin/gifts/${editId}` : "/api/admin/gifts";
    const method = editId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      setOpen(false);
      router.refresh();
    } else {
      alert("Erro ao salvar presente.");
    }
  }

  async function remover(id: string) {
    if (!confirm("Remover este presente e todas as suas cotas?")) return;
    const res = await fetch(`/api/admin/gifts/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else alert("Erro ao remover.");
  }

  async function marcarPaga(quotaId: string) {
    const nome = prompt(
      "Quem presenteou? (ex.: Pix da Tia Lúcia). Deixe em branco para 'Pago manualmente'."
    );
    if (nome === null) return; // cancelou
    const res = await fetch(`/api/admin/quotas/${quotaId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "paid", pagador_nome: nome.trim() || undefined }),
    });
    if (res.ok) router.refresh();
    else alert("Erro ao marcar a cota.");
  }

  async function reverterCota(quotaId: string) {
    if (!confirm("Reverter esta cota para pendente? Os dados de pagamento serão apagados.")) return;
    const res = await fetch(`/api/admin/quotas/${quotaId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "pending" }),
    });
    if (res.ok) router.refresh();
    else alert("Erro ao reverter a cota.");
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={abrirNovo} className="btn-primary py-2">
          + Novo presente
        </button>
      </div>

      <div className="space-y-3">
        {gifts.map((g) => {
          const pagas = g.gift_quotas.filter((q) => q.status === "paid").length;
          const arrecadado = (g.valor_total / g.num_cotas) * pagas;
          const aberto = expandido === g.id;
          return (
            <div key={g.id} className="card">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-urbano">{g.nome}</h3>
                  <p className="text-sm text-urbano/60">
                    {formatBRL(g.valor_total)} · {g.num_cotas} cotas ·{" "}
                    <span className="text-oceano">
                      {pagas} pagas ({formatBRL(arrecadado)})
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setExpandido(aberto ? null : g.id)}
                    className="rounded-lg border border-areia px-3 py-1.5 text-sm hover:bg-oceano/5"
                  >
                    {aberto ? "Ocultar cotas" : "Ver cotas"}
                  </button>
                  <button
                    onClick={() => abrirEdicao(g)}
                    className="rounded-lg border border-areia px-3 py-1.5 text-sm hover:bg-oceano/5"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => remover(g.id)}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    Remover
                  </button>
                </div>
              </div>

              {aberto && (
                <div className="mt-4 overflow-x-auto rounded-xl border border-areia">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-oceano/5 text-urbano/70">
                      <tr>
                        <th className="px-3 py-2">Cota</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Quem pagou</th>
                        <th className="px-3 py-2">Data</th>
                        <th className="px-3 py-2 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...g.gift_quotas]
                        .sort((a, b) => a.numero_cota - b.numero_cota)
                        .map((q) => (
                          <tr key={q.id} className="border-t border-areia/60">
                            <td className="px-3 py-2">#{q.numero_cota}</td>
                            <td className="px-3 py-2">
                              <span
                                className={
                                  q.status === "paid"
                                    ? "rounded-full bg-oceano/10 px-2 py-0.5 text-xs font-medium text-oceano"
                                    : "rounded-full bg-areia/60 px-2 py-0.5 text-xs font-medium text-urbano/60"
                                }
                              >
                                {q.status === "paid" ? "Paga" : "Pendente"}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-urbano/70">
                              {q.pagador_nome || "—"}
                              {q.pagador_email && (
                                <div className="text-xs text-urbano/40">{q.pagador_email}</div>
                              )}
                            </td>
                            <td className="px-3 py-2 text-urbano/50">
                              {q.paid_at ? formatDateSP(q.paid_at, { dateStyle: "short" }) : "—"}
                            </td>
                            <td className="px-3 py-2 text-right">
                              {q.status === "paid" ? (
                                <button
                                  onClick={() => reverterCota(q.id)}
                                  className="rounded-lg border border-areia px-2 py-1 text-xs text-urbano/70 hover:bg-areia/30"
                                >
                                  Reverter
                                </button>
                              ) : (
                                <button
                                  onClick={() => marcarPaga(q.id)}
                                  className="rounded-lg bg-oceano px-2 py-1 text-xs font-medium text-white hover:bg-oceano/90"
                                >
                                  Marcar paga
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
        {gifts.length === 0 && (
          <p className="py-10 text-center text-urbano/50">
            Nenhum presente cadastrado. Crie o primeiro!
          </p>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-urbano/60 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={salvar}
            className="w-full max-w-md space-y-3 rounded-3xl bg-offwhite p-6 shadow-2xl"
          >
            <h3 className="font-display text-2xl font-bold text-urbano">
              {editId ? "Editar presente" : "Novo presente"}
            </h3>
            <input
              required
              placeholder="Nome do presente"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="w-full rounded-xl border border-areia px-4 py-3 text-sm outline-none focus:border-oceano"
            />
            <textarea
              placeholder="Descrição (pode ser engraçada 😄)"
              rows={2}
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              className="w-full rounded-xl border border-areia px-4 py-3 text-sm outline-none focus:border-oceano"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                type="number"
                step="0.01"
                min="1"
                placeholder="Valor total (R$)"
                value={form.valor_total}
                onChange={(e) => setForm({ ...form, valor_total: e.target.value })}
                className="w-full rounded-xl border border-areia px-4 py-3 text-sm outline-none focus:border-oceano"
              />
              <input
                required
                type="number"
                min="1"
                placeholder="Nº de cotas"
                value={form.num_cotas}
                onChange={(e) => setForm({ ...form, num_cotas: e.target.value })}
                className="w-full rounded-xl border border-areia px-4 py-3 text-sm outline-none focus:border-oceano"
              />
            </div>
            <input
              placeholder="URL da foto (opcional)"
              value={form.foto_url}
              onChange={(e) => setForm({ ...form, foto_url: e.target.value })}
              className="w-full rounded-xl border border-areia px-4 py-3 text-sm outline-none focus:border-oceano"
            />
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button type="submit" disabled={saving} className="btn-primary flex-1">
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
