import { requireAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminDashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col bg-offwhite md:flex-row">
      <AdminNav email={user.email} />
      <main className="flex-1 overflow-x-hidden p-5 md:p-8">{children}</main>
    </div>
  );
}
