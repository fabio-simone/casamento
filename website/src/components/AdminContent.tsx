"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, GripVertical, Upload, X } from "lucide-react";
import type { SiteContent, TimelineItem, InfoBloco } from "@/lib/content";
import { ImageUpload } from "./ImageUpload";
import { uploadImagem } from "@/lib/upload";
import { objectPositionFromUrl } from "@/lib/utils";
import { INFO_ICONES } from "@/lib/info-icones";
import { CRONO_ICONES } from "@/lib/crono-icones";
import { PALETAS } from "@/lib/paletas";
import { cn } from "@/lib/utils";

const PAGINAS_LABELS: { key: string; nome: string }[] = [
  { key: "nossa_historia", nome: "Nossa História" },
  { key: "informacoes", nome: "Informações" },
  { key: "cronograma", nome: "Cronograma" },
  { key: "galeria", nome: "Galeria" },
  { key: "presentes", nome: "Presentes" },
  { key: "faq", nome: "FAQ" },
  { key: "confirmar", nome: "Confirmar Presença" },
  { key: "contato", nome: "Contato / Suporte" },
  { key: "mensagens", nome: "Mensagens" },
];

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

  function setHome<K extends keyof SiteContent["home"]>(
    key: K,
    value: SiteContent["home"][K]
  ) {
    set("home", { ...content.home, [key]: value });
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

  // Cronograma
  function setEvento(i: number, patch: Partial<SiteContent["cronograma"][number]>) {
    set("cronograma", content.cronograma.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));
  }
  function addEvento() {
    set("cronograma", [
      ...content.cronograma,
      { hora: "00h00", titulo: "Novo momento", texto: "", icone: "anel", lado: "rio" },
    ]);
  }
  function removeEvento(i: number) {
    set("cronograma", content.cronograma.filter((_, idx) => idx !== i));
  }

  // FAQ
  function setFaqItem(i: number, patch: Partial<SiteContent["faq"][number]>) {
    set("faq", content.faq.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));
  }
  function addFaqItem() {
    set("faq", [...content.faq, { pergunta: "", resposta: "" }]);
  }
  function removeFaqItem(i: number) {
    set("faq", content.faq.filter((_, idx) => idx !== i));
  }

  // Textos das páginas
  function setPagina(key: string, patch: Partial<SiteContent["paginas"][string]>) {
    const atual = content.paginas[key] ?? { eyebrow: "", titulo: "", intro: "" };
    set("paginas", { ...content.paginas, [key]: { ...atual, ...patch } });
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
      {/* PALETA DE CORES */}
      <section className="card">
        <h2 className="font-display text-xl font-bold text-urbano">Paleta de cores</h2>
        <p className="mb-4 text-sm text-urbano/60">
          Escolha o esquema de cores do site inteiro.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PALETAS.map((p) => {
            const ativa = content.paleta === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => set("paleta", p.id)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border p-3 text-left transition",
                  ativa
                    ? "border-oceano ring-2 ring-oceano/30"
                    : "border-areia hover:border-oceano/50"
                )}
              >
                <div className="flex shrink-0 overflow-hidden rounded-lg border border-areia">
                  {(["oceano", "oceanoDark", "laranja", "areia"] as const).map((c) => (
                    <span
                      key={c}
                      className="h-9 w-5"
                      style={{ backgroundColor: `rgb(${p.cores[c]})` }}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-urbano">{p.nome}</span>
              </button>
            );
          })}
        </div>
      </section>

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
              Frase de destaque (abaixo dos nomes / boas-vindas)
            </label>
            <textarea
              rows={3}
              value={content.hero_sub}
              onChange={(e) => set("hero_sub", e.target.value)}
              className="w-full rounded-xl border border-areia px-4 py-3 text-sm outline-none focus:border-oceano"
            />
          </div>

          <div className="rounded-2xl border border-areia bg-offwhite p-4">
            <p className="mb-1 text-sm font-semibold text-urbano">Boas-vindas</p>
            <input value={content.home.boas_vindas_titulo} onChange={(e) => setHome("boas_vindas_titulo", e.target.value)} placeholder="Título (ex: Sejam bem-vindos!)" className="w-full rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano" />
          </div>

          <div className="rounded-2xl border border-areia bg-offwhite p-4">
            <p className="mb-1 text-sm font-semibold text-urbano">Contador</p>
            <input value={content.home.contador_titulo} onChange={(e) => setHome("contador_titulo", e.target.value)} placeholder="Título (ex: Faltam só...)" className="w-full rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano" />
            <textarea value={content.home.contador_texto} onChange={(e) => setHome("contador_texto", e.target.value)} placeholder="Frase abaixo do título" rows={2} className="mt-2 w-full rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-areia bg-offwhite p-4">
              <p className="mb-1 text-sm font-semibold text-urbano">Lado dela (Rio)</p>
              <input value={content.home.lado_rio_titulo} onChange={(e) => setHome("lado_rio_titulo", e.target.value)} placeholder="Título" className="w-full rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano" />
              <textarea value={content.home.lado_rio_texto} onChange={(e) => setHome("lado_rio_texto", e.target.value)} placeholder="Texto" rows={3} className="mt-2 w-full rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano" />
            </div>
            <div className="rounded-2xl border border-areia bg-offwhite p-4">
              <p className="mb-1 text-sm font-semibold text-urbano">Lado dele (SP)</p>
              <input value={content.home.lado_sp_titulo} onChange={(e) => setHome("lado_sp_titulo", e.target.value)} placeholder="Título" className="w-full rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano" />
              <textarea value={content.home.lado_sp_texto} onChange={(e) => setHome("lado_sp_texto", e.target.value)} placeholder="Texto" rows={3} className="mt-2 w-full rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano" />
            </div>
          </div>

          <div className="rounded-2xl border border-areia bg-offwhite p-4">
            <p className="mb-1 text-sm font-semibold text-urbano">Carrossel de recados</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <input value={content.home.recados_eyebrow} onChange={(e) => setHome("recados_eyebrow", e.target.value)} placeholder="Selo (ex: Mural de carinho)" className="rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano" />
              <input value={content.home.recados_titulo} onChange={(e) => setHome("recados_titulo", e.target.value)} placeholder="Título" className="rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano" />
            </div>
            <textarea value={content.home.recados_texto} onChange={(e) => setHome("recados_texto", e.target.value)} placeholder="Frase abaixo do título" rows={2} className="mt-2 w-full rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano" />
          </div>

          <div className="rounded-2xl border border-areia bg-offwhite p-4">
            <p className="mb-1 text-sm font-semibold text-urbano">Galeria (resumo na home)</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <input value={content.home.galeria_eyebrow} onChange={(e) => setHome("galeria_eyebrow", e.target.value)} placeholder="Selo (ex: Galeria)" className="rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano" />
              <input value={content.home.galeria_titulo} onChange={(e) => setHome("galeria_titulo", e.target.value)} placeholder="Título" className="rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano" />
            </div>
          </div>

          <div className="rounded-2xl border border-areia bg-offwhite p-4">
            <p className="mb-1 text-sm font-semibold text-urbano">Chamada final</p>
            <textarea value={content.home.cta_titulo} onChange={(e) => setHome("cta_titulo", e.target.value)} placeholder="Frase de chamada no fim da home" rows={2} className="w-full rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano" />
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

      {/* CRONOGRAMA */}
      <section className="card">
        <h2 className="font-display text-xl font-bold text-urbano">Cronograma</h2>
        <p className="mb-4 text-sm text-urbano/60">Os momentos do dia do casamento.</p>
        <div className="space-y-4">
          {content.cronograma.map((e, i) => (
            <div key={i} className="rounded-2xl border border-areia bg-offwhite p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-oceano">
                  Momento {i + 1}
                </span>
                <button type="button" onClick={() => removeEvento(i)} className="flex items-center gap-1 text-xs text-red-600 hover:underline">
                  <Trash2 className="h-3 w-3" /> Remover
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <input value={e.hora} onChange={(ev) => setEvento(i, { hora: ev.target.value })} placeholder="Horário" className="rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano" />
                <select value={e.icone} onChange={(ev) => setEvento(i, { icone: ev.target.value })} className="rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano">
                  {CRONO_ICONES.map((ic) => (<option key={ic.value} value={ic.value}>{ic.label}</option>))}
                </select>
                <select value={e.lado} onChange={(ev) => setEvento(i, { lado: ev.target.value as "rio" | "sp" })} className="rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano">
                  <option value="rio">Lado Rio (azul)</option>
                  <option value="sp">Lado SP (laranja)</option>
                </select>
              </div>
              <input value={e.titulo} onChange={(ev) => setEvento(i, { titulo: ev.target.value })} placeholder="Título" className="mt-3 w-full rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano" />
              <textarea value={e.texto} onChange={(ev) => setEvento(i, { texto: ev.target.value })} placeholder="Descrição" rows={2} className="mt-3 w-full rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano" />
            </div>
          ))}
          <button type="button" onClick={addEvento} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-areia py-3 text-sm font-medium text-urbano/60 hover:border-oceano hover:text-oceano">
            <Plus className="h-4 w-4" /> Adicionar momento
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section className="card">
        <h2 className="font-display text-xl font-bold text-urbano">Perguntas frequentes (FAQ)</h2>
        <p className="mb-4 text-sm text-urbano/60">Pergunta e resposta de cada item.</p>
        <div className="space-y-4">
          {content.faq.map((f, i) => (
            <div key={i} className="rounded-2xl border border-areia bg-offwhite p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-oceano">Pergunta {i + 1}</span>
                <button type="button" onClick={() => removeFaqItem(i)} className="flex items-center gap-1 text-xs text-red-600 hover:underline">
                  <Trash2 className="h-3 w-3" /> Remover
                </button>
              </div>
              <input value={f.pergunta} onChange={(ev) => setFaqItem(i, { pergunta: ev.target.value })} placeholder="Pergunta" className="w-full rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano" />
              <textarea value={f.resposta} onChange={(ev) => setFaqItem(i, { resposta: ev.target.value })} placeholder="Resposta" rows={3} className="mt-3 w-full rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano" />
            </div>
          ))}
          <button type="button" onClick={addFaqItem} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-areia py-3 text-sm font-medium text-urbano/60 hover:border-oceano hover:text-oceano">
            <Plus className="h-4 w-4" /> Adicionar pergunta
          </button>
        </div>
      </section>

      {/* EMAIL DE PRESENTE */}
      <section className="card">
        <h2 className="font-display text-xl font-bold text-urbano">Email de presente</h2>
        <p className="mb-4 text-sm text-urbano/60">
          Personalize o email que é enviado para quem pagou um presente.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-urbano mb-2">Título do email</label>
            <input
              value={content.email_presente_titulo}
              onChange={(e) => set("email_presente_titulo", e.target.value)}
              placeholder="Ex: Obrigado! 💙"
              className="w-full rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-urbano mb-2">Mensagem do email</label>
            <textarea
              value={content.email_presente_texto}
              onChange={(e) => set("email_presente_texto", e.target.value)}
              placeholder="Ex: Você acaba de contribuir para a paz mundial entre Vasco e a garoa paulistana. Gratidão! 🌊🏙️"
              rows={3}
              className="w-full rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano"
            />
          </div>
        </div>
      </section>

      {/* EMAIL DE CONFIRMAÇÃO DE PRESENÇA */}
      <section className="card">
        <h2 className="font-display text-xl font-bold text-urbano">Email de confirmação de presença</h2>
        <p className="mb-1 text-sm text-urbano/60">
          O email enviado para quem confirma presença no RSVP.
        </p>
        <p className="mb-4 text-sm text-urbano/60">
          Marcadores disponíveis no texto:{" "}
          <code className="rounded bg-areia/40 px-1 text-oceano">{"{nome}"}</code>{" "}
          <code className="rounded bg-areia/40 px-1 text-oceano">{"{total}"}</code>{" "}
          (ex: &quot;2 pessoas&quot;){" "}
          <code className="rounded bg-areia/40 px-1 text-oceano">{"{data}"}</code>{" "}
          (data do casamento). Cada linha vira um parágrafo.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-urbano mb-2">Título do email</label>
            <input
              value={content.email_rsvp_titulo}
              onChange={(e) => set("email_rsvp_titulo", e.target.value)}
              placeholder="Ex: Presença confirmada! 🎉"
              className="w-full rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-urbano mb-2">Mensagem do email</label>
            <textarea
              value={content.email_rsvp_texto}
              onChange={(e) => set("email_rsvp_texto", e.target.value)}
              placeholder="Oi, {nome}! Sua presença está confirmada..."
              rows={5}
              className="w-full rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano"
            />
          </div>
        </div>
      </section>

      {/* TEXTOS DAS PÁGINAS */}
      <section className="card">
        <h2 className="font-display text-xl font-bold text-urbano">Títulos das páginas</h2>
        <p className="mb-4 text-sm text-urbano/60">
          O selo, título e descrição do topo de cada página.
        </p>
        <div className="space-y-4">
          {PAGINAS_LABELS.map(({ key, nome }) => {
            const pg = content.paginas[key] ?? { eyebrow: "", titulo: "", intro: "" };
            return (
              <div key={key} className="rounded-2xl border border-areia bg-offwhite p-4">
                <p className="mb-2 text-sm font-semibold text-urbano">{nome}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <input value={pg.eyebrow} onChange={(e) => setPagina(key, { eyebrow: e.target.value })} placeholder="Selo (ex: FAQ)" className="rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano" />
                  <input value={pg.titulo} onChange={(e) => setPagina(key, { titulo: e.target.value })} placeholder="Título" className="rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano" />
                </div>
                <textarea value={pg.intro} onChange={(e) => setPagina(key, { intro: e.target.value })} placeholder="Descrição (opcional)" rows={2} className="mt-2 w-full rounded-xl border border-areia px-3 py-2 text-sm outline-none focus:border-oceano" />
              </div>
            );
          })}
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
