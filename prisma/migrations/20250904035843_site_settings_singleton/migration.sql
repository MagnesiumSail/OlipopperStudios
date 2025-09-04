/*
  Warnings:

  - A unique constraint covering the columns `[emailChangeNew]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailChangeNew" TEXT,
ADD COLUMN     "emailChangeTokenExpires" TIMESTAMP(3),
ADD COLUMN     "emailChangeTokenHash" VARCHAR(128);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "purchasingPaused" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_emailChangeNew_key" ON "User"("emailChangeNew");
