/*
  Warnings:

  - Made the column `total` on table `Day` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Day" ALTER COLUMN "total" SET NOT NULL,
ALTER COLUMN "total" SET DEFAULT 0;
