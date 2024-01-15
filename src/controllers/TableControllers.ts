import { mulTwoDecimals, round2 } from "@/helpers/math";
import { FinalOrderType } from "@/types/TableTypes";
import { Prisma, PrismaClient } from "@prisma/client";
import {
  Decimal,
  DefaultArgs,
  getPrismaClient,
} from "@prisma/client/runtime/library";
import { notFound } from "next/navigation";
import { DayController } from "./DayController";

export class TableController {
  static prisma: PrismaClient;

  static {
    if (!this.prisma) {
      this.prisma = new PrismaClient();
    }
  }

  static getTablesInfo() {
    return this.prisma.table.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  static async listAllTables() {
    return this.prisma.table.findMany();
  }

  static async requestOrder(
    orderId: number,
    amounts: { productId: number; amount: number }[]
  ) {
    return await Promise.all(
      amounts.map(async (item) => {
        await this.prisma.orderProduct.update({
          where: {
            productId_orderId: {
              orderId,
              productId: item.productId,
            },
            product: {
              category: {
                printable: true,
              },
            },
          },
          data: {
            orderedAmount: {
              increment: item.amount,
            },
          },
        });
      })
    );
  }

  static async getPrintableOrderProducts(id: number) {
    const orderInfo = await this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        Table: {
          select: {
            name: true,
          },
        },
        creator: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
    });

    const filteredProducts = await this.prisma.orderProduct.findMany({
      where: {
        AND: {
          order: {
            id,
          },
          product: {
            category: {
              printable: true,
            },
          },
        },
      },
      orderBy: {
        product: {
          name: "asc",
        },
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    return {
      ...orderInfo,
      OrderProduct: filteredProducts,
    };
  }

  static async saveComment(
    orderId: number,
    productId: number,
    comment: string
  ) {
    return this.prisma.orderProduct.update({
      where: {
        productId_orderId: {
          orderId,
          productId,
        },
      },
      data: {
        comment,
      },
    });
  }

  static async findOrderProducts(dayId: number) {
    const amounts = await this.prisma.orderProduct.groupBy({
      by: ["productId"],
      where: {
        order: {
          dayId,
        },
      },
      _sum: {
        amount: true,
      },
    });
    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: amounts.map((item) => item.productId),
        },
      },
    });

    return products.map((item) => {
      const amount = amounts.find((a) => a.productId === item.id);
      return {
        ...item,
        price: item.price.toFixed(2),
        amount: amount?._sum.amount || 0,
        comment: "",
        total: mulTwoDecimals(amount?._sum.amount || 0, item.price).toFixed(2),
      };
    });
  }

  static findClosedOrders() {
    return this.prisma.order.findMany({
      where: {
        closed: true,
        day: {
          closed: false,
        },
      },
      orderBy: {
        closedAt: "desc",
      },
      include: {
        Table: {
          select: {
            name: true,
          },
        },
        creator: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
    });
  }

  static async findActiveTables() {
    const tables = await this.prisma.table.findMany({
      include: {
        orders: {
          where: {
            closed: false,
            day: {
              closed: false,
            },
          },
          include: {
            day: true,
            creator: {
              select: {
                id: true,
                username: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            orders: {
              where: {
                closed: false,
              },
            },
          },
        },
      },
    });
    return tables;
  }

  static async addOrder(name: string, tableId: number, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      const day = await DayController.currentDay(tx);
      const table = await tx.table.findUnique({
        where: { id: tableId },
      });

      if (!table) throw new Error("Table not found");

      if (!day) throw new Error("No day open");

      return await tx.order.create({
        data: {
          name,
          tableId,
          userId,
          dayId: day.id,
        },
      });
    });
  }

  static editOrder(id: number, name: string, tableId: number) {
    return this.prisma.$transaction(async (tx) => {
      const order = await this.getOrder(id, tx);
      if (!order) throw new Error("Order not found");
      const table = await tx.table.findUnique({
        where: { id: tableId },
      });
      if (!table) throw new Error("Table not found");

      return await tx.order.update({
        where: { id },
        data: {
          name,
          tableId,
        },
      });
    });
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
      where: { id },
      include: {
        OrderProduct: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
          orderBy: {
            product: {
              name: "asc",
            },
          },
        },
        creator: {
          select: {
            id: true,
            username: true,
            name: true,
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

  private static calculateTotal(
    orderProducts: { product: { price: Decimal }; amount: number }[]
  ) {
    return orderProducts.reduce((acc, item) => {
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
        comment: item.comment,
        price: item.product.price.toFixed(2),
        total: mulTwoDecimals(item.product.price, item.amount).toFixed(2),
      };
    });

    const total = this.calculateTotal(order.OrderProduct).toFixed(2);

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

  static reopenOrder(orderId: number) {
    return this.prisma.$transaction(async (tx) => {
      const order = await this.getOrder(orderId, tx);
      if (!order) throw new Error("Order not found");
      if (!order.closed) throw new Error("Order is not closed");

      return await tx.order.update({
        where: { id: orderId },
        data: {
          closed: false,
          closedAt: null,
          closedTotal: null,
        },
      });
    });
  }

  static async closeOrder(id: number) {
    await this.prisma.$transaction(
      async (tx) => {
        const order = await this.getOrder(id, tx);
        if (!order) throw new Error("Order not found");
        if (order.closed) throw new Error("Order is already closed");

        const total = this.calculateTotal(order.OrderProduct);

        await tx.order.update({
          where: { id },
          data: {
            closedAt: new Date(),
            closed: true,
            closedTotal: total,
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
      },
      { timeout: 20000 }
    );
  }
}
