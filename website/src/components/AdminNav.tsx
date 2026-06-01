"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/rsvps", label: "Confirmações", icon: "✅" },
  { href: "/admin/presentes", label: "Presentes", icon: "🎁" },
  { href: "/admin/pagamentos", label: "Pagamentos", icon: "💳" },
];

export function AdminNav({ email }: { email?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-full flex-row gap-1 border-b border-areia bg-white p-3 md:h-screen md:w-60 md:flex-col md:border-b-0 md:border-r md:p-4">
      <div className="hidden md:mb-6 md:block">
        <h2 className="font-display text-xl font-bold text-urbano">Kafamento</h2>
        <p className="truncate text-xs text-urbano/50">{email}</p>
      </div>

      <nav className="flex flex-1 flex-row gap-1 overflow-x-auto md:flex-col">
        {items.map((it) => {
          const active = pathname === it.href;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition",
                active ? "bg-oceano text-white" : "text-urbano/70 hover:bg-oceano/10"
              )}
            >
              <span>{it.icon}</span>
              <span>{it.label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={logout}
        className="rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        Sair
      </button>
    </aside>
  );
}
