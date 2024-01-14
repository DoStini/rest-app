import { PrismaTransacitonClient } from "@/types/PrismaTypes";
import { MainStatistics, Statistic } from "@/types/StatisticTypes";
import { PrismaClient } from "@prisma/client";

export class StatisticsController {
  static prisma: PrismaClient;

  static {
    if (!this.prisma) {
      this.prisma = new PrismaClient();
    }
  }

  static getTotalDay = async (
    tx: PrismaTransacitonClient = this.prisma
  ): Promise<Statistic> => {
    const total = (
      await tx.order.aggregate({
        where: {
          closed: true,
          day: {
            closed: false,
          },
        },
        _sum: {
          closedTotal: true,
        },
      })
    )._sum.closedTotal;

    return {
      name: "Total Day",
      value: total?.toString() || "0",
      preValue: "€",
    };
  };

  static getBestEmployee = async (
    tx: PrismaTransacitonClient = this.prisma
  ): Promise<Statistic | null> => {
    const bestEmployee = await tx.order.groupBy({
      by: ["userId"],
      where: {
        closed: true,
      },
      _sum: {
        closedTotal: true,
      },
      orderBy: {
        _sum: {
          closedTotal: "desc",
        },
      },
      take: 1,
    });

    const user = await tx.user.findUnique({
      where: {
        id: bestEmployee[0].userId,
      },
    });

    if (!user || !bestEmployee[0]._sum.closedTotal) {
      return null;
    }

    return {
      name: "Best Employee",
      value: bestEmployee[0]._sum.closedTotal?.toString(),
      subValue: user?.name,
      preValue: "€",
    };
  };

  static getMainStatistics = async () => {
    const statistics: MainStatistics = await this.prisma.$transaction(
      async (tx) => {
        const statistics = await Promise.all([
          this.getTotalDay(tx),
          this.getBestEmployee(tx),
        ]);

        return statistics.filter(
          (statistic) => statistic !== null
        ) as MainStatistics;
      }
    );

    return statistics;
  };
}
