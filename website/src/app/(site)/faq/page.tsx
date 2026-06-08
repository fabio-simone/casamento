import type { Metadata } from "next";
import Link from "next/link";
import { Accordion } from "@/components/Accordion";
import { WaveDivider } from "@/components/WaveDivider";
import { getContent } from "@/lib/content";

export const metadata: Metadata = { title: "FAQ" };
export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const { faq, paginas } = await getContent();
  const p = paginas.faq;

  return (
    <>
      <section className="bg-gradient-to-b from-oceano/10 to-offwhite pb-12 pt-28 text-center md:pb-16 md:pt-32">
        <div className="container-page">
          <span className="eyebrow">{p.eyebrow}</span>
          <h1 className="section-title">{p.titulo}</h1>
          {p.intro && <p className="mx-auto mt-4 max-w-xl text-urbano/70">{p.intro}</p>}
        </div>
      </section>

      <WaveDivider tone="oceanoDark" />

      <section className="section-dark py-16 md:py-20">
        <div className="container-page">
          <Accordion items={faq} />

          <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-offwhite/20 bg-white/5 p-6 text-center">
            <p className="text-offwhite/80">
              Não achou sua dúvida ou teve algum problema no site?
            </p>
            <Link href="/contato" className="btn-light mt-4">
              Falar com a gente
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
