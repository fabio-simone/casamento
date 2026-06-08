import type { Metadata } from "next";
import { RsvpForm } from "@/components/RsvpForm";
import { WaveDivider } from "@/components/WaveDivider";
import { getContent } from "@/lib/content";

export const metadata: Metadata = { title: "Confirmar Presença" };
export const dynamic = "force-dynamic";

export default async function RsvpPage() {
  const { paginas } = await getContent();
  const p = paginas.confirmar;
  return (
    <>
      <section className="bg-gradient-to-b from-oceano/10 to-offwhite pb-12 pt-28 text-center md:pb-16 md:pt-32">
        <div className="container-page">
          <span className="eyebrow">{p.eyebrow}</span>
          <h1 className="section-title">{p.titulo}</h1>
          {p.intro && (
            <p className="mx-auto mt-4 max-w-xl text-urbano/70">{p.intro}</p>
          )}
        </div>
      </section>

      <WaveDivider color="#04476A" />

      <section className="section-dark py-16 md:py-20">
        <div className="container-page">
          <RsvpForm />
        </div>
      </section>
    </>
  );
}
