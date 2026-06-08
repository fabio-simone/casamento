import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { WEDDING } from "@/lib/constants";
import { WaveDivider } from "./WaveDivider";

export function Footer() {
  return (
    <>
      {/* transição da seção azul (dark) para o rodapé claro (areia) */}
      <div className="bg-oceanoDark">
        <WaveDivider tone="areia" />
      </div>

      <footer className="bg-areia text-urbano">
        {/* voltar ao início */}
        <div className="flex justify-center pb-2 pt-8">
          <Link
            href="#topo"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-urbano/60 transition hover:text-oceano"
          >
            <ArrowUp className="h-4 w-4" strokeWidth={1.5} /> Voltar ao início
          </Link>
        </div>

        <div className="container-page grid gap-8 py-10 sm:grid-cols-3">
          <div>
            <h3 className="font-display text-2xl text-urbano">{WEDDING.noivos}</h3>
            <p className="mt-2 text-sm text-urbano/70">
              {WEDDING.dataExtenso} · {WEDDING.cidade}
            </p>
            <p className="mt-1 text-sm text-urbano/50">O Rio encontra SP</p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-laranja">
              Navegar
            </h4>
            <ul className="space-y-2 text-sm text-urbano/80">
              <li><Link href="/nossa-historia" className="hover:text-oceano">Nossa História</Link></li>
              <li><Link href="/informacoes" className="hover:text-oceano">Informações</Link></li>
              <li><Link href="/presentes" className="hover:text-oceano">Lista de Presentes</Link></li>
              <li><Link href="/confirmar-presenca" className="hover:text-oceano">Confirmar Presença</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-laranja">
              Contato
            </h4>
            <p className="text-sm text-urbano/80">{WEDDING.dominio}</p>
            <p className="mt-2 text-sm">
              <Link href="/contato" className="text-oceano hover:underline">
                Precisa de ajuda? Fale com a gente
              </Link>
            </p>
            <p className="mt-4 text-xs text-urbano/50">
              Feito com café paulistano e água de coco carioca.
            </p>
          </div>
        </div>
        <div className="border-t border-urbano/10 py-4 text-center text-xs text-urbano/50">
          © {new Date().getFullYear()} {WEDDING.noivos}. Todos os direitos (e algumas piadas) reservados.
        </div>
      </footer>
    </>
  );
}
