import { ProductsController } from "@/controllers/ProductsController";
import { withApiAuth } from "@/helpers/auth";
import { NextRequest, NextResponse } from "next/server";

const GET = withApiAuth(async (req: NextRequest) => {
  const products = await ProductsController.listProductByCategory();

  return NextResponse.json(products);
});

export { GET };
