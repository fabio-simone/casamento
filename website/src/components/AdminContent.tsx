"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, GripVertical, Upload, X } from "lucide-react";
import type { SiteContent, TimelineItem, InfoBloco } from "@/lib/content";
import { ImageUpload } from "./ImageUpload";
import { uploadImagem } from "@/lib/upload";
import { objectPositionFromUrl } from "@/lib/utils";
import { INFO_ICONES } from "@/lib/info-icones";

export function AdminContent({ initial }: { initial: SiteContent }) {
  const router = useRouter();
  const galeriaInputRef = useRef<HTMLInputElement>(null);
  const [galUpload, setGalUpload] = useState<{ ativo: boolean; feito: number; total: number }>({
    ativo: false,
    feito: 0,
    total: 0,
  });
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

  // Galeria
  function removeFoto(i: number) {
    set("galeria", content.galeria.filter((_, idx) => idx !== i));
  }
  // Informações
  function setInfo<K extends keyof SiteContent["informacoes"]>(
    key: K,
    value: SiteContent["informacoes"][K]
  ) {
    set("informacoes", { ...content.informacoes, [key]: value });
  }
  function setBloco(i: number, patch: Partial<InfoBloco>) {
    setInfo(
      "blocos",
      content.informacoes.blocos.map((b, idx) => (idx === i ? { ...b, ...patch } : b))
    );
  }
  function addBloco() {
    setInfo("blocos", [
      ...content.informacoes.blocos,
      { icone: "info", titulo: "Novo bloco", itens: [""] },
    ]);
  }
  function removeBloco(i: number) {
    setInfo("blocos", content.informacoes.blocos.filter((_, idx) => idx !== i));
  }
  function setItemBloco(bi: number, ii: number, value: string) {
    const itens = content.informacoes.blocos[bi].itens.map((it, idx) =>
      idx === ii ? value : it
    );
    setBloco(bi, { itens });
  }
  function addItemBloco(bi: number) {
    setBloco(bi, { itens: [...content.informacoes.blocos[bi].itens, ""] });
  }
  function removeItemBloco(bi: number, ii: number) {
    setBloco(bi, {
      itens: content.informacoes.blocos[bi].itens.filter((_, idx) => idx !== ii),
    });
  }

  async function handleGaleriaFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setGalUpload({ ativo: true, feito: 0, total: files.length });
    const novas: string[] = [];
    const falhas: string[] = [];
    for (let k = 0; k < files.length; k++) {
      try {
        novas.push(await uploadImagem(files[k]));
      } catch {
        falhas.push(files[k].name);
      }
      setGalUpload({ ativo: true, feito: k + 1, total: files.length });
    }
    if (novas.length) set("galeria", [...content.galeria, ...novas]);
    setGalUpload({ ativo: false, feito: 0, total: 0 });
    if (falhas.length) alert(`Algumas fotos não subiram:\n${falhas.join("\n")}`);
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
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Erro ao salvar.");
      setSaved(true);
      router.refresh();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erro inesperado.";
      setError(msg);
      // Garante que o erro não passe despercebido.
      alert("Não foi possível salvar:\n\n" + msg);
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
            label="Foto do casal (destaque da home) — use a melhor resolução"
            value={content.hero_foto}
            onChange={(url) => set("hero_foto", url)}
            maxDim={2560}
            quality={0.9}
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

      {/* GALERIA */}
      <section className="card">
        <h2 className="font-display text-xl font-bold text-urbano">Galeria de fotos</h2>
        <p className="mb-4 text-sm text-urbano/60">
          Selecione <strong>várias fotos de uma vez</strong> — elas são
          comprimidas e enviadas automaticamente.
        </p>

        {content.galeria.length > 0 && (
          <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {content.galeria.map((foto, i) => (
              <div
                key={i}
                className="group relative aspect-square overflow-hidden rounded-xl border border-areia"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={foto}
                  alt={`Foto ${i + 1}`}
                  className="h-full w-full object-cover"
                  style={{ objectPosition: objectPositionFromUrl(foto) }}
                />
                <button
                  type="button"
                  onClick={() => removeFoto(i)}
                  aria-label="Remover foto"
                  className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-urbano/70 text-white opacity-0 transition hover:bg-red-600 group-hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          ref={galeriaInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleGaleriaFiles}
        />
        <button
          type="button"
          onClick={() => galeriaInputRef.current?.click()}
          disabled={galUpload.ativo}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-areia py-4 text-sm font-medium text-urbano/60 transition hover:border-oceano hover:text-oceano disabled:opacity-60"
        >
          <Upload className="h-4 w-4" />
          {galUpload.ativo
            ? `Enviando ${galUpload.feito} de ${galUpload.total}...`
            : "Adicionar fotos (várias de uma vez)"}
        </button>
      </section>

      {/* INFORMAÇÕES */}
      <section className="card">
        <h2 className="font-display text-xl font-bold text-urbano">Informações</h2>
        <p className="mb-4 text-sm text-urbano/60">
          Blocos da página Informações (local, horários, dress code, hospedagem...)
          e o endereço do mapa. Tudo editável.
        </p>

        <div className="space-y-4">
          {content.informacoes.blocos.map((b, bi) => (
            <div key={bi} className="rounded-2xl border border-areia bg-offwhite p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-oceano">
                  Bloco {bi + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeBloco(bi)}
                  className="flex items-center gap-1 text-xs text-red-600 hover:underline"
                >
                  <Trash2 className="h-3 w-3" /> Remover bloco
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_1.5fr]">
                <select
                  value={b.icone}
                  onChange={(e) => setBloco(bi, { icone: e.target.value })}
                  className="rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano"
                >
                  {INFO_ICONES.map((ic) => (
                    <option key={ic.value} value={ic.value}>
                      {ic.label}
                    </option>
                  ))}
                </select>
                <input
                  value={b.titulo}
                  onChange={(e) => setBloco(bi, { titulo: e.target.value })}
                  placeholder="Título do bloco"
                  className="rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano"
                />
              </div>

              <p className="mb-1 mt-3 text-xs font-medium text-urbano/60">Linhas</p>
              <div className="space-y-2">
                {b.itens.map((it, ii) => (
                  <div key={ii} className="flex items-center gap-2">
                    <input
                      value={it}
                      onChange={(e) => setItemBloco(bi, ii, e.target.value)}
                      className="w-full rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano"
                    />
                    <button
                      type="button"
                      onClick={() => removeItemBloco(bi, ii)}
                      className="text-red-600 hover:text-red-700"
                      aria-label="Remover linha"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addItemBloco(bi)}
                  className="flex items-center gap-1 text-xs font-medium text-oceano hover:underline"
                >
                  <Plus className="h-3 w-3" /> Adicionar linha
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addBloco}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-areia py-3 text-sm font-medium text-urbano/60 hover:border-oceano hover:text-oceano"
          >
            <Plus className="h-4 w-4" /> Adicionar bloco
          </button>
        </div>

        <div className="mt-6 grid gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-urbano">
              Endereço (mostrado acima do mapa)
            </label>
            <input
              value={content.informacoes.mapa_endereco}
              onChange={(e) => setInfo("mapa_endereco", e.target.value)}
              className="w-full rounded-xl border border-areia px-4 py-3 text-sm outline-none focus:border-oceano"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-urbano">
              Busca do mapa (endereço/local para o Google Maps)
            </label>
            <input
              value={content.informacoes.mapa_query}
              onChange={(e) => setInfo("mapa_query", e.target.value)}
              className="w-full rounded-xl border border-areia px-4 py-3 text-sm outline-none focus:border-oceano"
            />
            <p className="mt-1 text-xs text-urbano/50">
              Ex.: &quot;Espaço Vila Cordeiro, São Paulo&quot; — é o que o mapa procura.
            </p>
          </div>
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
