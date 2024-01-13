import { ProductsController } from "@/controllers/ProductsController";
import { withApiAuth } from "@/helpers/auth";
import { CreateProductType } from "@/types/ProductTypes";
import { NextRequest, NextResponse } from "next/server";

const GET = withApiAuth(async (req: NextRequest) => {
  const products = await ProductsController.listProductByCategory();

  return NextResponse.json(products);
});

const POST = withApiAuth(async (req: NextRequest) => {
  const productInfo = (await req.json()) as CreateProductType;

  const product = await ProductsController.createProduct(productInfo);

  return NextResponse.json(product);
});

export { GET, POST };
