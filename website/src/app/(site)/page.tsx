import Link from "next/link";
import { Waves, Building2 } from "lucide-react";
import { Countdown } from "@/components/Countdown";
import { RecadosCarousel } from "@/components/RecadosCarousel";
import { WaveDivider } from "@/components/WaveDivider";
import { RioSpEmblem } from "@/components/SaoPauloSilhouette";
import { WEDDING } from "@/lib/constants";
import { getContent } from "@/lib/content";
import { objectPositionFromUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getContent();
  // Enquadramento da foto no celular (ajustável no painel), aplicado via media query.
  const [mx, my] = (content.hero_pos_mobile || "72,42")
    .split(",")
    .map((n) => Number(n) || 0);
  return (
    <>
      {/* HERO — tela cheia com foto do casal */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        {/* enquadramento da foto no celular (definido no painel) */}
        <style
          dangerouslySetInnerHTML={{
            __html: `@media (max-width:640px){.hero-photo{object-position:${mx}% ${my}% !important}}`,
          }}
        />
        {/* fundo: foto do casal (clara, sem escurecer) ou gradiente */}
        {content.hero_foto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={content.hero_foto}
            alt={WEDDING.noivos}
            className="hero-photo absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: objectPositionFromUrl(content.hero_foto) }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-oceano via-oceano/90 to-oceanoDark" />
        )}

        {/* scrim azul à esquerda: escurece só onde ficam os nomes (rostos à direita ficam claros) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-oceanoDark/80 via-oceanoDark/35 to-transparent" />
        {/* gradiente fino na base: a foto se funde no azul da próxima seção */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-b from-transparent to-oceanoDark" />

        <div className="container-page relative z-10 animate-fade-up py-24">
          {/* bloco centralizado, posicionado na área esquerda do hero */}
          <div
            className="mx-auto max-w-sm text-center text-offwhite sm:mx-0 sm:ml-[6%] lg:ml-[10%]"
            style={{ textShadow: "0 2px 24px rgba(4,71,106,0.6)" }}
          >
            <RioSpEmblem className="mx-auto mb-3 h-14 w-14" stroke="rgb(var(--color-offwhite))" />
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-laranja [text-indent:0.3em]">
              {content.textos.hero_eyebrow}
            </span>
            <h1 className="mt-5 font-display font-normal leading-[1.02]">
              <span className="block text-5xl sm:text-6xl md:text-7xl">Karina</span>
              <span className="my-1 block text-3xl font-normal italic text-laranja sm:text-4xl">
                &amp;
              </span>
              <span className="block text-5xl sm:text-6xl md:text-7xl">Fábio</span>
            </h1>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.35em] text-offwhite/90 sm:text-base">
              {WEDDING.dataNumerica}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.25em] text-offwhite/70">
              {WEDDING.cidade}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2.5">
              <Link
                href="/confirmar-presenca"
                className="inline-flex items-center justify-center rounded-full bg-oceano px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-offwhite shadow-md transition hover:bg-oceano/90 active:scale-95"
              >
                {content.textos.hero_btn_confirmar}
              </Link>
              <Link
                href="/presentes"
                className="inline-flex items-center justify-center rounded-full border border-offwhite/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-offwhite transition hover:bg-offwhite hover:text-oceanoDark active:scale-95"
              >
                {content.textos.hero_btn_presentes}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BOAS-VINDAS (continua o azul do hero) */}
      <section className="section-dark py-16 text-center md:py-24">
        <div className="container-page">
          <RioSpEmblem className="mx-auto mb-6 h-12 w-12" stroke="rgb(var(--color-offwhite))" />
          <h2 className="section-title mx-auto max-w-2xl">{content.home.boas_vindas_titulo}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-offwhite/80">
            {content.hero_sub}
          </p>
        </div>
      </section>

      {/* transição azul → claro */}
      <div className="bg-oceanoDark">
        <WaveDivider tone="offwhite" />
      </div>

      {/* CONTADOR */}
      <section className="bg-offwhite py-16 text-center md:py-24">
        <div className="container-page">
          <span className="eyebrow">Contagem regressiva</span>
          <h2 className="section-title mb-2">{content.home.contador_titulo}</h2>
          <p className="mb-10 text-urbano/60">{content.home.contador_texto}</p>
          <Countdown />
        </div>
      </section>

      {/* DOIS MUNDOS */}
      <section className="bg-offwhite pb-16 md:pb-24">
        <div className="container-page grid gap-6 md:grid-cols-2">
          <div className="card border-oceano/30">
            <Waves className="h-9 w-9 text-oceano" strokeWidth={1.5} />
            <h3 className="mt-3 font-display text-2xl font-medium text-oceano">
              {content.home.lado_rio_titulo}
            </h3>
            <p className="mt-2 text-urbano/70">{content.home.lado_rio_texto}</p>
          </div>
          <div className="card border-urbano/20">
            <Building2 className="h-9 w-9 text-urbano" strokeWidth={1.5} />
            <h3 className="mt-3 font-display text-2xl font-medium text-urbano">
              {content.home.lado_sp_titulo}
            </h3>
            <p className="mt-2 text-urbano/70">{content.home.lado_sp_texto}</p>
          </div>
        </div>
      </section>

      <WaveDivider tone="oceanoDark" />

      {/* MENSAGENS (carrossel) */}
      <section className="section-dark py-16 text-center md:py-24">
        <div className="container-page">
          <span className="eyebrow">{content.home.recados_eyebrow}</span>
          <h2 className="section-title mb-2">{content.home.recados_titulo}</h2>
          <p className="mb-10 text-offwhite/70">{content.home.recados_texto}</p>
          <RecadosCarousel />
          <div className="mt-8">
            <Link href="/mensagens" className="btn-light">
              Ver todas as mensagens
            </Link>
          </div>
        </div>
      </section>

      {/* GALERIA (teaser) */}
      {content.galeria.length > 0 && (
        <section className="section-dark pb-16 md:pb-24">
          <div className="container-page text-center">
            <span className="eyebrow">{content.home.galeria_eyebrow}</span>
            <h2 className="section-title mb-8">{content.home.galeria_titulo}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
              {content.galeria.slice(0, 6).map((url, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Foto ${i + 1}`}
                    className="h-full w-full object-cover"
                    style={{ objectPosition: objectPositionFromUrl(url) }}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
            {content.galeria.length > 6 && (
              <Link href="/galeria" className="btn-light mt-8">
                Ver galeria completa
              </Link>
            )}
          </div>
        </section>
      )}

      {/* CTA FINAL */}
      <section className="section-dark py-16 text-center md:py-24">
        <div className="container-page">
          <h2 className="section-title mx-auto max-w-2xl">{content.home.cta_titulo}</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/confirmar-presenca" className="btn-primary">
              Confirmar presença
            </Link>
            <Link href="/nossa-historia" className="btn-light">
              Conhecer nossa história
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
