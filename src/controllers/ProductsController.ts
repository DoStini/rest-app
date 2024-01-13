import { CreateProductType } from "@/types/ProductTypes";
import { PrismaClient } from "@prisma/client";

export class ProductsController {
  static prisma: PrismaClient;

  static {
    if (!this.prisma) {
      this.prisma = new PrismaClient();
    }
  }

  static async findProductById(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  static async createManualProduct(name: string, price: number) {
    return this.prisma.product.create({
      data: {
        name,
        price,
        manual: true,
      },
    });
  }

  static createProduct(productInfo: CreateProductType) {
    return this.prisma.product.create({
      data: productInfo,
    });
  }

  static updateProduct(productId: number, productInfo: CreateProductType) {
    return this.prisma.product.update({
      where: {
        id: productId,
      },
      data: productInfo,
    });
  }

  static async listProducts() {
    return this.prisma.product.findMany();
  }

  static async listProductByCategory() {
    return this.prisma.category.findMany({
      include: {
        products: true,
      },
      orderBy: {
        position: "asc",
      },
    });
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
                comment: true,
              },
            },
          },
          orderBy: {
            name: "asc",
          },
        },
      },
      orderBy: {
        position: "asc",
      },
    });
  }
}
