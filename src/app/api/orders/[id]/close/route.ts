import { Printer as PrinterService } from "@/app/services/Printer";
import { TableController } from "@/controllers/TableControllers";
import { withApiAuth } from "@/helpers/auth";
import { NextRequest, NextResponse } from "next/server";

const POST = withApiAuth(async (request: NextRequest, { params }) => {
  const orderIdRaw = params?.id as string;
  const orderId = parseInt(orderIdRaw || "");

  if (isNaN(orderId)) {
    return NextResponse.json({}, { status: 404 });
  }

  try {
    const order = await TableController.generateOrder(orderId);
    await TableController.closeOrder(orderId);
    await PrinterService.printOrder(order);
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
