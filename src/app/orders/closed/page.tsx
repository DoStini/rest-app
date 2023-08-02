import CommonHeader from "@/components/orders/CommonHeader";
import { TableController } from "@/controllers/TableControllers";
import ROUTES from "@/helpers/constants/Routes";
import { formatTime } from "@/helpers/time";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { FiArrowLeft, FiPlusCircle } from "react-icons/fi";

export const revalidate = 0;

export default withPageAuthRequired(async function TablesList() {
  const orders = await TableController.findClosedOrders();

  return (
    <>
      <Header />
      <div className="grid-cols-1 mt-4 divide-y divide-separator">
        {orders.map((order) => (
          <div key={`root-${order.id}`}>
            <Link
              key={ROUTES.PAGES.ORDERS.BY_ID(order.id)}
              href={ROUTES.PAGES.ORDERS.BY_ID(order.id)}
            >
              <HistoryOrderCard
                key={order.id}
                title={`${order.Table?.name} - ${order.name}`}
                creator={order.creator.name}
                closedAt={order.closedAt}
                total={order.closedTotal?.toFixed(2) || "0"}
              />
            </Link>
          </div>
        ))}
      </div>
    </>
  );
});

const Header = () => {
  return (
    <CommonHeader>
      <Link href={ROUTES.PAGES.ORDERS.ROOT} className="text-3xl">
        <FiArrowLeft />
      </Link>
      <h1 className="text-2xl text-textPrimary pl-4">Histórico</h1>
    </CommonHeader>
  );
};

function HistoryOrderCard({
  title,
  creator,
  closedAt,
  total,
}: {
  title: string;
  creator: string;
  closedAt: Date | null;
  total: string;
}) {
  return (
    <div className="p-4 md:p-5 bg-primary">
      <div className="text-textSecondary flex justify-between items-center">
        <div>
          <h3 className="text-lg">{title}</h3>
          <p className="text-sm">Responsável: {creator}</p>
          {closedAt && <p className="text-sm">Hora de fecho: {formatTime(closedAt)}</p>}
          <p className="text-sm">Total: {total}€</p>
        </div>
      </div>
    </div>
  );
}
