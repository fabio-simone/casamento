"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Copy, Check, Wine, RefreshCw, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBRL } from "@/lib/utils";
import { getMensagemFaixa, type RifaConfig } from "@/lib/rifa";
import type { RifaNumero } from "@/lib/types";
import { RioSpEmblem } from "./SaoPauloSilhouette";
import { RifaConfetti } from "./RifaConfetti";

type Fase = "grid" | "checkout" | "pix" | "pago" | "expirado";

interface PixData {
  payment_id: string | number;
  external_reference: string;
  qr_code: string;
  qr_code_base64: string;
  total: number;
  numeros: number[];
  expira_em: string;
}

function formatCountdown(ms: number): string {
  const secs = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function maskWhatsapp(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  return d;
}

export function RifaPage({
  config,
  numerosIniciais,
}: {
  config: RifaConfig;
  numerosIniciais: RifaNumero[];
}) {
  const [fase, setFase] = useState<Fase>("grid");
  const [numeros, setNumeros] = useState<RifaNumero[]>(numerosIniciais);
  const [selecionados, setSelecionados] = useState<Set<number>>(new Set());
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [valor, setValor] = useState("");
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(0);
  const [nomeComprador, setNomeComprador] = useState("");

  const pollingRef = useRef<ReturnType<typeof setInterval>>();
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const loadNumeros = useCallback(async () => {
    try {
      const r = await fetch("/api/rifa/numeros");
      const d = await r.json();
      const lista: RifaNumero[] = d.numeros ?? [];
      if (lista.length > 0) setNumeros(lista);
    } catch {}
  }, []);

  useEffect(() => {
    if (fase !== "grid" && fase !== "checkout") return;
    const id = setInterval(loadNumeros, 30_000);
    return () => clearInterval(id);
  }, [fase, loadNumeros]);

  useEffect(() => {
    if (fase !== "pix" || !pixData) return;
    pollingRef.current = setInterval(async () => {
      try {
        const r = await fetch(`/api/rifa/status?ref=${pixData.external_reference}`);
        const d = await r.json();
        if (d.status === "pago") {
          clearInterval(pollingRef.current);
          clearInterval(timerRef.current);
          setFase("pago");
          loadNumeros();
        } else if (d.status === "expirado") {
          clearInterval(pollingRef.current);
          clearInterval(timerRef.current);
          setFase("expirado");
          loadNumeros();
        }
      } catch {}
    }, 3_000);
    return () => clearInterval(pollingRef.current);
  }, [fase, pixData, loadNumeros]);

  useEffect(() => {
    if (fase !== "pix" || !pixData) return;
    const update = () => {
      const rem = new Date(pixData.expira_em).getTime() - Date.now();
      setTempoRestante(Math.max(0, rem));
      if (rem <= 0) {
        clearInterval(timerRef.current);
        setFase("expirado");
      }
    };
    update();
    timerRef.current = setInterval(update, 1_000);
    return () => clearInterval(timerRef.current);
  }, [fase, pixData]);

  const MAX_NUMEROS = 4;

  function toggleNumero(n: number) {
    const num = numeros.find((x) => x.numero === n);
    if (!num || num.status !== "disponivel") return;
    setSelecionados((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else if (next.size < MAX_NUMEROS) next.add(n);
      return next;
    });
  }

  async function handleReservar(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro("");
    try {
      const r = await fetch("/api/rifa/reservar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numeros: [...selecionados],
          nome,
          whatsapp,
          valor_por_numero: Number(valor.replace(",", ".")) || 1,
        }),
      });
      const d = await r.json();
      if (!r.ok || d.error) throw new Error(d.error || "Erro ao criar reserva.");
      setNomeComprador(nome);
      setPixData(d);
      setFase("pix");
      loadNumeros();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  async function copiarPix() {
    if (!pixData?.qr_code) return;
    try {
      await navigator.clipboard.writeText(pixData.qr_code);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3_000);
    } catch {}
  }

  function voltarParaGrid() {
    setFase("grid");
    setSelecionados(new Set());
    setNome("");
    setWhatsapp("");
    setValor("");
    setPixData(null);
    setErro("");
    loadNumeros();
  }

  const pagos = numeros.filter((n) => n.status === "pago").length;
  const reservados = numeros.filter((n) => n.status === "reservado").length;
  const disponiveis = config.total_numeros - pagos - reservados;
  const valorNum = Number(valor.replace(",", ".")) || 0;
  const mensagem = getMensagemFaixa(valorNum, config.faixas);
  const totalPagar = valorNum * selecionados.size;

  // SVG ring metrics
  const R = 40;
  const circ = 2 * Math.PI * R;
  const sold = circ * (pagos / config.total_numeros);

  return (
    <div className="min-h-screen bg-oceanoDark font-sans text-offwhite">
      {fase === "pago" && <RifaConfetti />}

      {/* Header */}
      <header className="px-4 pb-6 pt-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
          <RioSpEmblem className="h-12 w-12" stroke="rgb(var(--color-laranja))" />
        </div>
        <h1 className="font-display text-3xl font-bold text-offwhite sm:text-4xl">
          {config.titulo}
        </h1>
        <div className="mx-auto mt-3 max-w-sm">
          <div className="flex items-start justify-center gap-2 rounded-2xl border border-laranja/30 bg-laranja/10 px-4 py-3">
            <Wine className="mt-0.5 h-5 w-5 shrink-0 text-laranja" strokeWidth={1.5} />
            <p className="text-sm leading-snug text-offwhite/90">{config.descricao_premio}</p>
          </div>
        </div>
      </header>

      {/* Stats ring */}
      <div className="flex items-center justify-center gap-8 px-4 pb-6">
        <svg width="100" height="100" viewBox="0 0 100 100" className="shrink-0">
          <circle cx="50" cy="50" r={R} fill="none" stroke="rgb(var(--color-offwhite) / 0.1)" strokeWidth="10" />
          <circle
            cx="50" cy="50" r={R} fill="none"
            stroke="rgb(var(--color-laranja))"
            strokeWidth="10"
            strokeDasharray={`${sold} ${circ}`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            className="transition-all duration-700"
          />
          <text x="50" y="46" textAnchor="middle" fill="rgb(var(--color-offwhite))" fontSize="18" fontWeight="700">{pagos}</text>
          <text x="50" y="62" textAnchor="middle" fill="rgb(var(--color-offwhite) / 0.5)" fontSize="11">de {config.total_numeros}</text>
        </svg>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-laranja" />
            <span className="text-sm text-offwhite/80">{pagos} número{pagos !== 1 ? "s" : ""} vendido{pagos !== 1 ? "s" : ""}</span>
          </div>
          {reservados > 0 && (
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-white/30" />
              <span className="text-sm text-offwhite/60">{reservados} reservado{reservados !== 1 ? "s" : ""}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full border border-white/30" />
            <span className="text-sm text-offwhite/80">{disponiveis} disponíve{disponiveis !== 1 ? "is" : "l"}</span>
          </div>
        </div>
      </div>

      {/* Grid — always visible */}
      <div className="px-4 pb-32">
        <p className="mb-4 text-center text-sm text-offwhite/60">{config.descricao_rifa}</p>
        <div className="mx-auto grid max-w-lg grid-cols-10 gap-1.5 sm:gap-2">
          {numeros.map((n) => {
            const sel = selecionados.has(n.numero);
            return (
              <button
                key={n.numero}
                onClick={() => toggleNumero(n.numero)}
                disabled={n.status !== "disponivel"}
                title={n.status === "pago" ? (n.comprador_nome ?? "Vendido") : n.status === "reservado" ? "Reservado" : `Número ${n.numero}`}
                className={cn(
                  "relative flex aspect-square w-full items-center justify-center rounded-lg transition-all duration-150",
                  n.status === "pago"
                    ? "cursor-default bg-oceano/30 ring-1 ring-oceano/50"
                    : n.status === "reservado"
                    ? "cursor-not-allowed bg-white/5 text-offwhite/20 ring-1 ring-white/10"
                    : sel
                    ? "scale-110 bg-laranja text-white shadow-lg shadow-laranja/30 ring-2 ring-laranja"
                    : "bg-white/10 text-offwhite hover:bg-laranja/20 hover:ring-1 hover:ring-laranja/50 active:scale-95"
                )}
              >
                {n.status === "pago" && n.comprador_nome ? (
                  <>
                    <span className="absolute right-0.5 top-0.5 text-[7px] font-semibold leading-none text-laranja/70">
                      {n.numero}
                    </span>
                    <span className="w-full px-0.5 text-center text-[8px] font-bold leading-tight text-offwhite [overflow-wrap:break-word]">
                      {n.comprador_nome}
                    </span>
                  </>
                ) : (
                  <span className={cn("text-xs font-bold", n.status === "pago" && "text-offwhite/90")}>
                    {n.numero}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sticky bottom bar — shown when numbers selected */}
      {selecionados.size > 0 && fase === "grid" && (
        <div className="fixed inset-x-0 bottom-0 border-t border-white/10 bg-oceanoDark/95 px-4 py-4 backdrop-blur-sm">
          <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-offwhite">
                {selecionados.size} número{selecionados.size !== 1 ? "s" : ""} selecionado{selecionados.size !== 1 ? "s" : ""}
                {selecionados.size >= MAX_NUMEROS && (
                  <span className="ml-2 text-xs font-normal text-laranja">limite atingido</span>
                )}
              </p>
              <p className="text-xs text-offwhite/60">
                {[...selecionados].sort((a, b) => a - b).join(", ")}
              </p>
            </div>
            <button
              onClick={() => setFase("checkout")}
              className="flex items-center gap-1 rounded-xl bg-laranja px-5 py-3 text-sm font-bold text-white shadow-lg shadow-laranja/30 transition hover:bg-laranja/90 active:scale-95"
            >
              Comprar <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Checkout sheet */}
      {fase === "checkout" && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setFase("grid")} />
          <div className="relative z-10 w-full max-w-lg rounded-t-3xl bg-oceanoDark p-6 sm:rounded-3xl sm:shadow-2xl">
            <button
              onClick={() => setFase("grid")}
              className="absolute right-4 top-4 rounded-full p-1 text-offwhite/50 hover:text-offwhite"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="font-display text-xl font-bold text-offwhite">Finalizar compra</h2>
            <p className="mt-1 text-sm text-offwhite/60">
              Números: <span className="text-laranja font-semibold">{[...selecionados].sort((a, b) => a - b).join(", ")}</span>
            </p>

            <form onSubmit={handleReservar} className="mt-5 space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-offwhite placeholder-offwhite/40 outline-none focus:border-laranja/70 focus:ring-1 focus:ring-laranja/40"
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="WhatsApp (com DDD)"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(maskWhatsapp(e.target.value))}
                  required
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-offwhite placeholder-offwhite/40 outline-none focus:border-laranja/70 focus:ring-1 focus:ring-laranja/40"
                />
              </div>
              <div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-offwhite/60">R$</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder="Valor por número"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    min="1"
                    step="1"
                    required
                    className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-9 pr-4 text-sm text-offwhite placeholder-offwhite/40 outline-none focus:border-laranja/70 focus:ring-1 focus:ring-laranja/40"
                  />
                </div>
                {mensagem && (
                  <p key={mensagem} className="animate-fade-up mt-2 text-center text-sm font-medium text-laranja">
                    {mensagem}
                  </p>
                )}
              </div>

              {totalPagar > 0 && (
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-offwhite/70">{selecionados.size} × {formatBRL(valorNum)}</span>
                    <span className="text-lg font-bold text-laranja">{formatBRL(totalPagar)}</span>
                  </div>
                  <p className="mt-1 text-xs text-offwhite/40">Pagamento via PIX — gerado em segundos</p>
                </div>
              )}

              {erro && (
                <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">{erro}</p>
              )}

              <button
                type="submit"
                disabled={loading || !nome || !whatsapp || !valor || valorNum < 1}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-laranja py-4 text-sm font-bold text-white shadow-lg shadow-laranja/30 transition hover:bg-laranja/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <><RefreshCw className="h-4 w-4 animate-spin" /> Gerando PIX...</>
                ) : (
                  <>Gerar QR Code PIX</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PIX QR code screen */}
      {fase === "pix" && pixData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-oceanoDark p-4">
          <div className="w-full max-w-sm py-8">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-laranja/20">
                <Wine className="h-7 w-7 text-laranja" strokeWidth={1.5} />
              </div>
              <h2 className="font-display text-2xl font-bold text-offwhite">Pague via PIX</h2>
              <p className="mt-1 text-sm text-offwhite/60">
                Números {pixData.numeros.join(", ")} · <span className="font-semibold text-laranja">{formatBRL(pixData.total)}</span>
              </p>
            </div>

            {/* Countdown */}
            <div className="mb-4 flex items-center justify-center gap-2">
              <span className="text-xs text-offwhite/50">Expira em</span>
              <span className={cn(
                "font-mono text-lg font-bold",
                tempoRestante < 120_000 ? "text-red-400" : "text-laranja"
              )}>
                {formatCountdown(tempoRestante)}
              </span>
            </div>

            {/* QR code image */}
            {pixData.qr_code_base64 && (
              <div className="mx-auto mb-4 w-56 rounded-2xl bg-white p-3">
                <img
                  src={`data:image/png;base64,${pixData.qr_code_base64}`}
                  alt="QR Code PIX"
                  className="w-full"
                />
              </div>
            )}

            {/* Copy key */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="mb-2 text-xs text-offwhite/50">Pix copia e cola</p>
              <p className="mb-3 break-all text-xs text-offwhite/70 leading-relaxed">{pixData.qr_code.slice(0, 80)}…</p>
              <button
                onClick={copiarPix}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition",
                  copiado
                    ? "bg-green-500/20 text-green-400"
                    : "bg-laranja text-white hover:bg-laranja/90"
                )}
              >
                {copiado ? <><Check className="h-4 w-4" /> Copiado!</> : <><Copy className="h-4 w-4" /> Copiar código PIX</>}
              </button>
            </div>

            <p className="mt-4 text-center text-xs text-offwhite/40">
              Após o pagamento, a confirmação é automática. Não feche esta tela.
            </p>
          </div>
        </div>
      )}

      {/* Success screen */}
      {fase === "pago" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-oceanoDark/95 p-4 text-center">
          <div className="max-w-sm">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-laranja/20 ring-4 ring-laranja/30">
              <Wine className="h-10 w-10 text-laranja" strokeWidth={1.5} />
            </div>
            <h2 className="font-display text-3xl font-bold text-offwhite">Pagamento confirmado!</h2>
            <p className="mt-3 text-offwhite/70">
              {nomeComprador ? `Obrigado, ${nomeComprador.split(" ")[0]}! ` : ""}Seus números{" "}
              <span className="font-bold text-laranja">
                {pixData?.numeros.join(", ")}
              </span>{" "}
              estão confirmados. Boa sorte na rifa! 🍷
            </p>
            <button
              onClick={voltarParaGrid}
              className="mt-8 rounded-xl bg-laranja px-8 py-3 text-sm font-bold text-white transition hover:bg-laranja/90"
            >
              Ver todos os números
            </button>
          </div>
        </div>
      )}

      {/* Expired screen */}
      {fase === "expirado" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-oceanoDark/95 p-4 text-center">
          <div className="max-w-sm">
            <p className="mb-2 text-5xl">⏰</p>
            <h2 className="font-display text-2xl font-bold text-offwhite">Reserva expirada</h2>
            <p className="mt-3 text-offwhite/70">
              O tempo de 15 minutos esgotou sem confirmação do pagamento. Os números voltaram para o estoque.
            </p>
            <button
              onClick={voltarParaGrid}
              className="mt-8 rounded-xl bg-white/10 px-8 py-3 text-sm font-semibold text-offwhite transition hover:bg-white/20"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
