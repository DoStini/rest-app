import Button from "@/components/Button";
import LinkButton from "@/components/LinkButton";
import CommonHeader from "@/components/orders/CommonHeader";
import Divider from "@/components/orders/Divider";
import { DayController } from "@/controllers/DayController";
import { TableController } from "@/controllers/TableControllers";
import ROUTES from "@/helpers/constants/Routes";
import { formatTime } from "@/helpers/time";
import { DayType } from "@/types/DayTypes";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import {
  FiAlertTriangle,
  FiBarChart2,
  FiPrinter,
  FiShoppingCart,
} from "react-icons/fi";

export default withPageAuthRequired(async function Home() {
  const day = await DayController.currentDay();
  const orders = await TableController.findActiveTables();
  const openOrder = orders.find((order) => order._count.orders > 0) != null;

  if (!day) {
    redirect(ROUTES.PAGES.DAY.CREATE);
    return <div></div>;
  }

  const session = await getSession();

  if (!session) {
    redirect(ROUTES.API.AUTH.LOGIN);
  }

  const authorizedCloser = DayController.authorizedCloser(session.user);

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
        <p>{formatTime(day.createdAt)}</p>
      </section>
      <Divider />

      <LinkButton
        className="text-textSecondary bg-success m-auto mt-10"
        href={ROUTES.PAGES.ORDERS.ROOT}
        text="Contas"
        preElement={<FiShoppingCart />}
      />

      <LinkButton
        className="text-textSecondary bg-tertiary m-auto mt-10"
        href={ROUTES.PAGES.DAY.STATS}
        text="Estatísticas"
        preElement={<FiBarChart2 />}
      />

      {authorizedCloser && (
        <LinkButton
          className="text-textSecondary bg-warning m-auto mt-10"
          href={ROUTES.PAGES.DAY.CLOSE}
          text="Encerrar dia"
          preElement={<FiAlertTriangle />}
          disabled={openOrder}
        />
      )}
    </div>
  );
});

const Header = ({ day }: { day: DayType }) => {
  return (
    <CommonHeader>
      <h1 className="text-2xl text-textPrimary">{day.name}</h1>
    </CommonHeader>
  );
};
