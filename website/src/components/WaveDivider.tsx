import { cn } from "@/lib/utils";

/**
 * Separador de seções em forma de onda suave — referência ao calçadão
 * de Copacabana, mas minimalista (uma curva limpa). `flip` inverte.
 */
type Tone = "oceano" | "oceanoDark" | "laranja" | "areia" | "urbano" | "offwhite";

export function WaveDivider({
  className,
  tone = "oceanoDark",
  flip = false,
}: {
  className?: string;
  tone?: Tone;
  flip?: boolean;
}) {
  return (
    <div
      className={cn("w-full overflow-hidden leading-[0]", className)}
      style={{ transform: flip ? "scaleY(-1)" : undefined }}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="h-[36px] w-full md:h-[56px]"
      >
        <path
          d="M0,40 C240,80 480,80 720,40 C960,0 1200,0 1440,40 L1440,80 L0,80 Z"
          style={{ fill: `rgb(var(--color-${tone}))` }}
        />
      </svg>
    </div>
  );
}

/**
 * Faixa de ondas finas (estilo calçadão), estática e encaixada — usada
 * como detalhe sutil. Sem animação, linhas finas, visual limpo.
 */
export function CopacabanaWaves({ className }: { className?: string }) {
  return (
    <div
      className={cn("pointer-events-none w-full overflow-hidden", className)}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 40"
        preserveAspectRatio="none"
        className="h-6 w-full md:h-8"
      >
        <path
          d="M0,20 C120,4 240,36 360,20 C480,4 600,36 720,20 C840,4 960,36 1080,20 C1200,4 1320,36 1440,20"
          fill="none"
          stroke="#006994"
          strokeWidth="2"
          opacity="0.5"
        />
        <path
          d="M0,30 C120,14 240,46 360,30 C480,14 600,46 720,30 C840,14 960,46 1080,30 C1200,14 1320,46 1440,30"
          fill="none"
          stroke="#E8D5B0"
          strokeWidth="2"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}
