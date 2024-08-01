import { StatisticsController } from "@/controllers/StatisticsController";
import { withApiAuth } from "@/helpers/auth";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 60;
// export const dynamicParams = false;

const GET = withApiAuth(async (req: NextRequest) => {
  const statistics = await StatisticsController.getMainStatistics();

  return NextResponse.json(statistics);
});

export { GET };
