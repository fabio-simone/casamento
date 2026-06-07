"use client";

import { useRef, useState } from "react";
import { Upload, X, ImageOff } from "lucide-react";
import { uploadImagem } from "@/lib/upload";
import { posFromUrl, setPosInUrl } from "@/lib/utils";

/**
 * Campo de imagem reutilizável: envia o arquivo para o Storage (via
 * /api/admin/upload) e devolve a URL pública. Também aceita colar uma URL.
 */
export function ImageUpload({
  value,
  onChange,
  label = "Imagem",
  maxDim,
  quality,
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  maxDim?: number;
  quality?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [brokenPreview, setBrokenPreview] = useState(false);

  async function handleFile(original: File) {
    setUploading(true);
    setError("");
    try {
      const url = await uploadImagem(original, { maxDim, quality });
      setBrokenPreview(false);
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro no upload.");
    } finally {
      setUploading(false);
    }
  }

  function focusFromClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onChange(setPosInUrl(value, x, y));
  }

  const [px, py] = posFromUrl(value);

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-urbano">{label}</label>

      {/* Seletor de enquadramento: clique no rosto */}
      {value && !brokenPreview && (
        <div
          onClick={focusFromClick}
          title="Clique no rosto para enquadrar"
          className="relative mb-2 max-w-sm cursor-crosshair overflow-hidden rounded-xl border border-areia bg-areia/20"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="preview"
            className="block h-auto w-full select-none"
            draggable={false}
            onError={() => setBrokenPreview(true)}
          />
          <span
            className="pointer-events-none absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-oceano/70 shadow ring-2 ring-oceano/40"
            style={{ left: `${px}%`, top: `${py}%` }}
          />
          <span className="pointer-events-none absolute bottom-1 left-1 rounded bg-urbano/75 px-2 py-0.5 text-[10px] font-medium text-white">
            🎯 Clique no rosto para enquadrar
          </span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-xl border border-oceano px-3 py-2 text-sm font-medium text-oceano transition hover:bg-oceano/5 disabled:opacity-50"
        >
          <Upload className="h-4 w-4" strokeWidth={1.5} />
          {uploading ? "Enviando..." : value ? "Trocar imagem" : "Enviar imagem"}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />

        <input
          value={value}
          onChange={(e) => {
            setBrokenPreview(false);
            onChange(e.target.value);
          }}
          placeholder="ou cole uma URL"
          className="min-w-[140px] flex-1 rounded-xl border border-areia px-3 py-2 text-xs outline-none focus:border-oceano"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-urbano/40 hover:text-red-500"
            aria-label="Remover imagem"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {!value && (
        <div className="mt-2 flex items-center gap-2 text-xs text-urbano/40">
          <ImageOff className="h-4 w-4" strokeWidth={1.5} /> Nenhuma imagem ainda
        </div>
      )}
      {brokenPreview && value && (
        <p className="mt-1 text-xs text-amber-600">
          Não consegui carregar essa URL. Tente enviar o arquivo direto.
        </p>
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
