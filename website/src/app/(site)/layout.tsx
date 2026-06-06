import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>

      {/* Voltar ao início — fim de cada página */}
      <div className="container-page flex justify-center pb-4 pt-12">
        <Link
          href="#topo"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-urbano/60 transition hover:text-oceano"
        >
          <ArrowUp className="h-4 w-4" strokeWidth={1.5} /> Voltar ao início
        </Link>
      </div>

      <Footer />
      <BackToTop />
    </>
  );
}
