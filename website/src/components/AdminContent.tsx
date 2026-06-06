"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, GripVertical } from "lucide-react";
import type { SiteContent, TimelineItem } from "@/lib/content";
import { ImageUpload } from "./ImageUpload";

export function AdminContent({ initial }: { initial: SiteContent }) {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setContent((c) => ({ ...c, [key]: value }));
    setSaved(false);
  }

  function setItem(i: number, patch: Partial<TimelineItem>) {
    setContent((c) => ({
      ...c,
      timeline: c.timeline.map((it, idx) => (idx === i ? { ...it, ...patch } : it)),
    }));
    setSaved(false);
  }

  function addItem() {
    set("timeline", [
      ...content.timeline,
      { ano: "Novo momento", titulo: "", texto: "", foto: "", lado: "rio" },
    ]);
  }

  function removeItem(i: number) {
    set("timeline", content.timeline.filter((_, idx) => idx !== i));
  }

  async function salvar() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao salvar.");
      setSaved(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8 pb-24">
      {/* HOME */}
      <section className="card">
        <h2 className="font-display text-xl font-bold text-urbano">Página inicial</h2>
        <p className="mb-4 text-sm text-urbano/60">Foto do casal e frase de destaque.</p>
        <div className="space-y-4">
          <ImageUpload
            label="Foto do casal (destaque da home)"
            value={content.hero_foto}
            onChange={(url) => set("hero_foto", url)}
          />
          <div>
            <label className="mb-1 block text-sm font-medium text-urbano">
              Frase de destaque
            </label>
            <textarea
              rows={3}
              value={content.hero_sub}
              onChange={(e) => set("hero_sub", e.target.value)}
              className="w-full rounded-xl border border-areia px-4 py-3 text-sm outline-none focus:border-oceano"
            />
          </div>
        </div>
      </section>

      {/* NOSSA HISTÓRIA */}
      <section className="card">
        <h2 className="font-display text-xl font-bold text-urbano">Nossa História</h2>
        <p className="mb-4 text-sm text-urbano/60">
          Texto de abertura, foto e a linha do tempo do casal.
        </p>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-urbano">
              Texto de abertura
            </label>
            <textarea
              rows={2}
              value={content.historia_intro}
              onChange={(e) => set("historia_intro", e.target.value)}
              className="w-full rounded-xl border border-areia px-4 py-3 text-sm outline-none focus:border-oceano"
            />
          </div>
          <ImageUpload
            label="Foto do casal (página Nossa História)"
            value={content.historia_foto}
            onChange={(url) => set("historia_foto", url)}
          />
        </div>

        <h3 className="mb-2 mt-6 font-semibold text-urbano">Linha do tempo</h3>
        <div className="space-y-4">
          {content.timeline.map((item, i) => (
            <div key={i} className="rounded-2xl border border-areia bg-offwhite p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-oceano">
                  <GripVertical className="h-3 w-3" /> Momento {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="flex items-center gap-1 text-xs text-red-600 hover:underline"
                >
                  <Trash2 className="h-3 w-3" /> Remover
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={item.ano}
                  onChange={(e) => setItem(i, { ano: e.target.value })}
                  placeholder="Etapa (ex: O encontro)"
                  className="rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano"
                />
                <select
                  value={item.lado}
                  onChange={(e) => setItem(i, { lado: e.target.value as "rio" | "sp" })}
                  className="rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano"
                >
                  <option value="rio">Lado Rio (azul)</option>
                  <option value="sp">Lado SP (cinza)</option>
                </select>
              </div>
              <input
                value={item.titulo}
                onChange={(e) => setItem(i, { titulo: e.target.value })}
                placeholder="Título"
                className="mt-3 w-full rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano"
              />
              <textarea
                value={item.texto}
                onChange={(e) => setItem(i, { texto: e.target.value })}
                placeholder="Texto do momento"
                rows={2}
                className="mt-3 w-full rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano"
              />
              <div className="mt-3">
                <ImageUpload
                  label="Foto deste momento (opcional)"
                  value={item.foto}
                  onChange={(url) => setItem(i, { foto: url })}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-areia py-3 text-sm font-medium text-urbano/60 hover:border-oceano hover:text-oceano"
          >
            <Plus className="h-4 w-4" /> Adicionar momento
          </button>
        </div>
      </section>

      {/* BARRA DE SALVAR (fixa) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-areia bg-white/95 p-4 backdrop-blur md:left-60">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <span className="text-sm">
            {saved && <span className="text-oceano">✓ Alterações salvas!</span>}
            {error && <span className="text-red-600">{error}</span>}
          </span>
          <button onClick={salvar} disabled={saving} className="btn-primary">
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}
