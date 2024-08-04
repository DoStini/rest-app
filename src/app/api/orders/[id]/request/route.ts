import { Printer } from "@/app/services/Printer";
import { TableController } from "@/controllers/TableControllers";
import { withApiAuth } from "@/helpers/auth";
import { NextResponse } from "next/server";

/**
 * @description This API route is used to get the printable order products from the print page
 */
const GET = withApiAuth(async (_, { params }) => {
  const idRaw = params?.id as string;

  if (!idRaw) {
    return NextResponse.json({}, { status: 404 });
  }

  const id = parseInt(idRaw);
  if (isNaN(id)) {
    return NextResponse.json({}, { status: 404 });
  }

  const order = await TableController.getPrintableOrderProducts(id);

  if (!order) {
    return NextResponse.json({}, { status: 404 });
  }

  return NextResponse.json(order);
});

const POST = withApiAuth(async (req, { params }) => {
  const idRaw = params?.id as string;

  if (!idRaw) {
    return NextResponse.json({}, { status: 404 });
  }

  const id = parseInt(idRaw);
  if (isNaN(id)) {
    return NextResponse.json({}, { status: 404 });
  }

  const order = await TableController.getPrintableOrderProducts(id);

  if (!order) {
    return NextResponse.json({}, { status: 404 });
  }

  const amounts = (
    (await req.json()) as {
      productId: number;
      amount: number;
    }[]
  ).filter((item) => item.amount > 0);

  if (!amounts) {
    return NextResponse.json({}, { status: 404 });
  }

  const data = (await TableController.requestOrder(id, amounts)).map(
    (item) => ({
      productId: item.productId,
      amount: item.amount,
      comment: item.comment || "",
    })
  );

  await Printer.printRequest(
    order.creator?.name || "",
    order.createdAt || new Date(),
    order.Table?.name || "",
    data
  );

  return NextResponse.json({});
});

export { GET, POST };
