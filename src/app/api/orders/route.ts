import { TableController } from "@/controllers/TableControllers";
import { UserController } from "@/controllers/UserController";
import { setDynamicRoute } from "@/helpers/api";
import { withApiAuth } from "@/helpers/auth";
import { NextRequest, NextResponse } from "next/server";

const GET = withApiAuth(async (request: Request) => {
  setDynamicRoute(request);

  const activeTables = await TableController.findActiveTables();
  return NextResponse.json(activeTables);
});

type CreateOrderType = {
  tableId: number | null;
  orderName: string | null;
};

const POST = withApiAuth(async (request: NextRequest, _ctx, user) => {
  const { tableId, orderName } = (await request.json()) as CreateOrderType;
  if (!tableId || !orderName) {
    return NextResponse.json({}, { status: 404 });
  }

  const retrievedUser = await UserController.findOrCreateUser(
    user.email,
    user.name
  );

  try {
    const order = await TableController.addOrder(
      orderName,
      tableId,
      retrievedUser.id
    );
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
