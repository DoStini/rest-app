"use client";
import { OrderCard } from "@/components/Cards";
import CommonHeader from "@/components/orders/CommonHeader";
import { TableController } from "@/controllers/TableControllers";
import ROUTES from "@/helpers/constants/Routes";
import { fetcher } from "@/helpers/fetcher";
import { TableSectionType } from "@/types/TableTypes";
import Link from "next/link";
import { FiPlusCircle } from "react-icons/fi";
import useSWR, { SWRConfig } from "swr";

export const revalidate = 0;

export default function TablesList() {
  const { data, isLoading } = useSWR(ROUTES.API.ORDERS.ROOT, fetcher);

  if (isLoading) {
    return <></>;
  }

  const { tables } = data;

  return (
    <>
      <Header />
      <div>
        {tables
          .filter((table) => table._count.orders)
          .map((table) => (
            <TableSection
              key={table.name}
              name={table.name}
              orders={table.orders}
              ordersCount={table._count.orders}
            />
          ))}
      </div>
    </>
  );
}

const Header = () => {
  return (
    <CommonHeader>
      <h1 className="text-2xl text-textPrimary">Contas ativas</h1>
      <Link href={`/orders/create`} className="text-3xl">
        <FiPlusCircle></FiPlusCircle>
      </Link>
    </CommonHeader>
  );
};

const TableSection = ({ name, orders, ordersCount }: TableSectionType) => {
  return (
    <div>
      <h1 className="text-textPrimary mt-4 mb-2 text-xl">{name}</h1>

      {ordersCount === 0 ? (
        <h4>No accounts found</h4>
      ) : (
        <div className="grid-cols-1 divide-y divide-separator">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              title={order.name}
              description={order.creator.username}
            />
          ))}
        </div>
      )}
    </div>
  );
};
