import type { Metadata } from "next";
import Link from "next/link";
import { Accordion, type QA } from "@/components/Accordion";
import { WaveDivider } from "@/components/WaveDivider";

export const metadata: Metadata = { title: "FAQ" };

const faqs: QA[] = [
  {
    pergunta: "Vai ter feijoada ou pastel de feira?",
    resposta:
      "Os dois! A diplomacia Rio-SP foi negociada com carinho. Feijoada para os cariocas, pastel de feira para os paulistas, e todo mundo come das duas coisas mesmo.",
  },
  {
    pergunta: "Posso ir de havaianas?",
    resposta:
      "Karina diria que sim. Fábio implora que não. O dress code é esporte fino, então deixe a havaiana para a praia (ou para o presente do Fábio na lista).",
  },
  {
    pergunta: "O Fábio já aprendeu a falar 'maravilhoso'?",
    resposta:
      "Está em treinamento intensivo. Já consegue dizer 'maravilhoso' sem fazer careta. Em troca, a Karina já fala 'mano' e até reclama do trânsito como uma paulistana raiz.",
  },
  {
    pergunta: "Que horas começa, no horário carioca ou paulistano?",
    resposta:
      "Horário paulistano, ou seja: pontual. A cerimônia começa às 16h em ponto. Cariocas, por favor, somem 20 minutos do seu relógio interno.",
  },
  {
    pergunta: "Posso levar acompanhante?",
    resposta:
      "Depende do seu convite — você indica o número de acompanhantes (até 5) na confirmação de presença. Confirme com antecedência para a gente organizar as mesas (e a feijoada).",
  },
  {
    pergunta: "Vai ter estacionamento?",
    resposta:
      "Sim, com valet no local. Se você é carioca e tem medo de dirigir em SP, recomendamos app de transporte ou o metrô (que, orgulho paulistano, funciona).",
  },
  {
    pergunta: "Crianças são bem-vindas?",
    resposta:
      "Amamos crianças! Confirme a presença delas como acompanhantes para garantirmos cardápio e cadeirinhas.",
  },
  {
    pergunta: "Como faço para dar um presente?",
    resposta:
      "Na página de Presentes! Escolha um presente (ou uma cota dele), clique em 'Presentear' e pague com cartão, Pix ou boleto via Mercado Pago. Bônus: tem presente para o Fábio sobreviver no Rio e para a Karina sobreviver em SP.",
  },
  {
    pergunta: "Qual o time da casa: Flamengo ou Corinthians?",
    resposta:
      "Essa é proibida. Por isso temos um item na lista de presentes: 'Fundo de emergência para não brigar sobre Flamengo'. Contribua pela paz do casal.",
  },
];

export default function FaqPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-oceano/10 to-offwhite py-16 text-center md:py-20">
        <div className="container-page">
          <span className="eyebrow">FAQ</span>
          <h1 className="section-title">Perguntas (quase) frequentes</h1>
          <p className="mx-auto mt-4 max-w-xl text-urbano/70">
            Tudo que você queria perguntar, com a dose certa de Rio vs SP.
          </p>
        </div>
      </section>

      <WaveDivider />

      <section className="container-page py-16 md:py-20">
        <Accordion items={faqs} />

        <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-areia bg-oceano/5 p-6 text-center">
          <p className="text-urbano/80">
            Não achou sua dúvida ou teve algum problema no site?
          </p>
          <Link href="/contato" className="btn-secondary mt-4">
            Falar com a gente
          </Link>
        </div>
      </section>
    </>
  );
}
