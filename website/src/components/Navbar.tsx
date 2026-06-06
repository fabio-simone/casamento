"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { RioSpEmblem } from "./SaoPauloSilhouette";

const links = [
  { href: "/", label: "Início" },
  { href: "/nossa-historia", label: "Nossa História" },
  { href: "/informacoes", label: "Informações" },
  { href: "/cronograma", label: "Cronograma" },
  { href: "/presentes", label: "Presentes" },
  { href: "/faq", label: "FAQ" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header id="topo" className="sticky top-0 z-50 border-b border-areia/60 bg-offwhite/90 backdrop-blur">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold text-urbano">
          <RioSpEmblem className="h-9 w-9" />
          <span>Kafamento</span>
        </Link>

        <ul className="hidden items-center gap-5 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.12em] transition hover:text-oceano",
                  pathname === l.href ? "text-oceano" : "text-urbano/70"
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/confirmar-presenca" className="btn-primary py-2">
              Confirmar presença
            </Link>
          </li>
        </ul>

        <button
          className="lg:hidden"
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
                    pathname === l.href ? "bg-oceano/10 text-oceano" : "text-urbano/80"
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
