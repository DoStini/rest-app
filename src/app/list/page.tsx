import CommonHeader from "@/components/orders/CommonHeader";
import { DayController } from "@/controllers/DayController";
import ROUTES from "@/helpers/constants/Routes";
import { formatDateWithTime } from "@/helpers/time";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default withPageAuthRequired(async function List() {
  const days = await DayController.listClosedDays();

  return (
    <div className="text-textPrimary flex flex-col w-full">
      <Header />

      {days.length === 0 ? (
        <h4>No accounts found</h4>
      ) : (
        <div className="grid-cols-1 divide-y divide-separator my-5">
          {days.map((day) => (
            <div key={`root-${day.id}`}>
              <DayCard
                key={day.id}
                name={day.name}
                total={day.total.toFixed(2) + " €"}
                createdAt={formatDateWithTime(day.createdAt)}
                closedAt={formatDateWithTime(day.closedAt || new Date())}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

const Header = () => {
  return (
    <CommonHeader>
      <div className="flex flex-row items-center">
        <Link href={ROUTES.PAGES.DAY.ROOT} className="text-3xl">
          <FiArrowLeft />
        </Link>
        <h1 className="text-2xl text-textPrimary pl-5">
          Estatísticas passadas
        </h1>
      </div>
    </CommonHeader>
  );
};

function DayCard({
  name,
  total,
  createdAt,
  closedAt,
}: {
  name: string;
  total: string;
  createdAt: string;
  closedAt: string;
}) {
  return (
    <div className="p-4 md:p-5 bg-primary">
      <div className="text-textSecondary flex justify-between items-center">
        <div>
          <h3 className="text-lg">{name}</h3>
          <p className="text-sm">Total: {total}</p>
          <p className="text-sm">Criado : {createdAt}</p>
          <p className="text-sm">Fechado: {closedAt}</p>
        </div>
      </div>
    </div>
  );
}
