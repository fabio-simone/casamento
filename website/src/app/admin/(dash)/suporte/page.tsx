import { createAdminClient } from "@/lib/supabase/admin";
import { formatDateSP } from "@/lib/utils";
import type { SupportMessage } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminSuportePage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("support_messages")
    .select("*")
    .order("created_at", { ascending: false });

  const msgs = (data ?? []) as SupportMessage[];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-urbano">Suporte</h1>
      <p className="mt-1 text-urbano/60">
        Problemas relatados pelos convidados (você também recebe cada um por e-mail).
      </p>

      <div className="mt-6 space-y-4">
        {msgs.map((m) => (
          <div key={m.id} className="card">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-full bg-oceano/10 px-3 py-1 text-xs font-medium text-oceano">
                {m.tipo}
              </span>
              <span className="text-xs text-urbano/50">{formatDateSP(m.created_at)}</span>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-urbano/90">{m.descricao}</p>
            {m.codigo_erro && (
              <p className="mt-2 rounded-lg bg-areia/30 px-3 py-2 font-mono text-xs text-urbano/70">
                {m.codigo_erro}
              </p>
            )}
            <p className="mt-3 text-sm font-medium text-urbano">
              {m.nome} ·{" "}
              <a href={`mailto:${m.email}`} className="text-oceano hover:underline">
                {m.email}
              </a>
            </p>
          </div>
        ))}
        {msgs.length === 0 && (
          <p className="py-10 text-center text-urbano/50">
            Nenhum problema relatado até agora. 🎉
          </p>
        )}
      </div>
    </div>
  );
}
