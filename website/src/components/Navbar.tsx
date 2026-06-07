"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { RioSpEmblem } from "./SaoPauloSilhouette";

const links = [
  { href: "/", label: "Início" },
  { href: "/nossa-historia", label: "Nossa História" },
  { href: "/informacoes", label: "Informações" },
  { href: "/cronograma", label: "Cronograma" },
  { href: "/galeria", label: "Galeria" },
  { href: "/presentes", label: "Presentes" },
  { href: "/faq", label: "FAQ" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Navbar flutuante: transparente no topo, sólida ao rolar.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      id="topo"
      className={cn(
        "fixed top-0 z-50 w-full transition-colors duration-300",
        solid
          ? "border-b border-areia/50 bg-offwhite/90 backdrop-blur"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="container-page flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl font-semibold text-urbano"
        >
          <RioSpEmblem className="h-9 w-9" />
          <span>kafamento</span>
        </Link>

        <ul className="hidden items-center gap-4 lg:flex xl:gap-5">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  "text-[11px] font-semibold uppercase tracking-[0.1em] transition hover:text-laranja xl:text-xs",
                  pathname === l.href ? "text-laranja" : "text-urbano/80"
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/confirmar-presenca" className="btn-primary py-2 text-xs">
              Confirmar presença
            </Link>
          </li>
        </ul>

        <button
          className="text-urbano lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-areia/60 bg-offwhite lg:hidden">
          <ul className="container-page flex flex-col gap-1 py-3">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm font-medium",
                    pathname === l.href ? "bg-laranja/10 text-laranja" : "text-urbano/80"
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/confirmar-presenca"
                onClick={() => setOpen(false)}
                className="btn-primary w-full"
              >
                Confirmar presença
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
