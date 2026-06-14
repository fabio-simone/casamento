"use client";

import { createContext, useContext } from "react";
import type { TextosContent } from "./content";

const TextosContext = createContext<TextosContent | null>(null);

/** Disponibiliza os textos editáveis para componentes client (formulários, cards). */
export function TextosProvider({
  value,
  children,
}: {
  value: TextosContent;
  children: React.ReactNode;
}) {
  return <TextosContext.Provider value={value}>{children}</TextosContext.Provider>;
}

export function useTextos(): TextosContent {
  const ctx = useContext(TextosContext);
  if (!ctx) {
    throw new Error("useTextos precisa estar dentro de <TextosProvider>");
  }
  return ctx;
}
