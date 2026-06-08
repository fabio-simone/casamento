import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { getContent } from "@/lib/content";
import { paletaCss } from "@/lib/paletas";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { paleta } = await getContent();

  return (
    <>
      {/* paleta de cores escolhida no painel */}
      <style dangerouslySetInnerHTML={{ __html: paletaCss(paleta) }} />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}
