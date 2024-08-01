import { TableController } from "@/controllers/TableControllers";
import { withApiAuth } from "@/helpers/auth";
import { NextResponse } from "next/server";

const PATCH = withApiAuth(async (req, { params }) => {
  const id = params.id as string;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return NextResponse.json({}, { status: 400 });
  }

  const order = await TableController.getSimpleOrder(parsedId);
  if (!order) return NextResponse.json({}, { status: 404 });

  if (!order.closed) {
    return NextResponse.json({ error: "Order already open" }, { status: 400 });
  }

  const updated = await TableController.reopenOrder(parsedId);
  return NextResponse.json(updated);
});

export { PATCH };
