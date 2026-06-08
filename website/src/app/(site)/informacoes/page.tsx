import type { Metadata } from "next";
import {
  Church,
  Wine,
  Shirt,
  BedDouble,
  MapPin,
  Car,
  Clock,
  Heart,
  Info,
  type LucideIcon,
} from "lucide-react";
import { WaveDivider } from "@/components/WaveDivider";
import { WEDDING } from "@/lib/constants";
import { getContent } from "@/lib/content";

export const metadata: Metadata = { title: "Informações" };
export const dynamic = "force-dynamic";

const ICONES: Record<string, LucideIcon> = {
  igreja: Church,
  taca: Wine,
  roupa: Shirt,
  hotel: BedDouble,
  mapa: MapPin,
  carro: Car,
  relogio: Clock,
  coracao: Heart,
  info: Info,
};

export default async function InformacoesPage() {
  const { informacoes } = await getContent();
  const mapsSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    informacoes.mapa_query
  )}&output=embed`;

  return (
    <>
      <section className="bg-gradient-to-b from-oceano/10 to-offwhite pb-12 pt-28 text-center md:pb-16 md:pt-32">
        <div className="container-page">
          <span className="eyebrow">Informações</span>
          <h1 className="section-title">Tudo que você precisa saber</h1>
          <p className="mx-auto mt-4 max-w-xl text-urbano/70">
            {WEDDING.dataExtenso} · {WEDDING.cidade}
          </p>
        </div>
      </section>

      <WaveDivider color="#04476A" />

      <section className="section-dark py-16 md:py-20">
        <div className="container-page grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {informacoes.blocos.map((b, idx) => {
            const Icon = ICONES[b.icone] ?? Info;
            return (
              <div key={idx} className="card">
                <Icon className="h-8 w-8 text-oceano" strokeWidth={1.5} />
                <h3 className="mt-3 font-display text-xl font-medium text-urbano">
                  {b.titulo}
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-urbano/70">
                  {b.itens.map((it, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-oceano">•</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* MAPA */}
      <section className="section-dark py-16 md:py-20">
        <div className="container-page">
          <div className="mb-8 text-center">
            <span className="eyebrow">No mapa</span>
            <h2 className="section-title">Onde vai ser</h2>
            <p className="mt-2 text-offwhite/80">{informacoes.mapa_endereco}</p>
          </div>
          <div className="overflow-hidden rounded-2xl border-4 border-white/20 shadow-lg">
            <iframe
              title="Mapa do local"
              src={mapsSrc}
              className="h-[360px] w-full md:h-[460px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
