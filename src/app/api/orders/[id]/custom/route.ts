import { ProductsController } from "@/controllers/ProductsController";
import { TableController } from "@/controllers/TableControllers";
import { withApiAuth } from "@/helpers/auth";
import { ManualProductType } from "@/types/ProductTypes";
import { NextRequest, NextResponse } from "next/server";

const POST = withApiAuth(async (req: NextRequest, {params}) => {
  const productInfo = (await req.json()) as ManualProductType;
  const orderIdRaw = params?.id as string;
  const orderId = parseInt(orderIdRaw || "");

  if (isNaN(orderId)) {
    return NextResponse.json({}, { status: 404 });
  }

  const product = await ProductsController.createManualProduct(
    productInfo.name,
    productInfo.price
  );

  await TableController.updateOrder(orderId, product.id, 1);

  return NextResponse.json(product);
});

export { POST };
