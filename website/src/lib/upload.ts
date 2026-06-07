/**
 * Utilitários de upload de imagem (uso no cliente/admin).
 * Redimensiona/comprime no navegador antes de enviar — evita o limite
 * de corpo da Vercel e uniformiza o formato.
 */

export async function prepararImagem(
  file: File,
  maxDim = 1600,
  quality = 0.85
): Promise<File> {
  if (file.type === "image/gif") return file; // não mexe em GIF animado
  try {
    const dataUrl: string = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("read"));
      reader.readAsDataURL(file);
    });
    const img: HTMLImageElement = await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("decode"));
      image.src = dataUrl;
    });
    let { width, height } = img;
    if (width > maxDim || height > maxDim) {
      const scale = Math.min(maxDim / width, maxDim / height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, width, height);
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", quality)
    );
    if (!blob) return file;
    return new File([blob], "foto.jpg", { type: "image/jpeg" });
  } catch {
    return file; // se algo falhar, envia o original
  }
}

/** Envia uma imagem para o Storage e devolve a URL pública. Lança em erro. */
export async function uploadImagem(original: File): Promise<string> {
  const file = await prepararImagem(original);
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  if (!res.ok) {
    let msg = "Falha no upload. Tente novamente.";
    if (res.status === 413) msg = "Imagem muito grande, mesmo após compressão.";
    else {
      try {
        const d = await res.json();
        if (d?.error) msg = d.error;
      } catch {
        /* resposta sem JSON */
      }
    }
    throw new Error(msg);
  }
  const data = await res.json().catch(() => null);
  if (!data?.url) throw new Error("Upload sem retorno. Tente novamente.");
  return data.url as string;
}
