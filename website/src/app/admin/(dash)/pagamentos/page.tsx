import { getGiftOrders } from "@/lib/gifts";
import { OrdersTable } from "@/components/OrdersTable";

export const dynamic = "force-dynamic";

export default async function AdminPagamentosPage() {
  const orders = await getGiftOrders();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-urbano">Pedidos de presentes</h1>
      <p className="mt-1 text-urbano/60">
        Todos os pedidos — pagos, pendentes e falhos. Você pode apagar os não pagos.
      </p>
      <div className="mt-6">
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
}
