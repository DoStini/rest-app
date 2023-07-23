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

  static async listProductByCategory() {
    return this.prisma.category.findMany({
      include: {
        products: true,
      },
    });
  }
}
