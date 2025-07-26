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
      where: { id, deleted: false },
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

  static deleteProduct(productId: number) {
    return this.prisma.$transaction(async (tx) => {
      await tx.orderProduct.deleteMany({
        where: {
          productId,
          order: {
            closed: false,
          },
        },
      });
      await tx.product.update({
        where: {
          id: productId,
        },
        data: {
          deleted: true,
        },
      });
    });
  }

  static updateProduct(productId: number, productInfo: CreateProductType) {
    return this.prisma.product.update({
      where: {
        id: productId,
        deleted: false,
      },
      data: productInfo,
    });
  }

  static async listProducts() {
    return this.prisma.product.findMany({
      where: {
        deleted: false,
      },
    });
  }

  static async listProductByCategory() {
    return this.prisma.category.findMany({
      where: {
        deleted: false,
      },
      include: {
        products: {
          where: {
            deleted: false,
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
          where: {
            deleted: false,
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
