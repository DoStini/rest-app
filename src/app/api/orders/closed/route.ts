import { TableController } from "@/controllers/TableControllers";
import { setDynamicRoute } from "@/helpers/api";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

const GET = withApiAuthRequired(async (request) => {
  setDynamicRoute(request);
  const orders = await TableController.findClosedOrders();
  return NextResponse.json({ orders });
});

export { GET };
