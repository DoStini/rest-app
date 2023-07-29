"use client";
import { OrderCard } from "@/components/Cards";
import CommonHeader from "@/components/orders/CommonHeader";
import { REFRESH_INTERVAL } from "@/helpers/api";
import ROUTES from "@/helpers/constants/Routes";
import { fetcher } from "@/helpers/fetcher";
import { redirectLogin } from "@/helpers/router";
import { TableSectionType } from "@/types/TableTypes";
import { FetcherOrdersType, SwrOrdersType } from "@/types/swrTypes";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiPlusCircle, FiRotateCcw } from "react-icons/fi";
import useSWR from "swr";

export const revalidate = 0;

export default withPageAuthRequired(function TablesList() {
  const router = useRouter();

  const { data, isLoading, error }: SwrOrdersType = useSWR<FetcherOrdersType>(
    ROUTES.API.ORDERS.ROOT,
    fetcher,
    { refreshInterval: REFRESH_INTERVAL }
  );

  if (error?.status === 401) {
    redirectLogin(router);
    return <></>;
  }

  if (isLoading || !data) {
    return <></>;
  }

  const tables = data?.data;

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
});

const Header = () => {
  return (
    <CommonHeader>
      <div className="flex flex-row items-center">
        <Link href={ROUTES.PAGES.DAY.ROOT} className="text-3xl">
          <FiArrowLeft />
        </Link>
        <h1 className="text-2xl text-textPrimary pl-4">Contas ativas</h1>
      </div>
      <div className="flex flex-row items-center">
        <Link href={ROUTES.PAGES.ORDERS.CLOSED} className="text-3xl">
          <FiRotateCcw />
        </Link>
        <Link href={ROUTES.PAGES.ORDERS.CREATE} className="ml-5 text-3xl">
          <FiPlusCircle></FiPlusCircle>
        </Link>
      </div>
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
            <div key={`root-${order.id}`}>
              <Link
                key={ROUTES.PAGES.ORDERS.BY_ID(order.id)}
                href={ROUTES.PAGES.ORDERS.BY_ID(order.id)}
              >
                <OrderCard
                  key={order.id}
                  title={order.name}
                  description={order.creator.name}
                />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
