import { OrderPrintController } from "@/controllers/OrderPrintController";
import { setDynamicRoute } from "@/helpers/api";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  setDynamicRoute(request);

  const result = await OrderPrintController.GenerateOrder();
  return NextResponse.json({ result });
}
