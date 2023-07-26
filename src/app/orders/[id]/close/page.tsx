import CommonHeader from "@/components/orders/CommonHeader";
import Divider from "@/components/orders/Divider";
import { TableController } from "@/controllers/TableControllers";
import ROUTES from "@/helpers/constants/Routes";
import { formatTime } from "@/helpers/time";
import { ProductOrderType } from "@/types/ProductTypes";
import {
  FinalOrderProductType,
  FinalOrderType,
  SimpleOrderType,
} from "@/types/TableTypes";

import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

export default async function CloseOrderPage({
  params,
}: {
  params: { id: string };
}) {
  const { id: idRaw } = params;

  if (!idRaw) {
    return notFound();
  }

  const id = parseInt(idRaw);
  if (isNaN(id)) {
    return notFound();
  }

  const order = await TableController.generateOrder(id);

  return (
    <div className="text-textPrimary">
      <Header order={order}></Header>
      <section className="my-2">
        <h4 className="font-bold">Responsável</h4>
        <p>{order.creator.username}</p>
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

      <OrderSection orderProducts={order.finalProducts}></OrderSection>
    </div>
  );
}

const OrderSection = ({
  orderProducts,
}: {
  orderProducts: FinalOrderProductType[];
}) => {
  return (
    <section className="my-2 ">
      <h1 className="text-textPrimary text-xl">Produtos</h1>
      <div className="flex flex-col font-light text-sm text-textSecondary">
        {orderProducts.map((product, index) => (
          <div key={product.id} className="w-full grid grid-cols-12 gap-2">
            <ProductLine
              product={product}
              index={index}
              orderProducts={orderProducts}
            />

            <div
              className={`flex col-span-3 md:col-span-2 lg:col-span-1 justify-end items-center px-3 bg-primary text-xs ${
                index < orderProducts.length - 1 && "border-b border-separator"
              }`}
            >
              {product.total} €
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const ProductLine = ({
  product,
  index,
  orderProducts,
}: {
  product: FinalOrderProductType;
  index: number;
  orderProducts: FinalOrderProductType[];
}) => {
  return (
    <div
      className={`flex justify-between col-span-9 md:col-span-10 lg:col-span-11 py-2 px-3 bg-primary ${
        index < orderProducts.length - 1 && "border-b border-separator"
      }`}
    >
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
