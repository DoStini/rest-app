import { TableController } from "@/controllers/TableControllers";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";

const POST = withApiAuthRequired(async (request: NextRequest, { params }) => {
  const orderIdRaw = params?.id as string;
  const orderId = parseInt(orderIdRaw || "");

  if (isNaN(orderId)) {
    return NextResponse.json({}, { status: 404 });
  }

  try {
    await TableController.closeOrder(orderId);
    return NextResponse.json({});
  } catch (err) {
    console.error(err);
    if (!(err instanceof Error)) {
      return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }

    if (err.message === "Order not found") {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    if (err.message === "Order is already closed") {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
  }

  return NextResponse.json({ error: "Unknown error" }, { status: 500 });
});

export { POST };
