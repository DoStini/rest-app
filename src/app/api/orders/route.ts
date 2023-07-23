import { TableController } from "@/controllers/TableControllers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request) {
  const activeTables = await TableController.findActiveTables();
  console.log("GET", activeTables);
  return NextResponse.json({
    tables: activeTables,
  });
}
