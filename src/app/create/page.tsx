import Button from "@/components/Button";
import Form from "@/components/Form";
import CommonHeader from "@/components/orders/CommonHeader";
import Divider from "@/components/orders/Divider";
import { DayController } from "@/controllers/DayController";
import ROUTES from "@/helpers/constants/Routes";
import { formatTime } from "@/helpers/time";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { FiFolderPlus } from "react-icons/fi";

export default withPageAuthRequired(async function Create() {
  "use server";

  const day = await DayController.currentDay();
  if (day) {
    redirect(ROUTES.PAGES.DAY.ROOT);
  }

  async function startDay(data: FormData) {
    "use server";

    try {
      const { name } = Object.fromEntries(data.entries());
      await DayController.createDay(name.toString());
      redirect(ROUTES.PAGES.DAY.ROOT);
    } catch (err) {
      redirect(ROUTES.PAGES.DAY.ROOT);
    }
  }

  return (
    <Form className="text-textPrimary flex flex-col w-full" action={startDay}>
      <Header />

      <section className="my-2">
        <h4 className="font-bold">Hora de Criação</h4>
        <p>{formatTime()}</p>
      </section>
      <Divider />

      <section className="my-2">
        <h4 className="font-bold">Nome do Dia</h4>
        <input
          name="name"
          type="text"
          required
          placeholder="Nome do dia..."
          className="w-full focus:outline-none"
        />
      </section>
      <Divider />

      <Button
        className="bg-tertiary text-textSecondary m-auto mt-5"
        type={"submit"}
        text={"Iniciar dia"}
        preElement={<FiFolderPlus />}
      />
    </Form>
  );
});

const Header = () => {
  return (
    <CommonHeader>
      <h1 className="text-2xl text-textPrimary">Iniciar Dia</h1>
    </CommonHeader>
  );
};
