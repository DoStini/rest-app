"use client";
import { openOrder, printOrder, requestOrder } from "@/actions/orders";
import Button from "@/components/Button";
import { ProductCardType } from "@/components/Cards";
import CounterInput from "@/components/CounterInput";
import FormCounterInput from "@/components/FormCounterInput";
import LinkButton from "@/components/LinkButton";
import CommonHeader from "@/components/orders/CommonHeader";
import Divider from "@/components/orders/Divider";
import { REFRESH_INTERVAL } from "@/helpers/api";
import ROUTES from "@/helpers/constants/Routes";
import { fetcher } from "@/helpers/fetcher";
import { redirectLogin, redirectNotFound } from "@/helpers/router";
import { OrderType, TableSectionType } from "@/types/TableTypes";
import { FetcherOrderType, SwrOrderType } from "@/types/swrTypes";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiFolderPlus,
  FiPlusCircle,
  FiPrinter,
  FiShoppingCart,
} from "react-icons/fi";
import useSWR, { useSWRConfig } from "swr";

export default withPageAuthRequired(function OrderPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  const { id } = params;

  const { data, isLoading, error }: SwrOrderType = useSWR<FetcherOrderType>(
    ROUTES.API.ORDERS.BY_ID(id),
    fetcher,
    { refreshInterval: REFRESH_INTERVAL }
  );
  const { mutate } = useSWRConfig();
  const refresh = () => mutate(ROUTES.API.ORDERS.BY_ID(id));

  if (error?.status === 401) {
    redirectLogin(router);
    return <></>;
  }

  if (error?.status === 404) {
    redirectNotFound(router);
    return <></>;
  }

  if (isLoading || !data) {
    return <></>;
  }

  const order = data.data;

  console.log(order);

  return (
    <div className="text-textPrimary h-full flex flex-col">
      <form action={requestOrder}>
        <Header order={order} />
        <section className="my-2">
          <h4 className="font-bold">Responsável</h4>
          <p>{order.creator.name}</p>
        </section>
        <Divider />

        <ProductSection order={order} refresh={refresh}></ProductSection>

        <input type="hidden" name="orderId" value={order.id} />
        <Button
          type="submit"
          className="bg-tertiary text-textSecondary m-auto mt-10"
          text="Imprimir pedido"
          preElement={<FiPrinter />}
        ></Button>
      </form>
    </div>
  );
});

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
  return (
    <>
      <section className="my-2 flex justify-between items-center text-textPrimary">
        <h1 className="text-textPrimary text-xl">Fazer pedido</h1>
      </section>

      <div className="grid-cols-1 divide-y divide-separator pt-2">
        {order.OrderProduct.filter(
          (orderProduct) => orderProduct.product.category.name != "Bebidas"
        ).map((orderProduct) => (
          <ProductCard
            key={`product${orderProduct.productId}-order${orderProduct.orderId}`}
            name={orderProduct.product.name}
            amount={orderProduct.amount - orderProduct.orderedAmount}
            orderId={order.id}
            closed={order.closed}
            productId={orderProduct.productId}
            refresh={refresh}
          ></ProductCard>
        ))}
      </div>
    </>
  );
};

export function ProductCard({ name, productId, amount }: ProductCardType) {
  return (
    <div className="p-4 md:p-5 bg-primary">
      <div className="text-textSecondary text-sm flex flex-row justify-between items-center">
        <h3>{name}</h3>
        <FormCounterInput
          name={productId.toString()}
          defaultValue={amount}
          min={0}
          max={Infinity}
        />
      </div>
    </div>
  );
}
