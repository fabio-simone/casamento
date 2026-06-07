import type { Metadata } from "next";
import { RsvpForm } from "@/components/RsvpForm";
import { WaveDivider } from "@/components/WaveDivider";
import { WEDDING } from "@/lib/constants";

export const metadata: Metadata = { title: "Confirmar Presença" };

export default function RsvpPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-oceano/10 to-offwhite pb-12 pt-28 text-center md:pb-16 md:pt-32">
        <div className="container-page">
          <span className="eyebrow">RSVP · {WEDDING.dataCurta}</span>
          <h1 className="section-title">Confirme sua presença</h1>
          <p className="mx-auto mt-4 max-w-xl text-urbano/70">
            Bora celebrar o encontro do Rio com SP? Preenche aí embaixo que a
            gente já reserva seu lugar (e sua porção de feijoada).
          </p>
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
