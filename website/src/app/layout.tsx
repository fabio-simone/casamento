import type { Metadata } from "next";
import {
  Playfair_Display,
  Inter,
  Cormorant_Garamond,
  EB_Garamond,
  Marcellus,
  Tenor_Sans,
} from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { WEDDING } from "@/lib/constants";
import { getContent } from "@/lib/content";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-marcellus",
  display: "swap",
});

const tenor = Tenor_Sans({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-tenor",
  display: "swap",
});

const FONT_VARS = [
  playfair.variable,
  inter.variable,
  cormorant.variable,
  ebGaramond.variable,
  marcellus.variable,
  tenor.variable,
].join(" ");

export async function generateMetadata(): Promise<Metadata> {
  const { textos, hero_foto } = await getContent();
  // Imagem de compartilhamento (WhatsApp, etc.): a foto do casal, sem o
  // fragmento de ponto focal (#pos=...) que atrapalha alguns scrapers.
  const ogImage = hero_foto ? hero_foto.split("#")[0] : undefined;
  const imagens = ogImage
    ? [{ url: ogImage, alt: `${WEDDING.noivos} — Casamento` }]
    : undefined;

  return {
    metadataBase: new URL("https://kafamento.com.br"),
    title: {
      default: textos.seo_titulo,
      template: `%s · ${WEDDING.noivos}`,
    },
    description: textos.seo_descricao,
    openGraph: {
      title: textos.seo_titulo,
      description: textos.seo_descricao,
      type: "website",
      locale: "pt_BR",
      images: imagens,
    },
    twitter: {
      card: "summary_large_image",
      title: textos.seo_titulo,
      description: textos.seo_descricao,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={FONT_VARS}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
