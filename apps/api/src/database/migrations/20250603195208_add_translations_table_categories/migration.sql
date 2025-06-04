-- AlterTable
ALTER TABLE "languages" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "MediaTranslation" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "language_id" INTEGER NOT NULL,
    "media_id" INTEGER NOT NULL,

    CONSTRAINT "MediaTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryType" "EnumMediaType" NOT NULL,

    CONSTRAINT "MediaCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaCategoryTranslation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "language_id" INTEGER NOT NULL,
    "media_category_id" INTEGER NOT NULL,

    CONSTRAINT "MediaCategoryTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MediaToMediaCategory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MediaToMediaCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MediaToMediaCategory_B_index" ON "_MediaToMediaCategory"("B");

-- AddForeignKey
ALTER TABLE "MediaTranslation" ADD CONSTRAINT "MediaTranslation_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaTranslation" ADD CONSTRAINT "MediaTranslation_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaCategoryTranslation" ADD CONSTRAINT "MediaCategoryTranslation_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaCategoryTranslation" ADD CONSTRAINT "MediaCategoryTranslation_media_category_id_fkey" FOREIGN KEY ("media_category_id") REFERENCES "MediaCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaToMediaCategory" ADD CONSTRAINT "_MediaToMediaCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaToMediaCategory" ADD CONSTRAINT "_MediaToMediaCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "MediaCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
