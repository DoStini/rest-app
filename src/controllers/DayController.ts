import { mulTwoDecimals, sumTwoDecimals } from "@/helpers/math";
import { PrismaTransacitonClient } from "@/types/PrismaTypes";
import { UserType } from "@/types/TableTypes";
import { Claims } from "@auth0/nextjs-auth0";
import { PrismaClient } from "@prisma/client";

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
      },
    });
  }

  static async incrementCurrentTotal(
    tx: PrismaTransacitonClient = this.prisma,
    amount: number
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

  static async currentDay(tx: PrismaTransacitonClient = this.prisma) {
    return tx.day.findFirst({
      where: {
        closed: false,
      },
    });
  }
}
