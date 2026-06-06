import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth-api";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "fotos";
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

/**
 * Upload de imagem para o Storage do Supabase (bucket "fotos").
 * Recebe multipart/form-data com o campo "file". Retorna a URL pública.
 * Protegido: só o admin pode enviar.
 */
export async function POST(req: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json(
        { error: "Formato inválido. Use JPG, PNG, WEBP ou GIF." },
        { status: 400 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Imagem muito grande (máx. 8 MB)." }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const supabase = createAdminClient();
    const arrayBuffer = await file.arrayBuffer();

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, arrayBuffer, { contentType: file.type, upsert: false });

    if (error) {
      console.error("[upload] error", error);
      return NextResponse.json(
        { error: "Erro ao enviar. Verifique se o bucket 'fotos' existe." },
        { status: 500 }
      );
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl });
  } catch (e) {
    console.error("[upload] unexpected", e);
    return NextResponse.json({ error: "Erro inesperado no upload." }, { status: 500 });
  }
}
