import { TableController } from "@/controllers/TableControllers";
import { withApiAuth } from "@/helpers/auth";
import { NextResponse } from "next/server";

const POST = withApiAuth(async (request, { params }) => {
  const orderIdRaw = params?.id as string;
  const productIdRaw = params?.product as string;

  if (!orderIdRaw || !productIdRaw) {
    return NextResponse.json({}, { status: 404 });
  }

  const orderId = parseInt(orderIdRaw);
  const productId = parseInt(productIdRaw);
  if (isNaN(orderId) || isNaN(productId)) {
    return NextResponse.json({}, { status: 404 });
  }

  const { amount } = await request.json();

  // code javascript sleep
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const updated = await TableController.updateOrder(orderId, productId, amount);

  return NextResponse.json(updated);
});

export { POST };
