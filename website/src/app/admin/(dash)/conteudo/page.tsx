import { getContent } from "@/lib/content";
import { AdminContent } from "@/components/AdminContent";

export const dynamic = "force-dynamic";

export default async function AdminConteudoPage() {
  const content = await getContent();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-urbano">Conteúdo do site</h1>
      <p className="mt-1 text-urbano/60">
        Edite os textos e fotos da página inicial e da Nossa História. As mudanças
        aparecem no site assim que você salvar.
      </p>
      <div className="mt-6">
        <AdminContent initial={content} />
      </div>
    </div>
  );
}
