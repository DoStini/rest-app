import { formatDateWithMonth } from "@/helpers/time";
import { PrismaTransacitonClient } from "@/types/PrismaTypes";
import {
  EmployeeStatistics,
  MainStatistics,
  ProductStatistics,
  Statistic,
} from "@/types/StatisticTypes";
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
      value: total?.toFixed(2).toString() || "0",
      preValue: "€",
    };
  };

  private static getBestEmployee = async (
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
      value: bestEmployee[0]._sum.closedTotal?.toFixed(2).toString(),
      subValue: user?.name,
      preValue: "€",
    };
  };

  private static getBiggestOrder = async (
    tx: PrismaTransacitonClient = this.prisma
  ): Promise<Statistic | null> => {
    const biggestOrderValue = await tx.order.aggregate({
      where: {
        closed: true,
      },
      _max: {
        closedTotal: true,
      },
    });

    if (!biggestOrderValue._max.closedTotal) {
      return null;
    }

    const biggestOrder = await tx.order.findFirst({
      where: {
        closedTotal: biggestOrderValue._max.closedTotal,
      },
      include: {
        creator: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!biggestOrder) {
      return null;
    }

    return {
      name: "Biggest Order",
      value: biggestOrderValue._max.closedTotal.toFixed(2).toString(),
      subValue: biggestOrder.creator.name,
      preValue: "€",
    };
  };

  private static bestDayOfWeek = async (
    tx: PrismaTransacitonClient = this.prisma
  ): Promise<Statistic | null> => {
    const bestDay = await tx.order.groupBy({
      by: ["dayId"],
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

    const day = await tx.day.findUnique({
      where: {
        id: bestDay[0].dayId,
      },
    });

    if (!bestDay[0]._sum.closedTotal) {
      return null;
    }

    return {
      name: "Best day of the Week",
      value: bestDay[0]._sum.closedTotal?.toFixed(2).toString(),
      subValue: `${formatDateWithMonth(day?.createdAt, "/")} - ${day?.name}`,
      preValue: "€",
    };
  };

  private static mostSoldProduct = async (
    tx: PrismaTransacitonClient = this.prisma
  ): Promise<Statistic | null> => {
    const mostSoldProduct = await tx.orderProduct.groupBy({
      by: ["productId"],
      where: {
        order: {
          closed: true,
        },
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: "desc",
        },
      },
      take: 1,
    });

    const product = await tx.product.findUnique({
      where: {
        id: mostSoldProduct[0].productId,
      },
    });

    if (!product || !mostSoldProduct[0]._sum.amount) {
      return null;
    }

    return {
      name: "Most Sold Product",
      value: mostSoldProduct[0]._sum.amount?.toString(),
      subValue: product?.name,
    };
  };

  static getMainStatistics = async () => {
    const statistics: MainStatistics = await this.prisma.$transaction(
      async (tx) => {
        const statistics = await Promise.all([
          this.getTotalDay(tx),
          this.bestDayOfWeek(tx),
          this.getBestEmployee(tx),
          this.getBiggestOrder(tx),
          this.mostSoldProduct(tx),
        ]);

        return statistics.filter(
          (statistic) => statistic !== null
        ) as MainStatistics;
      }
    );

    return statistics;
  };

  static getProductStatistics = async () => {
    const statistics: ProductStatistics | null = await this.prisma.$transaction(
      async (tx) => {
        const products = await tx.orderProduct.groupBy({
          by: ["productId"],
          where: {
            closedTotal: {
              not: null,
            },
          },
          _sum: {
            amount: true,
          },
          orderBy: {
            _sum: {
              amount: "desc",
            },
          },
          take: 5,
        });

        const total = await tx.orderProduct.aggregate({
          where: {
            closedTotal: {
              not: null,
            },
          },
          _sum: {
            amount: true,
          },
        });

        if (!total._sum.amount) {
          return null;
        }

        const mappedProducts = await Promise.all(
          products.map(async (product) => {
            const productData = await tx.product.findUnique({
              where: {
                id: product.productId,
              },
            });

            return {
              name: productData!.name,
              amount: product._sum.amount!,
            };
          })
        );

        const categories: {
          categoryId: number | null; // Allow null for products without a category
          name: string;
          totalAmount: bigint;
        }[] = await tx.$queryRaw`
            SELECT
              p."categoryId",
              c."name" as "name",
              SUM(op."amount") AS "totalAmount"
            FROM
              "OrderProduct" op
              JOIN "Product" p ON op."productId" = p."id"
              LEFT JOIN "Category" c ON p."categoryId" = c."id"
            WHERE
              op."closedTotal" IS NOT NULL
            GROUP BY
              p."categoryId", c."name"
            ORDER BY
              "totalAmount" DESC
            LIMIT 5
          `;

        const mappedCategories = categories.map((category) => ({
          name: category.name || "Manual",
          amount: Number(category.totalAmount),
        }));

        return {
          total: total._sum.amount,
          products: mappedProducts,
          categories: mappedCategories,
        };
      }
    );

    return statistics;
  };

  private static getBiggestOrders = async (
    tx: PrismaTransacitonClient = this.prisma
  ): Promise<EmployeeStatistics["biggest"]> => {
    const biggestOrders = await tx.order.groupBy({
      by: ["userId"],
      where: {
        closed: true,
      },
      _max: {
        closedTotal: true,
      },
      orderBy: {
        _max: {
          closedTotal: "desc",
        },
      },
      take: 5,
    });
    const mapped = await Promise.all(
      biggestOrders.map(async (data) => ({
        name: (await tx.user.findUnique({
          where: {
            id: data.userId,
          },
        }))!.name,
        value: Number(data._max.closedTotal || 0),
      }))
    );

    return mapped;
  };

  private static getMostValuableEmployees = async (
    tx: PrismaTransacitonClient = this.prisma
  ): Promise<EmployeeStatistics["monetary"]> => {
    const bestEmployees = await tx.order.groupBy({
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
      take: 5,
    });

    const mappedEmployees = await Promise.all(
      bestEmployees.map(async (data) => ({
        name:
          (
            await tx.user.findUnique({
              where: {
                id: data.userId,
              },
            })
          )?.name || "",
        value: Number(data._sum.closedTotal),
      }))
    );

    return mappedEmployees;
  };

  private static getMostOrdersEmployee = async (
    tx: PrismaTransacitonClient = this.prisma
  ): Promise<EmployeeStatistics["quantity"]> => {
    const bestEmployees = await tx.order.groupBy({
      by: ["userId"],
      where: {
        closed: true,
      },
      _count: {
        closedTotal: true,
      },
      orderBy: {
        _count: {
          closedTotal: "desc",
        },
      },
      take: 5,
    });

    const mappedEmployees = await Promise.all(
      bestEmployees.map(async (data) => ({
        name: (await tx.user.findUnique({
          where: {
            id: data.userId,
          },
        }))!.name,
        value: data._count.closedTotal,
      }))
    );

    return mappedEmployees;
  };

  static getEmployeeStatistics = async () => {
    const statistics: EmployeeStatistics = await this.prisma.$transaction(
      async (tx) => {
        const [mostOrders, mostValuable, biggestOrders] = await Promise.all([
          this.getMostOrdersEmployee(tx),
          this.getMostValuableEmployees(tx),
          this.getBiggestOrders(tx),
        ]);

        return {
          monetary: mostValuable,
          quantity: mostOrders,
          biggest: biggestOrders,
        };
      }
    );
    return statistics;
  };
}
