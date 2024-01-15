import { StatisticsController } from "@/controllers/StatisticsController";
import { withApiAuth } from "@/helpers/auth";
import { NextResponse } from "next/server";

export const revalidate = 60;

const GET = withApiAuth(async () => {
  const statistics = await StatisticsController.getEmployeeStatistics();

  return NextResponse.json(statistics);
});

export { GET };
