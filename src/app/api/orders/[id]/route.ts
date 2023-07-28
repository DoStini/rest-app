import { TableController } from "@/controllers/TableControllers";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";

const GET = withApiAuthRequired(
  // @ts-ignore
  async (request: NextApiRequest, { params }: { params: { id: string } }) => {
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

    return NextResponse.json(order);
  }
);

export { GET };
