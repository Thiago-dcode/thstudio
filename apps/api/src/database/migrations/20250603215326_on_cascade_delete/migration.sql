-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_client_id_fkey";

-- DropForeignKey
ALTER TABLE "country_translations" DROP CONSTRAINT "country_translations_country_id_fkey";

-- DropForeignKey
ALTER TABLE "country_translations" DROP CONSTRAINT "country_translations_language_code_fkey";

-- DropForeignKey
ALTER TABLE "language_translations" DROP CONSTRAINT "language_translations_language_code_fkey";

-- DropForeignKey
ALTER TABLE "media_category_translations" DROP CONSTRAINT "media_category_translations_language_code_fkey";

-- DropForeignKey
ALTER TABLE "media_category_translations" DROP CONSTRAINT "media_category_translations_media_category_id_fkey";

-- DropForeignKey
ALTER TABLE "media_translations" DROP CONSTRAINT "media_translations_language_code_fkey";

-- DropForeignKey
ALTER TABLE "media_translations" DROP CONSTRAINT "media_translations_media_id_fkey";

-- DropForeignKey
ALTER TABLE "project_translations" DROP CONSTRAINT "project_translations_project_id_fkey";

-- DropForeignKey
ALTER TABLE "service_translations" DROP CONSTRAINT "service_translations_service_id_fkey";

-- AddForeignKey
ALTER TABLE "project_translations" ADD CONSTRAINT "project_translations_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_translations" ADD CONSTRAINT "service_translations_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_translations" ADD CONSTRAINT "media_translations_language_code_fkey" FOREIGN KEY ("language_code") REFERENCES "languages"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_translations" ADD CONSTRAINT "media_translations_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_category_translations" ADD CONSTRAINT "media_category_translations_language_code_fkey" FOREIGN KEY ("language_code") REFERENCES "languages"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_category_translations" ADD CONSTRAINT "media_category_translations_media_category_id_fkey" FOREIGN KEY ("media_category_id") REFERENCES "media_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "country_translations" ADD CONSTRAINT "country_translations_language_code_fkey" FOREIGN KEY ("language_code") REFERENCES "languages"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "country_translations" ADD CONSTRAINT "country_translations_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "language_translations" ADD CONSTRAINT "language_translations_language_code_fkey" FOREIGN KEY ("language_code") REFERENCES "languages"("code") ON DELETE CASCADE ON UPDATE CASCADE;
