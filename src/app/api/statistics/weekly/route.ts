import { StatisticsController } from "@/controllers/StatisticsController";
import { withApiAuth } from "@/helpers/auth";
import { NextResponse } from "next/server";

const GET = withApiAuth(async () => {
  const statistics = await StatisticsController.getLastDaysStatistics();

  return NextResponse.json(statistics);
});

export { GET };
