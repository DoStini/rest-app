import { TableController } from "@/controllers/TableControllers";
import { setDynamicRoute } from "@/helpers/api";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

const GET = withApiAuthRequired(async (request: Request) => {
  setDynamicRoute(request);
  const session = await getSession();

  const activeTables = await TableController.findActiveTables();
  return NextResponse.json(activeTables);
});

export { GET };
