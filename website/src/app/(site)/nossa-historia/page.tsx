import type { Metadata } from "next";
import { Camera } from "lucide-react";
import { WaveDivider } from "@/components/WaveDivider";
import { SaoPauloSilhouette } from "@/components/SaoPauloSilhouette";
import { getContent } from "@/lib/content";
import { WEDDING } from "@/lib/constants";
import { objectPositionFromUrl } from "@/lib/utils";

export const metadata: Metadata = { title: "Nossa História" };
export const dynamic = "force-dynamic";

export default async function NossaHistoriaPage() {
  const content = await getContent();

  return (
    <>
      <section className="bg-gradient-to-b from-oceano/10 to-offwhite py-16 text-center md:py-20">
        <div className="container-page">
          <span className="eyebrow">Nossa História</span>
          <h1 className="section-title mx-auto max-w-2xl">
            Como o Rio e SP decidiram morar juntos
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-urbano/70">{content.historia_intro}</p>

          {content.historia_foto && (
            <div className="mx-auto mt-8 max-w-md overflow-hidden rounded-2xl border-4 border-white shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={content.historia_foto}
                alt={WEDDING.noivos}
                className="h-full w-full object-cover"
                style={{ objectPosition: objectPositionFromUrl(content.historia_foto) }}
              />
            </div>
          )}
        </div>
      </section>

      <WaveDivider />

      {/* TIMELINE */}
      <section className="container-page py-16 md:py-20">
        <div className="relative mx-auto max-w-3xl">
          <div className="absolute left-4 top-0 h-full w-0.5 bg-areia md:left-1/2 md:-translate-x-1/2" aria-hidden />
          <ul className="space-y-10">
            {content.timeline.map((item, i) => (
              <li
                key={i}
                className={`relative pl-12 md:w-1/2 md:pl-0 ${
                  i % 2 === 0 ? "md:pr-10 md:text-right" : "md:ml-auto md:pl-10"
                }`}
              >
                <span
                  className={`absolute top-2 z-10 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white shadow ${
                    item.lado === "rio" ? "bg-oceano" : "bg-urbano"
                  } left-[9px] ${
                    i % 2 === 0 ? "md:left-auto md:-right-2" : "md:-left-2"
                  }`}
                />
                <div className="card">
                  <span className="eyebrow">{item.ano}</span>
                  <h3 className="font-display text-xl font-bold text-urbano">
                    {item.titulo}
                  </h3>
                  <p className="mt-2 text-urbano/70">{item.texto}</p>
                  {item.foto ? (
                    <div className="mt-4 overflow-hidden rounded-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.foto}
                        alt={item.titulo}
                        className="aspect-video w-full object-cover"
                        style={{ objectPosition: objectPositionFromUrl(item.foto) }}
                      />
                    </div>
                  ) : (
                    <div className="mt-4 flex aspect-video items-center justify-center gap-2 rounded-xl bg-areia/40 text-xs text-urbano/40">
                      <Camera className="h-4 w-4" strokeWidth={1.5} /> Foto em breve
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto mt-12 max-w-xs opacity-20">
          <SaoPauloSilhouette className="h-auto w-full" />
        </div>
      </section>

    </>
  );
}
