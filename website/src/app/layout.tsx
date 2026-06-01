import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { WEDDING } from "@/lib/constants";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://kafamento.com.br"),
  title: {
    default: `${WEDDING.noivos} — Casamento`,
    template: `%s · ${WEDDING.noivos}`,
  },
  description: `O Rio encontra SP. ${WEDDING.noivos} vão se casar em ${WEDDING.dataExtenso}, em ${WEDDING.cidade}. Confirme presença e veja a lista de presentes.`,
  openGraph: {
    title: `${WEDDING.noivos} — Casamento`,
    description: "O Rio encontra SP. Confirme sua presença!",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
