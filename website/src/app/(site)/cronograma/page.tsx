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
  type LucideIcon,
} from "lucide-react";
import { WaveDivider } from "@/components/WaveDivider";

export const metadata: Metadata = { title: "Cronograma" };

const eventos: {
  hora: string;
  titulo: string;
  texto: string;
  icon: LucideIcon;
  lado: "rio" | "sp";
}[] = [
  {
    hora: "Ontem",
    titulo: "Fábio chega ao local",
    texto: "Paulistano que é paulistano já está lá conferindo se tudo começa no horário.",
    icon: Building2,
    lado: "sp",
  },
  {
    hora: "15h30",
    titulo: "Recepção dos convidados",
    texto: "Welcome drink: água de coco para os cariocas, água com gás para os paulistas.",
    icon: GlassWater,
    lado: "rio",
  },
  {
    hora: "16h00",
    titulo: "Cerimônia",
    texto: "Início pontual (relógio de SP). Tragam lencinho — vai ter choro garantido.",
    icon: Gem,
    lado: "sp",
  },
  {
    hora: "16h20",
    titulo: "Karina entra",
    texto: "Karina chega no 'horário carioca' — ou seja, atrasada e linda. Vale a pena esperar.",
    icon: Sparkles,
    lado: "rio",
  },
  {
    hora: "17h00",
    titulo: "Fotos & cumprimentos",
    texto: "Hora de tirar foto com todo mundo. Sim, inclusive com a tia que você não vê há 10 anos.",
    icon: Camera,
    lado: "sp",
  },
  {
    hora: "18h00",
    titulo: "Festa & jantar",
    texto: "Feijoada E pastel de feira. A diplomacia Rio-SP venceu. Open bar liberado.",
    icon: UtensilsCrossed,
    lado: "rio",
  },
  {
    hora: "20h00",
    titulo: "Pista liberada",
    texto: "Samba do Rio se mistura com o pop rock paulistano. Ninguém senta.",
    icon: Music,
    lado: "sp",
  },
  {
    hora: "23h00",
    titulo: "Bem-casados & despedida",
    texto: "Leve seu bem-casado. O Fábio volta pra SP, a Karina sonha com a praia. Felizes para sempre.",
    icon: Heart,
    lado: "rio",
  },
];

export default function CronogramaPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-oceano/10 to-offwhite pb-12 pt-28 text-center md:pb-16 md:pt-32">
        <div className="container-page">
          <span className="eyebrow">Cronograma · 22 de novembro</span>
          <h1 className="section-title">O grande dia, minuto a minuto</h1>
          <p className="mx-auto mt-4 max-w-xl text-urbano/70">
            Todos os horários no fuso de São Paulo. Cariocas, ajustem o relógio interno. 😉
          </p>
        </div>
      </section>

      <WaveDivider color="#04476A" />

      <section className="section-dark py-16 md:py-20">
        <ol className="container-page mx-auto max-w-2xl space-y-6">
          {eventos.map((e, i) => {
            const Icon = e.icon;
            return (
            <li key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                    e.lado === "rio" ? "bg-oceano text-white" : "bg-urbano text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                {i < eventos.length - 1 && (
                  <span className="my-1 h-full w-0.5 flex-1 bg-areia" aria-hidden />
                )}
              </div>
              <div className="card flex-1">
                <span className="eyebrow">{e.hora}</span>
                <h3 className="font-display text-xl font-bold text-urbano">{e.titulo}</h3>
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
