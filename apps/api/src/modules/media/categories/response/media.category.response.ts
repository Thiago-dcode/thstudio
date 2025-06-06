import {
  MediaCategory,
  MediaCategoryTranslation,
} from '@database/generated/prisma';
import { Expose } from 'class-transformer';
export type MediaCategoryResponseParam = MediaCategory & {
  translations: MediaCategoryTranslation[];
};
export class MediaCategoryResponse {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  description: string;
  @Expose()
  translations?: {
    name: string | null;
    description: string | null;
  };
  constructor(mediaCategory: MediaCategoryResponseParam) {
    this.id = mediaCategory.id;
    this.name = mediaCategory.name;
    this.description = mediaCategory.description;
    if (mediaCategory.translations.length > 0) {
      this.translations = {
        name: mediaCategory.translations[0].name,
        description: mediaCategory.translations[0].description,
      };
    }
  }
}
