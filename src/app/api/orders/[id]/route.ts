import { TableController } from "@/controllers/TableControllers";
import { withApiAuth } from "@/helpers/auth";
import { NextRequest, NextResponse } from "next/server";

const GET = withApiAuth(async (_, { params }) => {
  const idRaw = params?.id as string;

  if (!idRaw) {
    return NextResponse.json({}, { status: 404 });
  }

  const id = parseInt(idRaw);
  if (isNaN(id)) {
    return NextResponse.json({}, { status: 404 });
  }

  const order = await TableController.getOrder(id);

  if (!order) {
    return NextResponse.json({}, { status: 404 });
  }

  return NextResponse.json(order);
});

type EditOrderType = {
  tableId: number | null;
  orderName: string | null;
};

const PATCH = withApiAuth(async (request: NextRequest, { params }, user) => {
  const { tableId, orderName } = (await request.json()) as EditOrderType;
  if (!tableId || !orderName) {
    return NextResponse.json({}, { status: 404 });
  }

  const id = params.id as string;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return NextResponse.json({}, { status: 404 });
  }

  try {
    const order = await TableController.editOrder(parsedId, orderName, tableId);
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

export { GET, PATCH };
