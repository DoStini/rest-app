import { TableController } from "@/controllers/TableControllers";
import { setDynamicRoute } from "@/helpers/api";
import { apiWithAuth } from "@/helpers/auth";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

const GET = apiWithAuth(async (request: Request, _ctx, user) => {
  setDynamicRoute(request);
  const session = await getSession();

  console.log(user);

  const activeTables = await TableController.findActiveTables();
  return NextResponse.json(activeTables);
});

export { GET };
