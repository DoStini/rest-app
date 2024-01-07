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

  const { comment } = await request.json();

  await TableController.saveComment(orderId, productId, comment);

  return NextResponse.json({});
});

export { POST };
