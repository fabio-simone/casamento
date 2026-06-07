import type { Metadata } from "next";
import { Church, Wine, Shirt, BedDouble, MapPin, Car, type LucideIcon } from "lucide-react";
import { WaveDivider } from "@/components/WaveDivider";
import { WEDDING } from "@/lib/constants";

export const metadata: Metadata = { title: "Informações" };

const blocos: { icon: LucideIcon; titulo: string; itens: string[] }[] = [
  {
    icon: Church,
    titulo: "Cerimônia",
    itens: [
      `Local: ${WEDDING.cerimonia.nome}`,
      `Endereço: ${WEDDING.cerimonia.endereco}`,
      `Horário: ${WEDDING.cerimonia.horario} (horário de SP — sim, pontual)`,
    ],
  },
  {
    icon: Wine,
    titulo: "Recepção",
    itens: [
      `Local: ${WEDDING.recepcao.nome}`,
      `Horário: a partir das ${WEDDING.recepcao.horario}`,
      "Open bar com caipirinha (Rio) e chopp gelado (SP).",
    ],
  },
  {
    icon: Shirt,
    titulo: "Dress code",
    itens: [
      WEDDING.dressCode,
      "Mulheres: vestido midi ou longo.",
      "Homens: terno ou social. Gravata opcional.",
    ],
  },
  {
    icon: BedDouble,
    titulo: "Hospedagem",
    itens: [
      "Cariocas: reservem hotel na região da Vila Olímpia / Itaim.",
      "Bloqueio de quartos com desconto no Hotel Exemplo (cód. KAFAMENTO).",
      "Dica: SP é grande, fiquem perto do local.",
    ],
  },
  {
    icon: MapPin,
    titulo: "Como chegar",
    itens: [
      "Metrô: estação Vila Olímpia (linha 9-Esmeralda) + 10 min a pé.",
      "Carro: estacionamento com valet no local.",
      "App de transporte: digite o endereço acima. Evite horário de pico (todo horário em SP).",
    ],
  },
  {
    icon: Car,
    titulo: "Estacionamento",
    itens: [
      "Valet disponível no evento.",
      "Vagas na rua: boa sorte, é São Paulo.",
    ],
  },
];

export default function InformacoesPage() {
  const mapsSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    WEDDING.cerimonia.mapsQuery
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
          {blocos.map((b) => {
            const Icon = b.icon;
            return (
            <div key={b.titulo} className="card">
              <Icon className="h-8 w-8 text-oceano" strokeWidth={1.5} />
              <h3 className="mt-3 font-display text-xl font-bold text-urbano">
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
            <p className="mt-2 text-offwhite/80">{WEDDING.cerimonia.endereco}</p>
          </div>
          <div className="overflow-hidden rounded-2xl border-4 border-white shadow-lg">
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
