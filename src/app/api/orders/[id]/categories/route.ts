import { ProductsController } from "@/controllers/ProductsController";
import { TableController } from "@/controllers/TableControllers";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id: idRaw } = params;

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
}
