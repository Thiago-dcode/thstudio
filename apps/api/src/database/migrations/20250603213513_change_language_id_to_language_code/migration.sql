/*
  Warnings:

  - You are about to drop the column `language_id` on the `country_translations` table. All the data in the column will be lost.
  - You are about to drop the column `language_id` on the `language_translations` table. All the data in the column will be lost.
  - You are about to drop the column `language_id` on the `media_category_translations` table. All the data in the column will be lost.
  - You are about to drop the column `language_id` on the `media_translations` table. All the data in the column will be lost.
  - You are about to drop the column `language_id` on the `project_translations` table. All the data in the column will be lost.
  - You are about to drop the column `language_id` on the `service_translations` table. All the data in the column will be lost.
  - Added the required column `language_code` to the `country_translations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language_code` to the `language_translations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language_code` to the `media_category_translations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language_code` to the `media_translations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language_code` to the `project_translations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language_code` to the `service_translations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "country_translations" DROP CONSTRAINT "country_translations_language_id_fkey";

-- DropForeignKey
ALTER TABLE "language_translations" DROP CONSTRAINT "language_translations_language_id_fkey";

-- DropForeignKey
ALTER TABLE "media_category_translations" DROP CONSTRAINT "media_category_translations_language_id_fkey";

-- DropForeignKey
ALTER TABLE "media_translations" DROP CONSTRAINT "media_translations_language_id_fkey";

-- DropForeignKey
ALTER TABLE "project_translations" DROP CONSTRAINT "project_translations_language_id_fkey";

-- DropForeignKey
ALTER TABLE "service_translations" DROP CONSTRAINT "service_translations_language_id_fkey";

-- AlterTable
ALTER TABLE "country_translations" DROP COLUMN "language_id",
ADD COLUMN     "language_code" "EnumLanguage" NOT NULL;

-- AlterTable
ALTER TABLE "language_translations" DROP COLUMN "language_id",
ADD COLUMN     "language_code" "EnumLanguage" NOT NULL;

-- AlterTable
ALTER TABLE "media_category_translations" DROP COLUMN "language_id",
ADD COLUMN     "language_code" "EnumLanguage" NOT NULL;

-- AlterTable
ALTER TABLE "media_translations" DROP COLUMN "language_id",
ADD COLUMN     "language_code" "EnumLanguage" NOT NULL;

-- AlterTable
ALTER TABLE "project_translations" DROP COLUMN "language_id",
ADD COLUMN     "language_code" "EnumLanguage" NOT NULL;

-- AlterTable
ALTER TABLE "service_translations" DROP COLUMN "language_id",
ADD COLUMN     "language_code" "EnumLanguage" NOT NULL;

-- AddForeignKey
ALTER TABLE "project_translations" ADD CONSTRAINT "project_translations_language_code_fkey" FOREIGN KEY ("language_code") REFERENCES "languages"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_translations" ADD CONSTRAINT "service_translations_language_code_fkey" FOREIGN KEY ("language_code") REFERENCES "languages"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_translations" ADD CONSTRAINT "media_translations_language_code_fkey" FOREIGN KEY ("language_code") REFERENCES "languages"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_category_translations" ADD CONSTRAINT "media_category_translations_language_code_fkey" FOREIGN KEY ("language_code") REFERENCES "languages"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "country_translations" ADD CONSTRAINT "country_translations_language_code_fkey" FOREIGN KEY ("language_code") REFERENCES "languages"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "language_translations" ADD CONSTRAINT "language_translations_language_code_fkey" FOREIGN KEY ("language_code") REFERENCES "languages"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
