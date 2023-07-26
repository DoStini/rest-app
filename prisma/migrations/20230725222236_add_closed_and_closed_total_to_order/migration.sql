-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "closed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "closedTotal" DECIMAL(12,2);
