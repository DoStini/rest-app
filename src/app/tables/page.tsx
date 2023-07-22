import { Card } from "@/components/Cards";
import { TableController } from "@/controllers/TableControllers";
import { TableCardType } from "@/types/TableTypes";
import Link from "next/link";

export default async function TablesList() {
  const activeTables = await TableController.findActiveTables();

  return (
    <div className="grid w-full p-12 md:grid-cols-2 grid-cols-1 gap-4 md:gap-6">
      {activeTables.map((table) => (
        <TableCard
          key={table.name}
          id={table.id}
          name={table.name}
          active={table.active}
        />
      ))}
    </div>
  );
}

const TableCard = ({ name, id, active }: TableCardType) => {
  return (
    <Link
      className="flex flex-col w-full bg-primary shadow-md rounded-md hover:bg-accent transition"
      href={`/tables/${id}`}
    >
      <Card title={name} description={`${active} active accounts`} />
    </Link>
  );
};
