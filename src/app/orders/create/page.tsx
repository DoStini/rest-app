import Divider from "@/components/orders/Divider";
import CommonHeader from "@/components/orders/CommonHeader";
import { TableController } from "@/controllers/TableControllers";
import { currentTime } from "@/helpers/time";
import { SimpleTableType } from "@/types/TableTypes";
import Link from "next/link";
import { FiArrowLeft, FiFolderPlus } from "react-icons/fi";
import Button from "@/components/Button";

export default async function CreateOrder() {
  const controller = new TableController();
  const tables = await controller.listAllTables();

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
        <p>{currentTime()}</p>
      </section>
      <Divider />

      <TableInput tables={tables} />
      <Divider />

      <section className="my-2">
        <h4 className="font-bold">Nome da Conta</h4>
        <input
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
        action={undefined}
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
