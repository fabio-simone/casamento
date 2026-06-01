import { cn } from "@/lib/utils";

/**
 * Silhueta estilizada do estado de São Paulo — referência às calçadas
 * paulistanas onde o mapa do estado aparece desenhado.
 * Caminho aproximado/decorativo (não cartográfico).
 */
export function SaoPauloSilhouette({
  className,
  fill = "#3A3A3A",
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 140"
      className={cn("h-auto w-full", className)}
      aria-hidden
    >
      <path
        d="M18,52 L40,40 L62,46 L84,34 L110,40 L140,30 L168,44 L186,62 L180,84
           L160,96 L150,116 L128,120 L104,110 L86,118 L64,108 L44,112 L28,96
           L34,76 L20,66 Z"
        fill={fill}
      />
    </svg>
  );
}

/** Versão "selo" combinando onda + silhueta — o ícone do casamento. */
export function RioSpEmblem({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={cn("h-auto w-full", className)} aria-hidden>
      <circle cx="60" cy="60" r="58" fill="none" stroke="#006994" strokeWidth="3" />
      {/* onda (Rio) na metade superior */}
      <path
        d="M16,52 C28,40 40,64 52,52 C64,40 76,64 88,52 C96,44 104,52 104,52"
        fill="none"
        stroke="#006994"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* silhueta SP simplificada na metade inferior */}
      <path
        d="M30,74 L44,68 L58,72 L74,66 L90,74 L84,86 L72,92 L58,88 L44,92 L34,84 Z"
        fill="#E8D5B0"
        stroke="#3A3A3A"
        strokeWidth="1.5"
      />
    </svg>
  );
}
