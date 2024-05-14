/*
  Warnings:

  - You are about to drop the `candidate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "candidate";

-- CreateTable
CREATE TABLE "Candidate" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "github" TEXT,
    "resume" TEXT,
    "linkedin" TEXT,
    "roles" TEXT[],
    "commitment" TEXT[],
    "opportunity" TEXT,
    "introduction" TEXT,
    "twitter" TEXT,
    "minIncome" INTEGER,
    "referralID" TEXT,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);
