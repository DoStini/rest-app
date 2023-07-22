import { TableSectionType, TableType } from "@/types/TableTypes";
import { PrismaClient } from "@prisma/client";
import { getPrismaClient } from "@prisma/client/runtime/library";

export class TableController {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findActiveTables() {
    const tables = await this.prisma.table.findMany({
      include: {
        orders: {
            include: {
                creator: true
            }
        },
        _count: {
          select: { orders: true },
        },
      },
    });
    return tables;
  }

  static async findTableById(id: string) {}
}
