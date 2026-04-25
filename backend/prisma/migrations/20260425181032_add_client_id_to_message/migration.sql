/*
  Warnings:

  - A unique constraint covering the columns `[clientId]` on the table `Message` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clientId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "clientId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Message_clientId_key" ON "Message"("clientId");
