-- AlterTable
ALTER TABLE "media" ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
