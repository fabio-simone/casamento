import type { Metadata } from "next";
import Link from "next/link";
import { Quote } from "lucide-react";
import { WaveDivider } from "@/components/WaveDivider";
import { createAdminClient } from "@/lib/supabase/admin";
import { getContent } from "@/lib/content";
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
  const { paginas } = await getContent();
  const p = paginas.mensagens;

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

      <WaveDivider color="#04476A" />

      <section className="section-dark py-12 md:py-16">
        <div className="container-page">
        {recados.length === 0 ? (
          <p className="py-16 text-center text-offwhite/60">
            Ainda não há mensagens. As primeiras chegam junto com os{" "}
            <Link href="/presentes" className="text-laranja hover:underline">
              presentes
            </Link>{" "}
            💙
          </p>
        ) : (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {recados.map((r) => (
              <div
                key={r.id}
                className="mb-5 break-inside-avoid rounded-2xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur-sm"
              >
                <Quote className="mb-3 h-6 w-6 text-laranja/70" strokeWidth={1.5} />
                <p className="text-offwhite/90">{r.mensagem}</p>
                <p className="mt-4 text-sm font-semibold text-laranja">
                  — {r.nome}{" "}
                  <span className="font-normal text-offwhite/40">
                    · {formatDateSP(r.created_at, { dateStyle: "short" })}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
        </div>
      </section>
    </>
  );
}
