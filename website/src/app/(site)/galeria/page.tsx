import type { Metadata } from "next";
import { Camera } from "lucide-react";
import { WaveDivider } from "@/components/WaveDivider";
import { getContent } from "@/lib/content";

export const metadata: Metadata = { title: "Galeria" };
export const dynamic = "force-dynamic";

export default async function GaleriaPage() {
  const { galeria } = await getContent();

  return (
    <>
      <section className="bg-gradient-to-b from-oceano/10 to-offwhite pb-12 pt-28 text-center md:pb-16 md:pt-32">
        <div className="container-page">
          <span className="eyebrow">Galeria</span>
          <h1 className="section-title">Nossos momentos</h1>
          <p className="mx-auto mt-4 max-w-xl text-urbano/70">
            Um pouquinho da gente — do Rio a SP e por onde mais a vida levar.
          </p>
        </div>
      </section>

      <WaveDivider />

      <section className="container-page py-12 md:py-16">
        {galeria.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center text-urbano/50">
            <Camera className="h-10 w-10" strokeWidth={1.25} />
            <p>As fotos estão chegando. Volte em breve! 📸</p>
          </div>
        ) : (
          <div className="columns-2 gap-3 sm:columns-3 md:gap-4 lg:columns-4">
            {galeria.map((url, i) => (
              <div key={i} className="mb-3 overflow-hidden rounded-xl md:mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Foto ${i + 1}`}
                  className="w-full object-cover transition hover:opacity-90"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
