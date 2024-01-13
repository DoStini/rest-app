import { ProductsController } from "@/controllers/ProductsController";
import { withApiAuth } from "@/helpers/auth";
import { CreateProductType } from "@/types/ProductTypes";
import { NextRequest, NextResponse } from "next/server";

const PATCH = withApiAuth(async (req: NextRequest, { params }) => {
  const id = params?.id as string;

  if (!id) {
    return NextResponse.json({}, { status: 404 });
  }

  const productId = parseInt(id);
  if (isNaN(productId)) {
    return NextResponse.json({}, { status: 404 });
  }

  const productInfo = (await req.json()) as CreateProductType;

  const updated = await ProductsController.updateProduct(
    productId,
    productInfo
  );

  return NextResponse.json(updated);
});

const DELETE = withApiAuth(async (req: NextRequest, { params }) => {
  const id = params?.id as string;

  if (!id) {
    return NextResponse.json({}, { status: 404 });
  }

  const productId = parseInt(id);
  if (isNaN(productId)) {
    return NextResponse.json({}, { status: 404 });
  }

  await ProductsController.deleteProduct(productId);

  return NextResponse.json({});
});

export { PATCH, DELETE };
