-- AlterTable
ALTER TABLE "media" ADD COLUMN     "address_id" INTEGER;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
