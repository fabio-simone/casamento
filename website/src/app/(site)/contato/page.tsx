import type { Metadata } from "next";
import { ContatoForm } from "@/components/ContatoForm";
import { WaveDivider } from "@/components/WaveDivider";

export const metadata: Metadata = { title: "Precisa de Ajuda?" };

export default function ContatoPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-oceano/10 to-offwhite py-16 text-center md:py-20">
        <div className="container-page">
          <span className="eyebrow">Suporte</span>
          <h1 className="section-title">Precisa de ajuda?</h1>
          <p className="mx-auto mt-4 max-w-xl text-urbano/70">
            Teve algum problema para confirmar presença, pagar um presente ou
            abrir o site? Conta pra gente aqui embaixo — o casal recebe na hora e
            te ajuda a resolver.
          </p>
        </div>
      </section>

      <WaveDivider />

      <section className="container-page py-16 md:py-20">
        <ContatoForm />
      </section>
    </>
  );
}
