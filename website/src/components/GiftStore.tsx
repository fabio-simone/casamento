"use client";

import { useEffect, useMemo, useState } from "react";
import { Gift, Plus, Minus, ShoppingCart, X } from "lucide-react";
import type { Gift as GiftType } from "@/lib/types";
import { formatBRL, objectPositionFromUrl } from "@/lib/utils";
import { useTextos } from "@/lib/textos-context";

const STORAGE_KEY = "kafamento_carrinho_v1";

export function GiftStore({
  gifts,
  status,
}: {
  gifts: GiftType[];
  status?: string;
}) {
  const t = useTextos();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [aberto, setAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [carregado, setCarregado] = useState(false);
  const [retomado, setRetomado] = useState(false);

  // Restaura o carrinho salvo (sobrevive a ir/voltar do Mercado Pago).
  useEffect(() => {
    if (status === "sucesso") {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
      setCarregado(true);
      return;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s?.cart && Object.keys(s.cart).length > 0) {
          setCart(s.cart);
          setNome(s.nome || "");
          setEmail(s.email || "");
          setMensagem(s.mensagem || "");
          setRetomado(true);
        }
      }
    } catch {
      /* ignore */
    }
    setCarregado(true);
  }, [status]);

  // Persiste o carrinho a cada mudança (só após o carregamento inicial).
  useEffect(() => {
    if (!carregado) return;
    try {
      if (Object.keys(cart).length === 0) localStorage.removeItem(STORAGE_KEY);
      else
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ cart, nome, email, mensagem })
        );
    } catch {
      /* ignore */
    }
  }, [carregado, cart, nome, email, mensagem]);

  function add(id: string) {
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  }
  function dec(id: string) {
    setCart((c) => {
      const q = (c[id] ?? 0) - 1;
      const novo = { ...c };
      if (q <= 0) delete novo[id];
      else novo[id] = q;
      return novo;
    });
  }

  const itensCarrinho = useMemo(
    () => gifts.filter((g) => (cart[g.id] ?? 0) > 0),
    [gifts, cart]
  );
  const totalItens = useMemo(
    () => Object.values(cart).reduce((a, b) => a + b, 0),
    [cart]
  );
  const totalValor = useMemo(
    () => itensCarrinho.reduce((a, g) => a + g.valor_total * (cart[g.id] ?? 0), 0),
    [itensCarrinho, cart]
  );

  async function finalizar(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro("");
    try {
      const itens = itensCarrinho.map((g) => ({
        gift_id: g.id,
        quantidade: cart[g.id] ?? 0,
      }));
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itens,
          pagador_nome: nome,
          pagador_email: email,
          mensagem,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.init_point) {
        throw new Error(data.error ?? "Não foi possível iniciar o pagamento.");
      }
      window.location.href = data.init_point;
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro inesperado.");
      setLoading(false);
    }
  }

  if (gifts.length === 0) {
    return (
      <p className="py-20 text-center text-offwhite/60">
        A lista de presentes ainda está sendo preparada. Volte em breve! 🎁
      </p>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {gifts.map((g) => {
          const qtd = cart[g.id] ?? 0;
          return (
            <div key={g.id} className="card flex flex-col">
              <div className="mb-4 flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-areia/40">
                {g.foto_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={g.foto_url}
                    alt={g.nome}
                    className="h-full w-full object-cover"
                    style={{ objectPosition: objectPositionFromUrl(g.foto_url) }}
                    loading="lazy"
                  />
                ) : (
                  <Gift className="h-12 w-12 text-oceano/40" strokeWidth={1.25} />
                )}
              </div>

              <h3 className="font-display text-lg font-bold text-urbano">{g.nome}</h3>
              {g.descricao && (
                <p className="mt-1 flex-1 text-sm text-urbano/60">{g.descricao}</p>
              )}

              <p className="mt-3 text-lg font-semibold text-oceano">
                {formatBRL(g.valor_total)}
              </p>

              {qtd === 0 ? (
                <button
                  onClick={() => add(g.id)}
                  className="btn-primary mt-3 w-full"
                >
                  {t.gift_btn_presentear}
                </button>
              ) : (
                <div className="mt-3 flex items-center justify-between rounded-full border border-oceano/30 bg-oceano/5 p-1">
                  <button
                    type="button"
                    onClick={() => dec(g.id)}
                    aria-label="Diminuir"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-oceano shadow-sm transition hover:bg-oceano hover:text-white"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-semibold text-urbano">
                    {qtd} no carrinho
                  </span>
                  <button
                    type="button"
                    onClick={() => add(g.id)}
                    aria-label="Aumentar"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-oceano shadow-sm transition hover:bg-oceano hover:text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Barra flutuante do carrinho */}
      {totalItens > 0 && !aberto && (
        <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4">
          <button
            onClick={() => setAberto(true)}
            className="mx-auto flex w-full max-w-md items-center justify-between gap-4 rounded-full bg-oceano px-6 py-4 text-offwhite shadow-2xl transition hover:bg-oceano/90"
          >
            <span className="flex items-center gap-2 text-sm font-semibold">
              <ShoppingCart className="h-5 w-5" />
              {totalItens} {totalItens === 1 ? "item" : "itens"}
            </span>
            <span className="text-sm font-semibold">{formatBRL(totalValor)}</span>
            <span className="rounded-full bg-white/20 px-4 py-1.5 text-sm font-bold">
              Finalizar
            </span>
          </button>
        </div>
      )}

      {/* Modal de checkout */}
      {aberto && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-urbano/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => !loading && setAberto(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={finalizar}
            className="max-h-[92vh] w-full max-w-md space-y-3 overflow-y-auto rounded-t-3xl bg-offwhite p-6 shadow-2xl sm:rounded-3xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl font-bold text-urbano">Seu carrinho</h3>
              <button
                type="button"
                onClick={() => !loading && setAberto(false)}
                aria-label="Fechar"
                className="text-urbano/50 hover:text-urbano"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-2xl border border-areia bg-white p-3">
              {itensCarrinho.map((g) => (
                <div
                  key={g.id}
                  className="flex items-center justify-between gap-2 border-b border-areia/50 py-2 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => dec(g.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-areia text-urbano/70 hover:bg-areia/40"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{cart[g.id]}</span>
                    <button
                      type="button"
                      onClick={() => add(g.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-areia text-urbano/70 hover:bg-areia/40"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <span className="ml-1 text-sm text-urbano">{g.nome}</span>
                  </div>
                  <span className="text-sm font-medium text-oceano">
                    {formatBRL(g.valor_total * (cart[g.id] ?? 0))}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 text-sm font-bold text-urbano">
                <span>Total</span>
                <span>{formatBRL(totalValor)}</span>
              </div>
            </div>

            <input
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder={t.gift_ph_nome}
              className="w-full rounded-xl border border-areia px-4 py-3 text-sm text-urbano placeholder:text-urbano/40 outline-none focus:border-oceano"
            />
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.gift_ph_email}
              className="w-full rounded-xl border border-areia px-4 py-3 text-sm text-urbano placeholder:text-urbano/40 outline-none focus:border-oceano"
            />
            <textarea
              rows={2}
              maxLength={500}
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder={t.gift_ph_mensagem}
              className="w-full rounded-xl border border-areia px-4 py-3 text-sm text-urbano placeholder:text-urbano/40 outline-none focus:border-oceano"
            />

            {erro && (
              <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{erro}</p>
            )}

            <button
              type="submit"
              disabled={loading || totalItens === 0}
              className="btn-primary w-full"
            >
              {loading ? "Redirecionando..." : `${t.gift_btn_pagar} ${formatBRL(totalValor)}`}
            </button>
            <p className="text-center text-xs text-urbano/50">
              Pagamento seguro via Mercado Pago (cartão, Pix ou boleto).
            </p>
          </form>
        </div>
      )}
    </>
  );
}
