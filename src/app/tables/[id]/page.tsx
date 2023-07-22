import { Card } from "@/components/Cards";
import { TableController } from "@/controllers/TableControllers";
import { TableAccountType } from "@/types/TableTypes";
import { notFound } from "next/navigation";

const AccountCard = ({ name, id, owner }: TableAccountType) => {
  return <div className="flex flex-col w-full bg-primary shadow-md rounded-md hover:bg-accent transition">
      <Card title={name} description={`${owner} €`} />
  </div>
};

export default async function TablePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const table = await TableController.findTableById(id);

  if (!table) {
    return notFound();
  }

  return (
    <div className="grid w-full p-12 md:grid-cols-2 grid-cols-1 gap-4 md:gap-6">
      {table.accounts.map((table) => (
        <AccountCard
          key={table.name}
          id={table.id}
          name={table.name}
          owner={table.owner}
        />
      ))}
    </div>
  );
}
