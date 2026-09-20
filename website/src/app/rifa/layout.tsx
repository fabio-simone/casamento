import type { ReactNode } from "react";
import { getContent } from "@/lib/content";
import { paletaCss } from "@/lib/paletas";
import { fonteCss } from "@/lib/fontes";

export const dynamic = "force-dynamic";

export default async function RifaLayout({ children }: { children: ReactNode }) {
  const { paleta, paleta_custom, fonte } = await getContent();
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: paletaCss(paleta, paleta_custom) + fonteCss(fonte),
        }}
      />
      {children}
    </>
  );
}
