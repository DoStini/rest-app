import { PrismaClient } from "@prisma/client";

export class ProductsController {
  static prisma: PrismaClient;

  static {
    if (!this.prisma) {
      this.prisma = new PrismaClient();
    }
  }

  static async listProducts() {
    return this.prisma.product.findMany();
  }

  static async listProductByCategoryWithOrder(orderId: number) {
    return this.prisma.category.findMany({
      include: {
        products: {
          include: {
            orderProduct: {
              where: {
                orderId,
              },
              select: {
                amount: true,
              },
            },
          },
        },
      },
    });
  }
}
