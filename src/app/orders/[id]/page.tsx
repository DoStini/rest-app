"use client";
import { OrderCard, ProductCard } from "@/components/Cards";
import CommonHeader from "@/components/orders/CommonHeader";
import Divider from "@/components/orders/Divider";
import { TableController } from "@/controllers/TableControllers";
import { jsonPost } from "@/helpers/api";
import ROUTES from "@/helpers/constants/Routes";
import { fetcher } from "@/helpers/fetcher";
import { redirectNotFound } from "@/helpers/router";
import { OrderType, TableSectionType } from "@/types/TableTypes";
import { FetcherOrderType, SwrOrderType } from "@/types/swrTypes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiArrowLeft, FiPlusCircle } from "react-icons/fi";
import useSWR, { useSWRConfig } from "swr";

export default function OrderPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const { id } = params;

  const { data, isLoading }: SwrOrderType = useSWR<FetcherOrderType>(
    ROUTES.API.ORDERS.BY_ID(id),
    fetcher
  );
  const { mutate } = useSWRConfig();
  const refresh = () => mutate(ROUTES.API.ORDERS.BY_ID(id));

  if (isLoading) {
    return <></>;
  }

  if (!data) {
    return redirectNotFound(router);
  }

  if (data.status === 404) {
    return redirectNotFound(router);
  }

  const order = data.data;

  return (
    <div className="text-textPrimary">
      <Header order={order} />
      <section className="my-2">
        <h4 className="font-bold">Responsável</h4>
        <p>{order.creator.username}</p>
      </section>
      <Divider />

      <ProductSection order={order} refresh={refresh}></ProductSection>
    </div>
  );
}

const Header = ({ order }: { order: OrderType }) => {
  return (
    <CommonHeader>
      <Link href={ROUTES.PAGES.ORDERS.ROOT} className="text-3xl">
        <FiArrowLeft />
      </Link>
      <h1 className="text-2xl text-textPrimary">{`${order.Table.name}, ${order.name}`}</h1>
    </CommonHeader>
  );
};

const ProductSection = ({
  order,
  refresh,
}: {
  order: OrderType;
  refresh: () => Promise<any>;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const onAmountChanged = (
    orderId: number,
    productId: number,
    amount: number
  ) =>
    jsonPost(ROUTES.API.ORDERS.UPDATE(orderId, productId), { amount }).then(
      () => refresh().then(() => setIsLoading(false))
    );

  return (
    <>
      <section className="my-2 flex justify-between items-center text-textPrimary">
        <h1 className="text-textPrimary text-xl">Produtos</h1>
        <Link href={ROUTES.PAGES.ORDERS.CREATE} className="text-3xl">
          <FiPlusCircle></FiPlusCircle>
        </Link>
      </section>

      <div className="grid-cols-1 divide-y divide-separator pt-2">
        {order.OrderProduct.map((orderProduct) => (
          <ProductCard
            key={`product${orderProduct.productId}-order${orderProduct.orderId}`}
            name={orderProduct.product.name}
            amount={orderProduct.amount}
            loading={isLoading}
            onChangeSave={(amount) => {
              setIsLoading(true);
              onAmountChanged(order.id, orderProduct.product.id, amount);
            }}
          ></ProductCard>
        ))}
      </div>
    </>
  );
};