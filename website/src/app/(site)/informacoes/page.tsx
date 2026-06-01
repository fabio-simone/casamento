import type { Metadata } from "next";
import { WaveDivider } from "@/components/WaveDivider";
import { WEDDING } from "@/lib/constants";

export const metadata: Metadata = { title: "Informações" };

const blocos = [
  {
    icon: "⛪",
    titulo: "Cerimônia",
    itens: [
      `Local: ${WEDDING.cerimonia.nome}`,
      `Endereço: ${WEDDING.cerimonia.endereco}`,
      `Horário: ${WEDDING.cerimonia.horario} (horário de SP — sim, pontual)`,
    ],
  },
  {
    icon: "🥂",
    titulo: "Recepção",
    itens: [
      `Local: ${WEDDING.recepcao.nome}`,
      `Horário: a partir das ${WEDDING.recepcao.horario}`,
      "Open bar com caipirinha (Rio) e chopp gelado (SP).",
    ],
  },
  {
    icon: "👗",
    titulo: "Dress code",
    itens: [
      WEDDING.dressCode,
      "Mulheres: vestido midi ou longo.",
      "Homens: terno ou social. Gravata opcional.",
    ],
  },
  {
    icon: "🏨",
    titulo: "Hospedagem",
    itens: [
      "Cariocas: reservem hotel na região da Vila Olímpia / Itaim.",
      "Bloqueio de quartos com desconto no Hotel Exemplo (cód. KAFAMENTO).",
      "Dica: SP é grande, fiquem perto do local.",
    ],
  },
  {
    icon: "🚗",
    titulo: "Como chegar",
    itens: [
      "Metrô: estação Vila Olímpia (linha 9-Esmeralda) + 10 min a pé.",
      "Carro: estacionamento com valet no local.",
      "App de transporte: digite o endereço acima. Evite horário de pico (todo horário em SP).",
    ],
  },
  {
    icon: "🅿️",
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
      <section className="bg-gradient-to-b from-oceano/10 to-offwhite py-16 text-center md:py-20">
        <div className="container-page">
          <span className="eyebrow">Informações</span>
          <h1 className="section-title">Tudo que você precisa saber</h1>
          <p className="mx-auto mt-4 max-w-xl text-urbano/70">
            {WEDDING.dataExtenso} · {WEDDING.cidade}
          </p>
        </div>
      </section>

      <WaveDivider />

      <section className="container-page py-16 md:py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blocos.map((b) => (
            <div key={b.titulo} className="card">
              <span className="text-4xl">{b.icon}</span>
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
          ))}
        </div>
      </section>

      {/* MAPA */}
      <section className="bg-oceano/5 py-16 md:py-20">
        <div className="container-page">
          <div className="mb-8 text-center">
            <span className="eyebrow">No mapa</span>
            <h2 className="section-title">Onde vai ser</h2>
            <p className="mt-2 text-urbano/70">{WEDDING.cerimonia.endereco}</p>
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
