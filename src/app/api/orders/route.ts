import { TableController } from "@/controllers/TableControllers";
import { NextResponse } from "next/server";

export async function GET() {
  const activeTables = await TableController.findActiveTables();
  return NextResponse.json({
    tables: activeTables,
  });
}
