/*
  Warnings:

  - Made the column `source` on table `Application` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "url" TEXT,
ALTER COLUMN "source" SET NOT NULL;
