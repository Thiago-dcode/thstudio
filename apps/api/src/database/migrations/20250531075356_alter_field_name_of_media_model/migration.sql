/*
  Warnings:

  - You are about to drop the column `name` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `media` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "media_name_key";

-- DropIndex
DROP INDEX "media_url_key";

-- AlterTable
ALTER TABLE "media" DROP COLUMN "name",
DROP COLUMN "url",
ADD COLUMN     "title" TEXT;
