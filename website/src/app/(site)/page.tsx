import Link from "next/link";
import { Waves, Building2, Camera } from "lucide-react";
import { Countdown } from "@/components/Countdown";
import { WaveDivider, CopacabanaWaves } from "@/components/WaveDivider";
import { SaoPauloSilhouette } from "@/components/SaoPauloSilhouette";
import { WEDDING } from "@/lib/constants";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getContent();
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-oceano/10 via-offwhite to-offwhite">
        <div className="bg-calcadao absolute inset-0 opacity-60" aria-hidden />
        <div className="container-page relative grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div className="animate-fade-up">
            <span className="eyebrow">O Rio encontra SP · {WEDDING.dataCurta}</span>
            <h1 className="font-display text-5xl font-bold leading-tight text-urbano sm:text-6xl md:text-7xl">
              Fabio <span className="text-oceano">&amp;</span> Karina
            </h1>
            <p className="mt-4 max-w-md text-lg text-urbano/70">{content.hero_sub}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/confirmar-presenca" className="btn-primary">
                Confirmar presença
              </Link>
              <Link href="/presentes" className="btn-secondary">
                Ver lista de presentes
              </Link>
            </div>
          </div>

          {/* Foto do casal */}
          <div className="animate-fade-up">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] border-4 border-white bg-areia/40 shadow-2xl">
              {content.hero_foto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={content.hero_foto}
                  alt={WEDDING.noivos}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-urbano/50">
                  <SaoPauloSilhouette className="w-28 opacity-30" stroke="#006994" />
                  <p className="flex items-center gap-2 px-6 text-sm">
                    <Camera className="h-4 w-4" strokeWidth={1.5} /> Foto do casal
                  </p>
                  <span className="text-xs">(adicionada pelo admin)</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <CopacabanaWaves className="opacity-40" />
      </section>

      {/* CONTADOR */}
      <section className="container-page py-16 text-center md:py-20">
        <span className="eyebrow">Contagem regressiva</span>
        <h2 className="section-title mb-2">Faltam só...</h2>
        <p className="mb-8 text-urbano/60">
          ...para a Karina chegar (no horário carioca) e o Fabio reclamar do trânsito.
        </p>
        <Countdown />
      </section>

      <WaveDivider color="#006994" />

      {/* DOIS MUNDOS */}
      <section className="bg-oceano/5 py-16 md:py-20">
        <div className="container-page grid gap-6 md:grid-cols-2">
          <div className="card border-oceano/30">
            <Waves className="h-9 w-9 text-oceano" strokeWidth={1.5} />
            <h3 className="mt-3 font-display text-2xl font-bold text-oceano">
              Lado Karina (Rio)
            </h3>
            <p className="mt-2 text-urbano/70">
              Praia, samba no pé, "maravilhoso!" a cada cinco minutos e a
              certeza de que 25°C é frio.
            </p>
          </div>
          <div className="card border-urbano/20">
            <Building2 className="h-9 w-9 text-urbano" strokeWidth={1.5} />
            <h3 className="mt-3 font-display text-2xl font-bold text-urbano">
              Lado Fabio (SP)
            </h3>
            <p className="mt-2 text-urbano/70">
              Garoa, rodízio de pizza às sextas, "mano" no vocabulário e
              orgulho do metrô que funciona.
            </p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="container-page py-16 text-center md:py-20">
        <h2 className="section-title mx-auto max-w-2xl">
          Vem celebrar com a gente essa mistura improvável que deu super certo.
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/confirmar-presenca" className="btn-primary">
            Confirmar presença
          </Link>
          <Link href="/nossa-historia" className="btn-secondary">
            Conhecer nossa história
          </Link>
        </div>
      </section>
    </>
  );
}
