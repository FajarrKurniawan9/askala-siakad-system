/*
  Warnings:

  - You are about to drop the column `certUrl` on the `Achievement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Achievement" DROP COLUMN "certUrl",
ADD COLUMN     "certificateUrl" TEXT;
