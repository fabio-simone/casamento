"use client";

import { useState } from "react";
import { Gift } from "lucide-react";
import type { GiftWithQuotas } from "@/lib/types";
import { formatBRL, objectPositionFromUrl } from "@/lib/utils";
import { GiftModal } from "./GiftModal";

export function GiftCard({ gift }: { gift: GiftWithQuotas }) {
  const [open, setOpen] = useState(false);

  const pagas = gift.gift_quotas.filter((q) => q.status === "paid").length;
  const total = gift.num_cotas;
  const pct = total > 0 ? Math.round((pagas / total) * 100) : 0;
  const esgotado = pagas >= total;
  const valorCota = gift.valor_total / gift.num_cotas;

  return (
    <>
      <div className="card flex flex-col">
        <div className="mb-4 flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-areia/40">
          {gift.foto_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={gift.foto_url}
              alt={gift.nome}
              className="h-full w-full object-cover"
              style={{ objectPosition: objectPositionFromUrl(gift.foto_url) }}
              loading="lazy"
            />
          ) : (
            <Gift className="h-12 w-12 text-oceano/40" strokeWidth={1.25} />
          )}
        </div>

        <h3 className="font-display text-lg font-bold text-urbano">{gift.nome}</h3>
        {gift.descricao && (
          <p className="mt-1 flex-1 text-sm text-urbano/60">{gift.descricao}</p>
        )}

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-oceano">{formatBRL(gift.valor_total)}</span>
            {total > 1 && (
              <span className="text-urbano/50">{formatBRL(valorCota)}/cota</span>
            )}
          </div>

          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-areia/60">
            <div
              className="h-full rounded-full bg-oceano transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-urbano/50">
            {pagas} de {total} cota{total > 1 ? "s" : ""} paga{pagas !== 1 ? "s" : ""}
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          disabled={esgotado}
          className="btn-primary mt-4 w-full disabled:cursor-not-allowed"
        >
          {esgotado ? "Presente completo 💙" : "Presentear"}
        </button>
      </div>

      {open && (
        <GiftModal
          gift={gift}
          pagas={pagas}
          valorCota={valorCota}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
