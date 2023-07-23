import { TableController } from "@/controllers/TableControllers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  console.log(searchParams);
  const activeTables = await TableController.findActiveTables();
  return NextResponse.json({
    tables: activeTables,
  });
}
