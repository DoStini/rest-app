import { TableController } from "@/controllers/TableControllers";
import { setDynamicRoute } from "@/helpers/api";
import { withApiAuth } from "@/helpers/auth";
import { NextResponse } from "next/server";

const GET = withApiAuth(async (request) => {
  setDynamicRoute(request);
  const orders = await TableController.findClosedOrders();
  return NextResponse.json({ orders });
});

export { GET };
