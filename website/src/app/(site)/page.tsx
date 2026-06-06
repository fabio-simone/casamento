import Link from "next/link";
import { Waves, Building2 } from "lucide-react";
import { Countdown } from "@/components/Countdown";
import { WaveDivider } from "@/components/WaveDivider";
import { RioSpEmblem } from "@/components/SaoPauloSilhouette";
import { WEDDING } from "@/lib/constants";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getContent();
  return (
    <>
      {/* HERO — tela cheia com foto do casal */}
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden">
        {/* fundo: foto do casal ou gradiente oceano */}
        {content.hero_foto ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.hero_foto}
              alt={WEDDING.noivos}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-urbano/50 via-urbano/30 to-urbano/60" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-oceano via-oceano/90 to-urbano" />
        )}

        <div className="container-page relative animate-fade-up py-20 text-center text-offwhite">
          <RioSpEmblem className="mx-auto mb-6 h-16 w-16" stroke="#FAF9F6" />
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-offwhite/80">
            O Rio encontra SP
          </span>
          <h1 className="font-display text-6xl font-bold leading-none drop-shadow-sm sm:text-7xl md:text-8xl">
            Fabio
            <span className="mx-2 font-normal italic text-areia">&amp;</span>
            Karina
          </h1>
          <p className="mt-6 text-base font-semibold uppercase tracking-[0.35em] text-offwhite/90 sm:text-lg">
            {WEDDING.dataNumerica}
          </p>
          <p className="mt-2 text-sm uppercase tracking-[0.2em] text-offwhite/70">
            {WEDDING.cidade}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/confirmar-presenca" className="btn-primary">
              Confirmar presença
            </Link>
            <Link
              href="/presentes"
              className="inline-flex items-center justify-center rounded-full border-2 border-offwhite/80 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-offwhite transition hover:bg-offwhite hover:text-urbano active:scale-95"
            >
              Lista de presentes
            </Link>
          </div>
        </div>
      </section>

      {/* BOAS-VINDAS */}
      <section className="container-page py-16 text-center md:py-24">
        <RioSpEmblem className="mx-auto mb-6 h-12 w-12" />
        <h2 className="section-title mx-auto max-w-2xl">Sejam bem-vindos!</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-urbano/70">
          {content.hero_sub}
        </p>
      </section>

      <WaveDivider color="#006994" />

      {/* CONTADOR */}
      <section className="bg-oceano/5 py-16 text-center md:py-24">
        <div className="container-page">
          <span className="eyebrow">Contagem regressiva</span>
          <h2 className="section-title mb-2">Faltam só...</h2>
          <p className="mb-10 text-urbano/60">
            ...para a Karina chegar (no horário carioca) e o Fabio reclamar do trânsito.
          </p>
          <Countdown />
        </div>
      </section>

      {/* DOIS MUNDOS */}
      <section className="bg-oceano/5 pb-16 md:pb-24">
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
