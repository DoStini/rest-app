import { Printer as PrinterService } from "@/app/services/Printer";
import Button from "@/components/Button";
import CommonHeader from "@/components/orders/CommonHeader";
import Divider from "@/components/orders/Divider";
import { DayController } from "@/controllers/DayController";
import { TableController } from "@/controllers/TableControllers";
import ROUTES from "@/helpers/constants/Routes";
import { formatDateWithTime, formatTime } from "@/helpers/time";
import { DayType } from "@/types/DayTypes";
import { FinalOrderProductType, SimpleOrderType } from "@/types/TableTypes";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { UserProfile } from "@auth0/nextjs-auth0/client";
import { revalidatePath } from "next/cache";

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { FiAlertTriangle, FiArrowLeft, FiPrinter } from "react-icons/fi";

export default withPageAuthRequired(async function CloseOrderPage({ params }) {
  "use server";
  const day = await DayController.currentDay();

  if (!day) {
    redirect(ROUTES.PAGES.DAY.CREATE);
  }
  const products = await TableController.findOrderProducts(day.id);

  const closeDay = async () => {
    "use server";
    const day = await DayController.currentDay();
    if (!day) {
      redirect(ROUTES.PAGES.DAY.CREATE);
    }
    const products = await TableController.findOrderProducts(day.id);

    await DayController.closeDay();
    await PrinterService.printDay(products, day);

    redirect(ROUTES.PAGES.DAY.CREATE);
  };

  return (
    <div className="text-textPrimary">
      <Header day={day} />

      <section className="my-2">
        <h4 className="font-bold">Nome</h4>
        <p>{day.name}</p>
      </section>
      <Divider />

      <section className="my-2">
        <h4 className="font-bold">Total</h4>
        <p>{day.total.toFixed(2)} €</p>
      </section>
      <Divider />

      <section className="my-2">
        <h4 className="font-bold">Hora de Entrada</h4>
        <p>{formatDateWithTime(day.createdAt)}</p>
      </section>
      <Divider />

      <section className="my-2">
        <h4 className="font-bold">Hora de Fecho</h4>
        <p>{formatDateWithTime()}</p>
      </section>
      <Divider />

      <OrderSection
        total={day.total.toFixed(2)}
        products={products}
      ></OrderSection>

      <form>
        <Button
          className="bg-warning text-textSecondary m-auto my-10"
          text="Fechar dia e imprimir"
          type="submit"
          preElement={<FiAlertTriangle />}
          action={closeDay}
        />
      </form>
    </div>
  );
});

const OrderSection = ({
  products,
  total,
}: {
  products: FinalOrderProductType[];
  total: string;
}) => {
  return (
    <section className="my-2">
      <h1 className="text-textPrimary text-xl">Produtos</h1>
      <div className="mt-3 flex flex-col font-light text-sm text-textSecondary">
        {products.map((product) => (
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

const Header = ({ day }: { day: DayType }) => {
  return (
    <CommonHeader>
      <Link href={ROUTES.PAGES.DAY.ROOT} className="text-3xl">
        <FiArrowLeft />
      </Link>
      <h1 className="text-2xl text-textPrimary">{day.name}</h1>
    </CommonHeader>
  );
};
