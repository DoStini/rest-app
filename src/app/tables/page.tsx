import { Card, OrderCard } from "@/components/Cards";
import { TableController } from "@/controllers/TableControllers";
import { TableSectionType } from "@/types/TableTypes";

export default async function TablesList() {
  const controller = new TableController();
  const activeTables = await controller.findActiveTables();

  return (
    <div className="w-full p-12">
      {activeTables.map((table) => (
        <TableSection
          key={table.name}
          name={table.name}
          orders={table.orders}
          ordersCount={table._count.orders}
        />
      ))}
    </div>
  );
}

const TableSection = ({ name, orders, ordersCount }: TableSectionType) => {
  return (
    <div>
      <h1 className="text-black mt-4 mb-2 text-xl">{name}</h1>

      {ordersCount === 0 ? (
        <h4>No accounts found</h4>
      ) : (
        orders.map((order) => (
          <OrderCard key={order.id} title={order.name} description={order.creator.username}></OrderCard>
        ))
      )}
    </div>
  );
};
