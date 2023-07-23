"use client";
import { OrderCard } from "@/components/Cards";
import CommonHeader from "@/components/orders/CommonHeader";
import Divider from "@/components/orders/Divider";
import { TableController } from "@/controllers/TableControllers";
import ROUTES from "@/helpers/constants/Routes";
import { fetcher } from "@/helpers/fetcher";
import { redirectNotFound } from "@/helpers/router";
import { OrderType, TableSectionType } from "@/types/TableTypes";
import { FetcherOrderType, SwrOrderType } from "@/types/swrTypes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiPlusCircle } from "react-icons/fi";
import useSWR from "swr";

export default function OrderPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const { id } = params;

  const { data, isLoading }: SwrOrderType = useSWR<FetcherOrderType>(
    ROUTES.API.ORDERS.BY_ID(id),
    fetcher
  );

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

      <ProductSection></ProductSection>
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

const ProductSection = () => {
  return (
    <section className="my-2 flex justify-between items-center text-textPrimary">
      <h1 className="text-textPrimary text-xl">Produtos</h1>
      <Link href={ROUTES.PAGES.ORDERS.CREATE} className="text-3xl">
        <FiPlusCircle></FiPlusCircle>
      </Link>
    </section>
  );
};
