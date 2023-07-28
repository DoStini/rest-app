import { TableController } from "@/controllers/TableControllers";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

const POST = withApiAuthRequired(
  // @ts-ignore
  async (
    request: Request,
    { params }: { params: { id: string; product: string } }
  ) => {
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

    // code javascript sleep
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const updated = await TableController.updateOrder(
      orderId,
      productId,
      amount
    );

    return NextResponse.json(updated);
  }
);

export { POST };
