import { mulTwoDecimals, round2, sumTwoDecimals } from "@/helpers/math";
import { PrismaTransacitonClient } from "@/types/PrismaTypes";
import { UserType } from "@/types/TableTypes";
import { Claims } from "@auth0/nextjs-auth0";
import { PrismaClient } from "@prisma/client";
import { TableController } from "./TableControllers";
import { Decimal } from "@prisma/client/runtime/library";

export class DayController {
  static prisma: PrismaClient;

  static {
    if (!this.prisma) {
      this.prisma = new PrismaClient();
    }
  }

  static authorizedCloser(user: Claims) {
    return ["andre.moreira.9"].includes(user.nickname);
  }

  static async createDay(name: string) {
    if (await this.currentDay()) {
      throw new Error("Day already open");
    }

    return this.prisma.day.create({
      data: {
        name,
        total: 0,
        closed: false,
      },
    });
  }

  static async closeDay() {
    const day = await this.currentDay();

    if (!day) {
      throw new Error("No day open");
    }

    return this.prisma.day.update({
      where: {
        id: day.id,
      },
      data: {
        closed: true,
        total: day.total,
      },
    });
  }

  static async incrementCurrentTotal(
    tx: PrismaTransacitonClient = this.prisma,
    amount: number | Decimal
  ) {
    const day = await this.currentDay(tx);
    if (!day) throw new Error("No day open");

    const newTotal = sumTwoDecimals(day.total, amount);
    return await this.prisma.day.updateMany({
      where: {
        closed: false,
      },
      data: {
        total: newTotal,
      },
    });
  }

  static async decrementCurrentTotal(
    tx: PrismaTransacitonClient = this.prisma,
    amount: number | Decimal
  ) {
    await this.incrementCurrentTotal(tx, -amount);
  }

  static async currentDay(tx: PrismaTransacitonClient = this.prisma) {
    const day = await tx.day.findFirst({
      select: {
        id: true,
        name: true,
        total: true,
        closed: true,
        closedAt: true,
        createdAt: true,
      },
      where: {
        closed: false,
      },
    });

    if (!day) return null;

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
      ...day,
      total: total || 0,
    };
  }

  static listClosedDays() {
    return this.prisma.day.findMany({
      where: {
        closed: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
