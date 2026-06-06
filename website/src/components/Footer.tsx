import Link from "next/link";
import { WEDDING } from "@/lib/constants";
import { WaveDivider } from "./WaveDivider";

export function Footer() {
  return (
    <footer className="mt-24 bg-urbano text-offwhite">
      {/* transição suave da página (off-white) para o rodapé (escuro) */}
      <div className="bg-offwhite">
        <WaveDivider color="#3A3A3A" />
      </div>

      <div className="container-page grid gap-8 py-12 sm:grid-cols-3">
        <div>
          <h3 className="font-display text-2xl font-bold">{WEDDING.noivos}</h3>
          <p className="mt-2 text-sm text-offwhite/70">
            {WEDDING.dataExtenso} · {WEDDING.cidade}
          </p>
          <p className="mt-1 text-sm text-offwhite/50">O Rio encontra SP</p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-areia">
            Navegar
          </h4>
          <ul className="space-y-2 text-sm text-offwhite/80">
            <li><Link href="/nossa-historia" className="hover:text-areia">Nossa História</Link></li>
            <li><Link href="/informacoes" className="hover:text-areia">Informações</Link></li>
            <li><Link href="/presentes" className="hover:text-areia">Lista de Presentes</Link></li>
            <li><Link href="/confirmar-presenca" className="hover:text-areia">Confirmar Presença</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-areia">
            Contato
          </h4>
          <p className="text-sm text-offwhite/80">{WEDDING.dominio}</p>
          <p className="mt-4 text-xs text-offwhite/50">
            Feito com café paulistano e água de coco carioca.
          </p>
        </div>
      </div>
      <div className="border-t border-offwhite/10 py-4 text-center text-xs text-offwhite/40">
        © {new Date().getFullYear()} {WEDDING.noivos}. Todos os direitos (e algumas piadas) reservados.
      </div>
    </footer>
  );
}
