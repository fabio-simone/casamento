import type { Metadata } from "next";
import { Camera } from "lucide-react";
import { WaveDivider } from "@/components/WaveDivider";
import { getContent } from "@/lib/content";
import { objectPositionFromUrl } from "@/lib/utils";

export const metadata: Metadata = { title: "Galeria" };
export const dynamic = "force-dynamic";

export default async function GaleriaPage() {
  const { galeria, paginas } = await getContent();
  const p = paginas.galeria;

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

      <section className="section-dark py-12 md:py-16">
        <div className="container-page">
        {galeria.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center text-offwhite/60">
            <Camera className="h-10 w-10" strokeWidth={1.25} />
            <p>As fotos estão chegando. Volte em breve! 📸</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {galeria.map((url, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Foto ${i + 1}`}
                  className="h-full w-full object-cover transition hover:opacity-90"
                  style={{ objectPosition: objectPositionFromUrl(url) }}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
        </div>
      </section>
    </>
  );
}
