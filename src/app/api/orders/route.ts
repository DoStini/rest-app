import { TableController } from "@/controllers/TableControllers";
import { setDynamicRoute } from "@/helpers/api";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  setDynamicRoute(request);

  const activeTables = await TableController.findActiveTables();
  return NextResponse.json({
    tables: activeTables,
  });
}
