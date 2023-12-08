import { PrismaClient } from "@prisma/client";

export class UserController {
  static prisma: PrismaClient;

  static {
    if (!this.prisma) {
      this.prisma = new PrismaClient();
    }
  }

  static async findOrCreateUser(username: string, name: string) {
    return await this.prisma.user.upsert({
      where: {
        username,
      },
      update: {
        username,
        name,
      },
      create: {
        username,
        name,
      },
    });
  }
}
