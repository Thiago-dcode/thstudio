/*
  Warnings:

  - Added the required column `country_id` to the `languages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "languages" ADD COLUMN     "country_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "LanguageTranslation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "language_id" INTEGER NOT NULL,

    CONSTRAINT "LanguageTranslation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "languages" ADD CONSTRAINT "languages_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LanguageTranslation" ADD CONSTRAINT "LanguageTranslation_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
