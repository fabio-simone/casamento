import smartcrop from "smartcrop";

/**
 * Utilitários de upload de imagem (uso no cliente/admin).
 * - Redimensiona/comprime no navegador (evita o limite da Vercel).
 * - Usa smartcrop.js (análise determinística de tom de pele/bordas) para
 *   achar o ponto focal (rostos) e embute na URL como "#pos=fx,fy".
 */

function clamp(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

async function prepararImagem(
  file: File,
  maxDim = 1600,
  quality = 0.85
): Promise<{ file: File; pos: string }> {
  const fallback = { file, pos: "50,30" };
  if (file.type === "image/gif") return fallback;
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
    if (!ctx) return fallback;
    ctx.drawImage(img, 0, 0, width, height);

    // Ponto focal via smartcrop (melhor região quadrada -> centro do rosto).
    let pos = "50,30";
    try {
      const lado = Math.min(width, height);
      const { topCrop } = await smartcrop.crop(canvas, { width: lado, height: lado });
      const fx = clamp(((topCrop.x + topCrop.width / 2) / width) * 100);
      const fy = clamp(((topCrop.y + topCrop.height / 2) / height) * 100);
      pos = `${fx},${fy}`;
    } catch {
      /* mantém o padrão */
    }

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", quality)
    );
    if (!blob) return { file, pos };
    return { file: new File([blob], "foto.jpg", { type: "image/jpeg" }), pos };
  } catch {
    return fallback;
  }
}

/** Envia uma imagem para o Storage e devolve a URL (com #pos=fx,fy). */
export async function uploadImagem(original: File): Promise<string> {
  const { file, pos } = await prepararImagem(original);
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
        /* sem JSON */
      }
    }
    throw new Error(msg);
  }
  const data = await res.json().catch(() => null);
  if (!data?.url) throw new Error("Upload sem retorno. Tente novamente.");
  return `${data.url}#pos=${pos}`;
}
