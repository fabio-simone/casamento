import type { Metadata } from "next";
import Link from "next/link";
import { Quote } from "lucide-react";
import { WaveDivider } from "@/components/WaveDivider";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDateSP } from "@/lib/utils";
import type { Recado } from "@/lib/types";

export const metadata: Metadata = { title: "Mensagens" };
export const dynamic = "force-dynamic";

async function getRecados(): Promise<Recado[]> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("recados")
      .select("id, nome, mensagem, created_at")
      .order("created_at", { ascending: false });
    return (data ?? []) as Recado[];
  } catch {
    return [];
  }
}

export default async function MensagensPage() {
  const recados = await getRecados();

  return (
    <>
      <section className="bg-gradient-to-b from-oceano/10 to-offwhite py-16 text-center md:py-20">
        <div className="container-page">
          <span className="eyebrow">Mural de carinho</span>
          <h1 className="section-title">Mensagens dos convidados</h1>
          <p className="mx-auto mt-4 max-w-xl text-urbano/70">
            Todo o carinho que recebemos de quem é importante pra gente.
          </p>
        </div>
      </section>

      <WaveDivider />

      <section className="container-page py-12 md:py-16">
        {recados.length === 0 ? (
          <p className="py-16 text-center text-urbano/50">
            Ainda não há mensagens. Seja o primeiro a deixar um recado na página da{" "}
            <Link href="/nossa-historia" className="text-oceano hover:underline">
              Nossa História
            </Link>
            !
          </p>
        ) : (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {recados.map((r) => (
              <div
                key={r.id}
                className="mb-5 break-inside-avoid rounded-2xl border border-areia bg-white p-6 shadow-sm"
              >
                <Quote className="mb-3 h-6 w-6 text-oceano/40" strokeWidth={1.5} />
                <p className="text-urbano/90">{r.mensagem}</p>
                <p className="mt-4 text-sm font-semibold text-oceano">
                  — {r.nome}{" "}
                  <span className="font-normal text-urbano/40">
                    · {formatDateSP(r.created_at, { dateStyle: "short" })}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
