import { mulTwoDecimals, round2 } from "@/helpers/math";
import { formatDateWithTime } from "@/helpers/time";
import {
  FinalOrderType,
  OrderType,
  SimpleOrderType,
  TableSectionType,
  TableType,
} from "@/types/TableTypes";
import { Prisma, PrismaClient } from "@prisma/client";
import {
  Decimal,
  DefaultArgs,
  getPrismaClient,
} from "@prisma/client/runtime/library";
import { notFound } from "next/navigation";

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
          where: {
            closed: false,
          },
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

  static getSimpleOrder(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        Table: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  static getOrder(
    id: number,
    tx?:
      | PrismaClient
      | Omit<
          PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
          | "$connect"
          | "$disconnect"
          | "$on"
          | "$transaction"
          | "$use"
          | "$extends"
        >
  ) {
    const client = tx || this.prisma;
    return client.order.findUnique({
      where: { id, closed: false },
      include: {
        OrderProduct: {
          include: {
            product: true,
          },
          orderBy: {
            createdAt: "asc",
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

  private static calculateTotal(order: {
    OrderProduct: { product: { price: Decimal }; amount: number }[];
  }) {
    return order.OrderProduct.reduce((acc, item) => {
      return round2(acc + round2(round2(item.product.price) * item.amount));
    }, 0);
  }

  static async generateOrder(id: number): Promise<FinalOrderType> {
    const order = await TableController.getOrder(id);
    if (!order) return notFound();

    const mappedOrder = order.OrderProduct.map((item) => {
      return {
        id: item.productId,
        name: item.product.name,
        amount: item.amount,
        price: item.product.price.toFixed(2),
        total: mulTwoDecimals(item.product.price, item.amount).toFixed(2),
      };
    });

    const total = this.calculateTotal(order).toFixed(2);

    return {
      ...order,
      finalProducts: mappedOrder,
      total: total,
    };
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

  static async closeOrder(id: number) {
    await this.prisma.$transaction(async (tx) => {
      const order = await this.getOrder(id, tx);
      if (!order) throw new Error("Order not found");

      await tx.order.update({
        where: { id },
        data: {
          closedAt: new Date(),
          closed: true,
          closedTotal: this.calculateTotal(order),
        },
      });

      const affectedOrderProducts = await tx.orderProduct.findMany({
        where: { order: { id } },
        include: {
          product: true,
        },
      });

      await Promise.all(
        affectedOrderProducts.map(
          async (item) =>
            await tx.orderProduct.update({
              where: {
                productId_orderId: { orderId: id, productId: item.productId },
              },
              data: {
                closedTotal: mulTwoDecimals(item.amount, item.product.price),
              },
            })
        )
      );
    });
  }
}
