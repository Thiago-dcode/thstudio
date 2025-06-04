/*
  Warnings:

  - The primary key for the `languages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `languages` table. All the data in the column will be lost.
  - You are about to drop the `Country` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CountryTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LanguageTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MediaCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MediaCategoryTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MediaTranslation` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `language_id` on the `project_translations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `language_id` on the `service_translations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "CountryTranslation" DROP CONSTRAINT "CountryTranslation_country_id_fkey";

-- DropForeignKey
ALTER TABLE "CountryTranslation" DROP CONSTRAINT "CountryTranslation_language_id_fkey";

-- DropForeignKey
ALTER TABLE "LanguageTranslation" DROP CONSTRAINT "LanguageTranslation_language_id_fkey";

-- DropForeignKey
ALTER TABLE "MediaCategoryTranslation" DROP CONSTRAINT "MediaCategoryTranslation_language_id_fkey";

-- DropForeignKey
ALTER TABLE "MediaCategoryTranslation" DROP CONSTRAINT "MediaCategoryTranslation_media_category_id_fkey";

-- DropForeignKey
ALTER TABLE "MediaTranslation" DROP CONSTRAINT "MediaTranslation_language_id_fkey";

-- DropForeignKey
ALTER TABLE "MediaTranslation" DROP CONSTRAINT "MediaTranslation_media_id_fkey";

-- DropForeignKey
ALTER TABLE "_MediaToMediaCategory" DROP CONSTRAINT "_MediaToMediaCategory_B_fkey";

-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_country_id_fkey";

-- DropForeignKey
ALTER TABLE "project_translations" DROP CONSTRAINT "project_translations_language_id_fkey";

-- DropForeignKey
ALTER TABLE "service_translations" DROP CONSTRAINT "service_translations_language_id_fkey";

-- AlterTable
ALTER TABLE "languages" DROP CONSTRAINT "languages_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "languages_pkey" PRIMARY KEY ("code");

-- AlterTable
ALTER TABLE "project_translations" DROP COLUMN "language_id",
ADD COLUMN     "language_id" "EnumLanguage" NOT NULL;

-- AlterTable
ALTER TABLE "service_translations" DROP COLUMN "language_id",
ADD COLUMN     "language_id" "EnumLanguage" NOT NULL;

-- DropTable
DROP TABLE "Country";

-- DropTable
DROP TABLE "CountryTranslation";

-- DropTable
DROP TABLE "LanguageTranslation";

-- DropTable
DROP TABLE "MediaCategory";

-- DropTable
DROP TABLE "MediaCategoryTranslation";

-- DropTable
DROP TABLE "MediaTranslation";

-- CreateTable
CREATE TABLE "media_translations" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "language_id" "EnumLanguage" NOT NULL,
    "media_id" INTEGER NOT NULL,

    CONSTRAINT "media_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryType" "EnumMediaType" NOT NULL,

    CONSTRAINT "media_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_category_translations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "language_id" "EnumLanguage" NOT NULL,
    "media_category_id" INTEGER NOT NULL,

    CONSTRAINT "media_category_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "country_translations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "language_id" "EnumLanguage" NOT NULL,
    "country_id" INTEGER NOT NULL,

    CONSTRAINT "country_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "language_translations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "language_id" "EnumLanguage" NOT NULL,

    CONSTRAINT "language_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "countries_code_key" ON "countries"("code");

-- CreateIndex
CREATE UNIQUE INDEX "countries_name_key" ON "countries"("name");

-- CreateIndex
CREATE UNIQUE INDEX "country_translations_name_key" ON "country_translations"("name");

-- AddForeignKey
ALTER TABLE "project_translations" ADD CONSTRAINT "project_translations_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_translations" ADD CONSTRAINT "service_translations_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_translations" ADD CONSTRAINT "media_translations_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_translations" ADD CONSTRAINT "media_translations_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_category_translations" ADD CONSTRAINT "media_category_translations_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_category_translations" ADD CONSTRAINT "media_category_translations_media_category_id_fkey" FOREIGN KEY ("media_category_id") REFERENCES "media_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "country_translations" ADD CONSTRAINT "country_translations_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "country_translations" ADD CONSTRAINT "country_translations_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "language_translations" ADD CONSTRAINT "language_translations_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaToMediaCategory" ADD CONSTRAINT "_MediaToMediaCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "media_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
