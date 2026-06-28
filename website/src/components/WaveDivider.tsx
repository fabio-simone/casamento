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
        className="block h-[36px] w-full md:h-[56px]"
      >
        <path
          d="M0,40 C240,80 480,80 720,40 C960,0 1200,0 1440,40 L1440,80 L0,80 Z"
          style={{ fill: `rgb(var(--color-${tone}))` }}
        />
      </svg>
    </div>
  );
}
