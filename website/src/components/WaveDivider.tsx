import { cn } from "@/lib/utils";

/**
 * Onda do calçadão de Copacabana (padrão português preto-e-branco em curvas).
 * Usado como separador de seções. `flip` inverte verticalmente.
 */
export function WaveDivider({
  className,
  color = "#006994",
  flip = false,
}: {
  className?: string;
  color?: string;
  flip?: boolean;
}) {
  return (
    <div
      className={cn("w-full overflow-hidden leading-[0]", className)}
      style={{ transform: flip ? "scaleY(-1)" : undefined }}
      aria-hidden
    >
      <svg
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        className="h-[40px] w-full md:h-[60px]"
      >
        <path
          d="M0,30 C150,0 300,60 450,30 C600,0 750,60 900,30 C1050,0 1150,50 1200,30 L1200,60 L0,60 Z"
          fill={color}
        />
        <path
          d="M0,40 C150,15 300,65 450,40 C600,15 750,65 900,40 C1050,15 1150,55 1200,40 L1200,60 L0,60 Z"
          fill={color}
          opacity="0.45"
        />
      </svg>
    </div>
  );
}

/**
 * Faixa de ondas animadas de Copacabana — calçadão estilizado em movimento.
 * Decorativo, fica bem como fundo de hero ou rodapé de seção.
 */
export function CopacabanaWaves({ className }: { className?: string }) {
  return (
    <div
      className={cn("pointer-events-none w-full overflow-hidden", className)}
      aria-hidden
    >
      <div className="flex w-[200%] animate-wave-slide">
        {[0, 1].map((i) => (
          <svg
            key={i}
            viewBox="0 0 600 80"
            preserveAspectRatio="none"
            className="h-12 w-1/2 md:h-16"
          >
            <path
              d="M0,40 C75,10 150,70 225,40 C300,10 375,70 450,40 C525,10 600,70 600,40"
              fill="none"
              stroke="#006994"
              strokeWidth="10"
            />
            <path
              d="M0,60 C75,30 150,90 225,60 C300,30 375,90 450,60 C525,30 600,90 600,60"
              fill="none"
              stroke="#E8D5B0"
              strokeWidth="10"
            />
          </svg>
        ))}
      </div>
    </div>
  );
}
