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
            creator: {
              select: {
                id: true,
                username: true,
              },
            },
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

    return created;
  }

  static getOrder(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        OrderProduct: {
          include: {
            product: true,
          },
        },
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
        Table: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  static async updateOrder(orderId: number, productId: number, amount: number) {
    if (amount <= 0) {
      return this.prisma.orderProduct.delete({
        where: {
          productId_orderId: {
            orderId,
            productId,
          },
        },
      });
    }

    const updated = await this.prisma.orderProduct.upsert({
      where: {
        productId_orderId: {
          orderId,
          productId,
        },
      },
      update: {
        amount: {
          set: amount,
        },
      },
      create: {
        orderId,
        productId,
        amount: amount,
        comment: "",
      },
    });

    return updated;
  }
}
