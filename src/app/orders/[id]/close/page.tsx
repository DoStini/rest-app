import { Printer as PrinterService } from "@/app/services/Printer";
import Button from "@/components/Button";
import CommonHeader from "@/components/orders/CommonHeader";
import Divider from "@/components/orders/Divider";
import { TableController } from "@/controllers/TableControllers";
import ROUTES from "@/helpers/constants/Routes";
import { formatTime } from "@/helpers/time";
import { FinalOrderProductType, SimpleOrderType } from "@/types/TableTypes";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { UserProfile } from "@auth0/nextjs-auth0/client";

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { FiArrowLeft, FiPrinter } from "react-icons/fi";

// @ts-ignore
export default withPageAuthRequired(async function CloseOrderPage({
  params,
}: {
  params: { id: string };
}) {
  "use server";
  const { id: idRaw } = params;

  if (!idRaw) {
    redirect("/404");
  }

  const id = parseInt(idRaw);
  if (isNaN(id)) {
    redirect("/404");
  }

  const order = await TableController.generateOrder(id);

  const closeOrder = async (data: FormData) => {
    "use server";
    const orderId = parseInt(data.get("orderId")?.toString() || "");

    const order = await TableController.generateOrder(orderId);
    await TableController.closeOrder(orderId);
    await PrinterService.printOrder(order);
    redirect(ROUTES.PAGES.ORDERS.ROOT);
  };

  return (
    <div className="text-textPrimary">
      <Header order={order}></Header>
      <section className="my-2">
        <h4 className="font-bold">Responsável</h4>
        <p>{order.creator.name}</p>
      </section>
      <Divider />

      <section className="my-2">
        <h4 className="font-bold">Hora de Entrada</h4>
        <p>{formatTime(order.createdAt)}</p>
      </section>
      <Divider />

      <section className="my-2">
        <h4 className="font-bold">Hora de Fecho</h4>
        <p>{formatTime()}</p>
      </section>
      <Divider />

      <OrderSection
        total={order.total}
        orderProducts={order.finalProducts}
      ></OrderSection>

      <form>
        <input type="hidden" name="orderId" value={order.id} />
        <Button
          className="bg-warning text-textSecondary m-auto mt-10"
          text="Confirmar e imprimir conta"
          type="submit"
          preElement={<FiPrinter />}
          action={closeOrder}
        />
      </form>
    </div>
  );
});

const OrderSection = ({
  orderProducts,
  total,
}: {
  orderProducts: FinalOrderProductType[];
  total: string;
}) => {
  return (
    <section className="my-2">
      <h1 className="text-textPrimary text-xl">Produtos</h1>
      <div className="mt-3 flex flex-col font-light text-sm text-textSecondary">
        {orderProducts.map((product, index) => (
          <div key={product.id} className="w-full grid grid-cols-12 gap-2">
            <ProductLine product={product} />

            <div className="flex col-span-3 md:col-span-2 lg:col-span-1 justify-end items-center px-3 bg-primary text-xs border-b border-separator">
              {product.total} €
            </div>
          </div>
        ))}

        <div className="w-full grid grid-cols-12 gap-2">
          <div className="border-separator border-t font-bold text-right col-span-9 md:col-span-10 lg:col-span-11 py-2 px-3 bg-primary">
            Total
          </div>
          <div className="border-separator border-t flex col-span-3 md:col-span-2 lg:col-span-1 justify-end items-center px-3 bg-primary text-xs">
            {total} €
          </div>
        </div>
      </div>
    </section>
  );
};

const ProductLine = ({ product }: { product: FinalOrderProductType }) => {
  return (
    <div className="flex justify-between col-span-9 md:col-span-10 lg:col-span-11 py-2 px-3 bg-primary border-b border-separator">
      <div>{product.name}</div>
      <div className="text-xs flex justify-end items-center">
        {product.amount} x {product.price} €
      </div>
    </div>
  );
};

const Header = ({ order }: { order: SimpleOrderType }) => {
  return (
    <CommonHeader>
      <Link href={ROUTES.PAGES.ORDERS.BY_ID(order.id)} className="text-3xl">
        <FiArrowLeft />
      </Link>
      <h1 className="text-2xl text-textPrimary">{`${order.Table?.name}, ${order.name}`}</h1>
    </CommonHeader>
  );
};
