import { TableController } from "@/controllers/TableControllers";
import { withApiAuth } from "@/helpers/auth";
import { NextRequest, NextResponse } from "next/server";

const GET = withApiAuth(async () => {
  const tables = await TableController.getTablesInfo();

  return NextResponse.json(tables);
});

export { GET };
