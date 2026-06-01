import type { Metadata } from "next";
import { Recados } from "@/components/Recados";
import { WaveDivider } from "@/components/WaveDivider";
import { SaoPauloSilhouette } from "@/components/SaoPauloSilhouette";

export const metadata: Metadata = { title: "Nossa História" };

const timeline = [
  {
    ano: "O encontro",
    titulo: "Ela do Rio, ele de SP",
    texto:
      "Karina dizia 'maravilhoso', Fabio respondia 'mano, que isso'. Foi amor à primeira tradução simultânea.",
    emoji: "💘",
    lado: "rio",
  },
  {
    ano: "O primeiro date",
    titulo: "Praia ou rodízio?",
    texto:
      "Empate técnico: foram à praia de manhã (ideia dela) e a um rodízio de pizza à noite (ideia dele). Ninguém saiu perdendo.",
    emoji: "🍕",
    lado: "sp",
  },
  {
    ano: "A primeira viagem",
    titulo: "Ponte aérea oficial",
    texto:
      "A GOL e a LATAM deviam dar milhas extras pra esse casal. Rio–SP virou rotina, e a sogra ganhou quarto fixo nas duas cidades.",
    emoji: "✈️",
    lado: "rio",
  },
  {
    ano: "O pedido",
    titulo: "Sim, com sotaque",
    texto:
      "Ele ensaiou em 'paulistanês', ela respondeu em 'carioquês'. No fim, o 'sim' é universal — e veio com choro dos dois.",
    emoji: "💍",
    lado: "sp",
  },
  {
    ano: "Agora",
    titulo: "22/11 — o grande dia",
    texto:
      "Onde o oceano de Copacabana encontra o concreto da Paulista. Vem ver de perto essa fusão dar certo.",
    emoji: "🌊",
    lado: "rio",
  },
];

export default function NossaHistoriaPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-oceano/10 to-offwhite py-16 text-center md:py-20">
        <div className="container-page">
          <span className="eyebrow">Nossa História</span>
          <h1 className="section-title mx-auto max-w-2xl">
            Como o Rio e SP decidiram morar juntos
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-urbano/70">
            Spoiler: deu certo. Uma linha do tempo (bem-humorada) da gente.
          </p>
        </div>
      </section>

      <WaveDivider />

      {/* TIMELINE */}
      <section className="container-page py-16 md:py-20">
        <div className="relative mx-auto max-w-3xl">
          <div className="absolute left-4 top-0 h-full w-0.5 bg-areia md:left-1/2 md:-translate-x-1/2" aria-hidden />
          <ul className="space-y-10">
            {timeline.map((item, i) => (
              <li
                key={i}
                className={`relative pl-12 md:w-1/2 md:pl-0 ${
                  i % 2 === 0 ? "md:pr-10 md:text-right" : "md:ml-auto md:pl-10"
                }`}
              >
                <span
                  className={`absolute top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow ${
                    item.lado === "rio" ? "bg-oceano" : "bg-urbano"
                  } left-0 text-sm md:left-auto ${
                    i % 2 === 0 ? "md:-right-4" : "md:-left-4"
                  }`}
                >
                  {item.emoji}
                </span>
                <div className="card">
                  <span className="eyebrow">{item.ano}</span>
                  <h3 className="font-display text-xl font-bold text-urbano">
                    {item.titulo}
                  </h3>
                  <p className="mt-2 text-urbano/70">{item.texto}</p>
                  {/* placeholder de foto */}
                  <div className="mt-4 flex aspect-video items-center justify-center rounded-xl bg-areia/40 text-xs text-urbano/40">
                    📸 Foto (em breve)
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto mt-12 max-w-xs opacity-20">
          <SaoPauloSilhouette />
        </div>
      </section>

      <WaveDivider color="#E8D5B0" />

      {/* RECADOS */}
      <section className="bg-oceano/5 py-16 md:py-20">
        <div className="container-page">
          <div className="mb-10 text-center">
            <span className="eyebrow">Mural de recados</span>
            <h2 className="section-title">Deixe seu carinho para o casal</h2>
          </div>
          <Recados />
        </div>
      </section>
    </>
  );
}
