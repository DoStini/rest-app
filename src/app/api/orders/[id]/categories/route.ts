import { ProductsController } from "@/controllers/ProductsController";
import { TableController } from "@/controllers/TableControllers";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

const GET = withApiAuthRequired(async (_, { params }) => {
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
