import { TableController } from "@/controllers/TableControllers";
import { UserController } from "@/controllers/UserController";
import { setDynamicRoute } from "@/helpers/api";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";

const GET = withApiAuthRequired(async (request: Request) => {
  setDynamicRoute(request);

  const activeTables = await TableController.findActiveTables();
  return NextResponse.json(activeTables);
});

type CreateOrderType = {
  tableId: number | null;
  orderName: string | null;
};

const POST = withApiAuthRequired(async (request: NextRequest) => {
  const { tableId, orderName } = (await request.json()) as CreateOrderType;
  if (!tableId || !orderName) {
    return NextResponse.json({}, { status: 404 });
  }

  const userSession = await getSession();

  if (!userSession) {
    return NextResponse.json({}, { status: 401 });
  }

  const user = await UserController.findOrCreateUser(
    userSession.user.nickname,
    userSession.user.name
  );

  try {
    const order = await TableController.addOrder(orderName, tableId, user.id);
    return NextResponse.json(order);
  } catch (err) {
    console.error(err);
    if (!(err instanceof Error)) {
      return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }

    if (err.message === "Table not found") {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    if (err.message === "No day open") {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
  }
  return NextResponse.json({ error: "Unknown error" }, { status: 500 });
});

export { GET, POST };
