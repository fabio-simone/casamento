import { cn } from "@/lib/utils";

/**
 * Silhueta estilizada do estado de São Paulo — referência às calçadas
 * paulistanas. Versão flat: apenas contorno (stroke), sem preenchimento.
 */
export function SaoPauloSilhouette({
  className,
  stroke = "#3A3A3A",
}: {
  className?: string;
  stroke?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 140"
      className={cn(className)}
      fill="none"
      aria-hidden
    >
      <path
        d="M18,52 L40,40 L62,46 L84,34 L110,40 L140,30 L168,44 L186,62 L180,84
           L160,96 L150,116 L128,120 L104,110 L86,118 L64,108 L44,112 L28,96
           L34,76 L20,66 Z"
        stroke={stroke}
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Emblema do casamento: onda (Rio) + traço de SP, tudo em linha fina,
 * sem preenchimento nem sombra. Minimalista.
 */
export function RioSpEmblem({
  className,
  stroke = "#006994",
}: {
  className?: string;
  stroke?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={cn(className)}
      fill="none"
      aria-hidden
    >
      <circle cx="60" cy="60" r="54" stroke={stroke} strokeWidth="2.5" />
      {/* onda (Rio) */}
      <path
        d="M28,54 C38,44 48,64 58,54 C68,44 78,64 88,54"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* linha do horizonte / SP */}
      <path
        d="M32,74 L48,68 L62,72 L78,66 L90,74"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
