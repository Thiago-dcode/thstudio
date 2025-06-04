/*
  Warnings:

  - You are about to drop the column `country_id` on the `languages` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "languages" DROP CONSTRAINT "languages_country_id_fkey";

-- AlterTable
ALTER TABLE "languages" DROP COLUMN "country_id";
