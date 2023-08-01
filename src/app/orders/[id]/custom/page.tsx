import Divider from "@/components/orders/Divider";
import CommonHeader from "@/components/orders/CommonHeader";
import { TableController } from "@/controllers/TableControllers";
import { UserController } from "@/controllers/UserController";
import { formatTime } from "@/helpers/time";
import { SimpleTableType } from "@/types/TableTypes";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FiArrowLeft, FiFolderPlus } from "react-icons/fi";
import Button from "@/components/Button";
import ROUTES from "@/helpers/constants/Routes";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { ProductsController } from "@/controllers/ProductsController";
import { round2 } from "@/helpers/math";
import Form from "@/components/Form";

export default withPageAuthRequired(
  async function AddCustomProduct({params}) {
    "use server";

    const idRaw = params?.id as string;
    if (!idRaw) {
      redirect("/404");
    }

    const id = parseInt(idRaw);
    if (isNaN(id)) {
      redirect("/404");
    }

    async function saveProduct(data: FormData) {
      "use server";

      const { id: idRaw, name: rawProductName, price: rawPrice } = Object.fromEntries(
        data.entries()
      );
      const id = parseInt(idRaw.toString());
      const price = round2(parseFloat(rawPrice.toString()));
      const name = rawProductName.toString();

      if (!id || !name || !price) {
        return;
      }

      const product = await ProductsController.createManualProduct(name, price);

      await TableController.updateOrder(id, product.id, 1);

      redirect(ROUTES.PAGES.ORDERS.ADD_BY_ID(id));
    }

    return (
      <Form
        action={saveProduct}
        className="text-textPrimary flex flex-col w-full"
      >
        <Header id={id} />
        <input type="hidden" name="id" value={id} />

        <section className="my-2">
          <h4 className="font-bold">Nome do produto</h4>
          <input
            name="name"
            type="text"
            required
            placeholder="Nome da conta..."
            className="w-full focus:outline-none"
          />
        </section>
        <Divider />

        <section className="my-2">
          <h4 className="font-bold">Preço do produto</h4>
          <input
            name="price"
            type="number"
            required
            placeholder="2.50"
            min="0.00"
            max="10000.00"
            step="0.01"
            className="w-full focus:outline-none"
          />
        </section>
        <Divider />

        <Button
          className="bg-tertiary text-textSecondary m-auto mt-5"
          type={"submit"}
          text={"Criar Produto"}
          preElement={<FiFolderPlus />}
        />
      </Form>
    );
  }
);

const Header = ({ id }: { id: number }) => {
  return (
    <CommonHeader>
      <Link href={ROUTES.PAGES.ORDERS.ADD_BY_ID(id)} className="text-3xl">
        <FiArrowLeft />
      </Link>
      <h1 className="text-2xl text-textPrimary">Produto Manual</h1>
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
