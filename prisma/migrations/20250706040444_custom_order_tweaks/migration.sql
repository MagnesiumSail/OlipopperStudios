/*
  Warnings:

  - You are about to drop the column `occasion` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "occasion",
DROP COLUMN "sessionId";
