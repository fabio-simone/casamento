"use client";

import { useRef, useState } from "react";
import { Upload, X, ImageOff } from "lucide-react";

/**
 * Campo de imagem reutilizável: envia o arquivo para o Storage (via
 * /api/admin/upload) e devolve a URL pública. Também aceita colar uma URL.
 */
export function ImageUpload({
  value,
  onChange,
  label = "Imagem",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [brokenPreview, setBrokenPreview] = useState(false);

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Falha no upload.");
      setBrokenPreview(false);
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro no upload.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-urbano">{label}</label>

      <div className="flex items-start gap-3">
        {/* Preview */}
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-areia bg-areia/20">
          {value && !brokenPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="preview"
              className="h-full w-full object-cover"
              onError={() => setBrokenPreview(true)}
            />
          ) : (
            <ImageOff className="h-6 w-6 text-urbano/30" strokeWidth={1.5} />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-xl border border-oceano px-3 py-2 text-sm font-medium text-oceano transition hover:bg-oceano/5 disabled:opacity-50"
          >
            <Upload className="h-4 w-4" strokeWidth={1.5} />
            {uploading ? "Enviando..." : "Enviar imagem"}
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

          <div className="flex items-center gap-2">
            <input
              value={value}
              onChange={(e) => {
                setBrokenPreview(false);
                onChange(e.target.value);
              }}
              placeholder="ou cole uma URL de imagem"
              className="w-full rounded-xl border border-areia px-3 py-2 text-xs outline-none focus:border-oceano"
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

          {brokenPreview && value && (
            <p className="text-xs text-amber-600">
              Não consegui carregar essa URL. Tente enviar o arquivo direto.
            </p>
          )}
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
