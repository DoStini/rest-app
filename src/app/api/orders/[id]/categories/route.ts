import { ProductsController } from "@/controllers/ProductsController";
import { TableController } from "@/controllers/TableControllers";
import { withApiAuth } from "@/helpers/auth";
import { NextResponse } from "next/server";

const GET = withApiAuth(async (_, { params }) => {
  const idRaw = params?.id as string;

  if (!idRaw) {
    return NextResponse.json({}, { status: 404 });
  }

  const id = parseInt(idRaw);
  if (isNaN(id)) {
    return NextResponse.json({}, { status: 404 });
  }

  const order = await TableController.getOrder(id);

  if (!order) {
    return NextResponse.json({}, { status: 404 });
  }

  const categories = await ProductsController.listProductByCategoryWithOrder(
    id
  );

  return NextResponse.json({ order, categories });
});

export { GET };
