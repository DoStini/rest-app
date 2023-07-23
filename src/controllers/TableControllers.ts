import { TableSectionType, TableType } from "@/types/TableTypes";
import { PrismaClient } from "@prisma/client";
import { getPrismaClient } from "@prisma/client/runtime/library";

export class TableController {
  static prisma: PrismaClient;

  static {
    if (!this.prisma) {
      this.prisma = new PrismaClient();
    }
  }

  static async listAllTables() {
    return this.prisma.table.findMany();
  }

  static async findActiveTables() {
    const tables = await this.prisma.table.findMany({
      include: {
        orders: {
          include: {
            creator: true,
          },
        },
        _count: {
          select: { orders: true },
        },
      },
    });
    return tables;
  }

  static async addOrder(name: string, tableId: number, userId: number) {
    const created = await this.prisma.order.create({
      data: {
        name,
        tableId,
        userId,
      },
    });
    console.log(created);
  }
}
