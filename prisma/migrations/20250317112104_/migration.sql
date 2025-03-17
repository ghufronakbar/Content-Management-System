/*
  Warnings:

  - You are about to drop the column `confirmed` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `pending` on the `Article` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED');

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "confirmed",
DROP COLUMN "pending",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDING';
