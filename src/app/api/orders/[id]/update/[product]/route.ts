import { TableController } from "@/controllers/TableControllers";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string; product: string } }
) {
  const { id: orderIdRaw, product: productIdRaw } = params;

  if (!orderIdRaw || !productIdRaw) {
    return NextResponse.json({}, { status: 404 });
  }

  const orderId = parseInt(orderIdRaw);
  const productId = parseInt(productIdRaw);
  if (isNaN(orderId) || isNaN(productId)) {
    return NextResponse.json({}, { status: 404 });
  }

  const { amount } = await request.json();

  const updated = await TableController.updateOrder(orderId, productId, amount);

  return NextResponse.json(updated);
}
