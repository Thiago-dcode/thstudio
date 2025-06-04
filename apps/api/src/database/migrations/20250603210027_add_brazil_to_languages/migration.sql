/*
  Warnings:

  - Changed the type of `code` on the `languages` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
ALTER TYPE "EnumLanguage" ADD VALUE 'BR';

-- AlterTable
ALTER TABLE "languages" DROP COLUMN "code",
ADD COLUMN     "code" "EnumLanguage" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "languages_code_key" ON "languages"("code");
