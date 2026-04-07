/*
  Warnings:

  - A unique constraint covering the columns `[smartAccountAddress]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authProvider" TEXT,
ADD COLUMN     "smartAccountAddress" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_smartAccountAddress_key" ON "User"("smartAccountAddress");
