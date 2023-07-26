import Divider from "@/components/orders/Divider";
import CommonHeader from "@/components/orders/CommonHeader";
import { TableController } from "@/controllers/TableControllers";
import { formatTime } from "@/helpers/time";
import { SimpleTableType } from "@/types/TableTypes";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FiArrowLeft, FiFolderPlus } from "react-icons/fi";
import Button from "@/components/Button";
import ROUTES from "@/helpers/constants/Routes";

export default async function CreateOrder() {
  "use server";
  const tables = await TableController.listAllTables();

  async function saveOrder(data: FormData) {
    "use server";

    const { table: rawTable, name: rawName } = Object.fromEntries(
      data.entries()
    );
    const table = parseInt(rawTable.toString());
    const name = rawName.toString();
    await TableController.addOrder(name, table, 3);

    redirect(ROUTES.PAGES.ORDERS.ROOT);
  }

  return (
    <form className="text-textPrimary flex flex-col w-full">
      <Header />

      <section className="my-2">
        <h4 className="font-bold">Responsável</h4>
        <p>André</p> {/* Get from auth */}
      </section>
      <Divider />

      <section className="my-2">
        <h4 className="font-bold">Hora de Entrada</h4>
        <p>{formatTime()}</p>
      </section>
      <Divider />

      <TableInput tables={tables} />
      <Divider />

      <section className="my-2">
        <h4 className="font-bold">Nome da Conta</h4>
        <input
          name="name"
          type="text"
          required
          placeholder="Nome da conta..."
          className="w-full focus:outline-none"
        />
      </section>
      <Divider />

      <Button
        className="bg-tertiary text-textSecondary m-auto mt-5"
        type={"submit"}
        text={"Criar Nova Conta"}
        preElement={<FiFolderPlus />}
        action={saveOrder}
      />
    </form>
  );
}

const Header = () => {
  return (
    <CommonHeader>
      <Link href="/orders" className="text-3xl">
        <FiArrowLeft />
      </Link>
      <h1 className="text-2xl text-textPrimary">Nova conta</h1>
    </CommonHeader>
  );
};

const TableInput = ({ tables }: { tables: SimpleTableType[] }) => {
  return (
    <section className="my-2">
      <h4 className="font-bold">Mesa</h4>
      <div className="flex">
        <div className="flex flex-col">
          {tables.map((table) => (
            <div key={`root-${table.id}`} className="flex flex-row my-1">
              <input
                key={`radio-${table.id}`}
                required
                type="radio"
                name="table"
                className="accent-primary"
                value={table.id}
                id={`radio-${table.id}`}
              />
              <label
                key={`label-${table.id}`}
                htmlFor={`radio-${table.id}`}
                className="ml-2"
              >
                {table.name}
              </label>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
