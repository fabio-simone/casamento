import type { Metadata } from "next";
import { GiftCard } from "@/components/GiftCard";
import { WaveDivider } from "@/components/WaveDivider";
import { getGiftsWithQuotas } from "@/lib/gifts";
import { getContent } from "@/lib/content";

export const metadata: Metadata = { title: "Lista de Presentes" };
export const dynamic = "force-dynamic";

export default async function PresentesPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const gifts = await getGiftsWithQuotas();
  const { paginas } = await getContent();
  const p = paginas.presentes;
  const status = searchParams.status;

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

      <WaveDivider tone="oceanoDark" />

      <section className="section-dark py-12 md:py-16">
        <div className="container-page">
        {status === "sucesso" && (
          <div className="mx-auto mb-8 max-w-2xl rounded-2xl bg-oceano/10 px-5 py-4 text-center text-oceano">
            🎉 Pagamento recebido! Assim que confirmado, sua cota aparece como paga.
            Muito obrigado!
          </div>
        )}
        {status === "pendente" && (
          <div className="mx-auto mb-8 max-w-2xl rounded-2xl bg-areia/40 px-5 py-4 text-center text-urbano">
            ⏳ Pagamento pendente. Assim que for aprovado, atualizamos a cota.
          </div>
        )}
        {status === "falha" && (
          <div className="mx-auto mb-8 max-w-2xl rounded-2xl bg-red-50 px-5 py-4 text-center text-red-700">
            😕 O pagamento não foi concluído. Você pode tentar de novo quando quiser.
          </div>
        )}

        {gifts.length === 0 ? (
          <p className="py-20 text-center text-offwhite/60">
            A lista de presentes ainda está sendo preparada. Volte em breve! 🎁
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gifts.map((gift) => (
              <GiftCard key={gift.id} gift={gift} />
            ))}
          </div>
        )}
        </div>
      </section>
    </>
  );
}
