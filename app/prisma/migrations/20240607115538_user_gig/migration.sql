/*
  Warnings:

  - You are about to drop the column `role` on the `Gigs` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Gigs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Gigs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gigs" DROP COLUMN "role",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Gigs_userId_key" ON "Gigs"("userId");

-- AddForeignKey
ALTER TABLE "Gigs" ADD CONSTRAINT "Gigs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
