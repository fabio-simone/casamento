import type { Metadata } from "next";
import {
  Building2,
  GlassWater,
  Gem,
  Sparkles,
  Camera,
  UtensilsCrossed,
  Music,
  Heart,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { WaveDivider } from "@/components/WaveDivider";
import { getContent } from "@/lib/content";

export const metadata: Metadata = { title: "Cronograma" };
export const dynamic = "force-dynamic";

const ICONES: Record<string, LucideIcon> = {
  predio: Building2,
  taca: GlassWater,
  anel: Gem,
  estrela: Sparkles,
  camera: Camera,
  prato: UtensilsCrossed,
  musica: Music,
  coracao: Heart,
};

export default async function CronogramaPage() {
  const { cronograma, paginas } = await getContent();
  const p = paginas.cronograma;

  return (
    <>
      <section className="bg-gradient-to-b from-oceano/10 to-offwhite pb-12 pt-28 text-center md:pb-16 md:pt-32">
        <div className="container-page">
          <span className="eyebrow">{p.eyebrow}</span>
          <h1 className="section-title">{p.titulo}</h1>
          {p.intro && <p className="mx-auto mt-4 max-w-xl text-urbano/70">{p.intro}</p>}
        </div>
      </section>

      <WaveDivider color="#04476A" />

      <section className="section-dark py-16 md:py-20">
        <ol className="container-page mx-auto max-w-2xl space-y-6">
          {cronograma.map((e, i) => {
            const Icon = ICONES[e.icone] ?? Clock;
            return (
              <li key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                      e.lado === "rio" ? "bg-oceano text-white" : "bg-laranja text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  {i < cronograma.length - 1 && (
                    <span className="my-1 h-full w-0.5 flex-1 bg-white/20" aria-hidden />
                  )}
                </div>
                <div className="card flex-1">
                  <span className="eyebrow">{e.hora}</span>
                  <h3 className="font-display text-xl font-medium text-urbano">{e.titulo}</h3>
                  <p className="mt-1 text-urbano/70">{e.texto}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}
