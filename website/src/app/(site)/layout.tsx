import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { getContent } from "@/lib/content";
import { paletaCss } from "@/lib/paletas";
import { fonteCss } from "@/lib/fontes";
import { TextosProvider } from "@/lib/textos-context";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { paleta, paleta_custom, fonte, textos } = await getContent();

  return (
    <>
      {/* paleta de cores + fonte escolhidas no painel */}
      <style
        dangerouslySetInnerHTML={{
          __html: paletaCss(paleta, paleta_custom) + fonteCss(fonte),
        }}
      />
      <TextosProvider value={textos}>
        <Navbar />
        <main>{children}</main>
        <Footer textos={textos} />
        <BackToTop />
      </TextosProvider>
    </>
  );
}
