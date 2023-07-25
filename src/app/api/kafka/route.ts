import { OrderPrintController } from "@/controllers/OrderPrintController";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await OrderPrintController.GenerateOrder();
  return NextResponse.json({ result });
}
