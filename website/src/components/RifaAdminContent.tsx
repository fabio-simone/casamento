"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { RifaConfig, RifaFaixa } from "@/lib/rifa";

export function RifaAdminContent({ initialConfig }: { initialConfig: RifaConfig }) {
  const [config, setConfig] = useState<RifaConfig>(initialConfig);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof RifaConfig>(key: K, value: RifaConfig[K]) {
    setConfig((c) => ({ ...c, [key]: value }));
    setSaved(false);
  }

  function setFaixa(i: number, patch: Partial<RifaFaixa>) {
    setConfig((c) => ({
      ...c,
      faixas: c.faixas.map((f, idx) => (idx === i ? { ...f, ...patch } : f)),
    }));
    setSaved(false);
  }

  function addFaixa() {
    set("faixas", [...config.faixas, { min: 0, max: null, mensagem: "" }]);
  }

  function removeFaixa(i: number) {
    set("faixas", config.faixas.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const r = await fetch("/api/admin/rifa-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!r.ok) throw new Error((await r.json()).error ?? "Erro ao salvar.");
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-4 space-y-6">
      {/* Basic fields */}
      <div className="card space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold text-urbano/60">Título da rifa</label>
          <input
            value={config.titulo}
            onChange={(e) => set("titulo", e.target.value)}
            className="input w-full"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-urbano/60">Descrição do prêmio</label>
          <input
            value={config.descricao_premio}
            onChange={(e) => set("descricao_premio", e.target.value)}
            className="input w-full"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-urbano/60">Texto descritivo</label>
          <textarea
            value={config.descricao_rifa}
            onChange={(e) => set("descricao_rifa", e.target.value)}
            rows={3}
            className="input w-full resize-none"
          />
        </div>
        <div className="border-t border-areia pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-urbano/50">Chave PIX para recebimento</p>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-urbano/60">Chave PIX <span className="text-red-500">*</span></label>
              <input
                value={config.pix_chave}
                onChange={(e) => set("pix_chave", e.target.value)}
                placeholder="CPF, e-mail, telefone ou chave aleatória"
                className="input w-full"
              />
              <p className="mt-1 text-xs text-urbano/40">Use qualquer chave cadastrada no seu banco. O QR Code gerado já embute o valor.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-urbano/60">Nome do recebedor (até 25 chars)</label>
                <input
                  value={config.pix_nome}
                  onChange={(e) => set("pix_nome", e.target.value.slice(0, 25))}
                  placeholder="Kafamento"
                  className="input w-full"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-urbano/60">Cidade (até 15 chars, sem acento)</label>
                <input
                  value={config.pix_cidade}
                  onChange={(e) => set("pix_cidade", e.target.value.slice(0, 15))}
                  placeholder="Sao Paulo"
                  className="input w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-urbano">Rifa ativa</label>
          <button
            type="button"
            role="switch"
            aria-checked={config.ativa}
            onClick={() => set("ativa", !config.ativa)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${config.ativa ? "bg-oceano" : "bg-urbano/20"}`}
          >
            <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ease-in-out ${config.ativa ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>
      </div>

      {/* Faixas de preço */}
      <div className="card">
        <h3 className="mb-4 font-semibold text-urbano">Faixas de preço e mensagens</h3>
        <div className="space-y-3">
          {config.faixas.map((f, i) => (
            <div key={i} className="grid grid-cols-[80px_80px_1fr_32px] items-center gap-2">
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-urbano/50">R$</span>
                <input
                  type="number"
                  value={f.min}
                  onChange={(e) => setFaixa(i, { min: Number(e.target.value) })}
                  placeholder="Min"
                  className="input w-full pl-7 text-xs"
                />
              </div>
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-urbano/50">R$</span>
                <input
                  type="number"
                  value={f.max ?? ""}
                  onChange={(e) => setFaixa(i, { max: e.target.value ? Number(e.target.value) : null })}
                  placeholder="Máx"
                  className="input w-full pl-7 text-xs"
                />
              </div>
              <input
                type="text"
                value={f.mensagem}
                onChange={(e) => setFaixa(i, { mensagem: e.target.value })}
                placeholder="Mensagem divertida"
                className="input w-full text-xs"
              />
              <button
                type="button"
                onClick={() => removeFaixa(i)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-urbano/30 hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addFaixa}
          className="mt-3 flex items-center gap-1 text-sm text-oceano hover:underline"
        >
          <Plus className="h-4 w-4" /> Adicionar faixa
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-primary"
      >
        {saving ? "Salvando…" : saved ? "Salvo!" : "Salvar configurações"}
      </button>
    </div>
  );
}
