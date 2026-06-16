"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Gift as GiftIcon } from "lucide-react";
import type { Gift } from "@/lib/types";
import { formatBRL, objectPositionFromUrl } from "@/lib/utils";
import { ImageUpload } from "./ImageUpload";

interface FormData {
  nome: string;
  descricao: string;
  valor_total: string;
  foto_url: string;
}

const empty: FormData = { nome: "", descricao: "", valor_total: "", foto_url: "" };

export function AdminGifts({ gifts }: { gifts: Gift[] }) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  function abrirNovo() {
    setForm(empty);
    setEditId(null);
    setOpen(true);
  }

  function abrirEdicao(g: Gift) {
    setForm({
      nome: g.nome,
      descricao: g.descricao ?? "",
      valor_total: String(g.valor_total),
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
    if (!confirm("Remover este presente do catálogo?")) return;
    const res = await fetch(`/api/admin/gifts/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else alert("Erro ao remover.");
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={abrirNovo} className="btn-primary py-2">
          + Novo presente
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {gifts.map((g) => (
          <div key={g.id} className="card flex gap-3">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-areia/40">
              {g.foto_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={g.foto_url}
                  alt={g.nome}
                  className="h-full w-full object-cover"
                  style={{ objectPosition: objectPositionFromUrl(g.foto_url) }}
                />
              ) : (
                <GiftIcon className="h-7 w-7 text-oceano/40" strokeWidth={1.25} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-display text-lg font-bold text-urbano">{g.nome}</h3>
              <p className="font-semibold text-oceano">{formatBRL(g.valor_total)}</p>
              {g.descricao && (
                <p className="mt-0.5 line-clamp-2 text-xs text-urbano/50">{g.descricao}</p>
              )}
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => abrirEdicao(g)}
                  className="rounded-lg border border-areia px-3 py-1 text-sm hover:bg-oceano/5"
                >
                  Editar
                </button>
                <button
                  onClick={() => remover(g.id)}
                  className="rounded-lg border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        ))}
        {gifts.length === 0 && (
          <p className="py-10 text-center text-urbano/50 sm:col-span-2">
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
            <div>
              <label className="mb-1 block text-sm font-medium text-urbano">Preço (R$)</label>
              <input
                required
                type="number"
                step="0.01"
                min="1"
                placeholder="Ex.: 150,00"
                value={form.valor_total}
                onChange={(e) => setForm({ ...form, valor_total: e.target.value })}
                className="w-full rounded-xl border border-areia px-4 py-3 text-sm outline-none focus:border-oceano"
              />
              <p className="mt-1 text-xs text-urbano/50">
                Valor de cada unidade. O convidado pode comprar quantas quiser.
              </p>
            </div>
            <ImageUpload
              label="Foto do presente (opcional)"
              value={form.foto_url}
              onChange={(url) => setForm({ ...form, foto_url: url })}
            />
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setOpen(false)} className="btn-secondary flex-1">
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
