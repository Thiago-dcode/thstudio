import { Expose } from 'class-transformer';
import {
  Media,
  MediaTranslation,
} from '@database/generated/prisma';
import { EnumMediaType, EnumMediaShape } from '@database/generated/prisma';
import {
  MediaCategoryListParam,
  MediaCategoryListResponse,
} from '../categories/response/media.category.list.response';
export class MediaResponse {
  @Expose()
  id: number;
  @Expose()
  title: string;
  @Expose()
  description: string;
  @Expose()
  type: EnumMediaType;
  @Expose()
  shape: EnumMediaShape;
  @Expose()
  url: string;
  @Expose()
  tags: string[];
  @Expose()
  translation?: {
    title: string | null;
    description: string | null;
  };
  
  categories: MediaCategoryListResponse;
  constructor(
    media: Media & {
      translations: MediaTranslation[];
      categories: MediaCategoryListParam;
    },
    url: string,
  ) {
    this.id = media.id;
    this.title = media.title;
    this.description = media.description;
    this.type = media.type;
    this.shape = media.shape;
    this.url = url;
    this.tags = media.tags;
    if (media.translations.length > 0) {
      this.translation = {
        title: media.translations[0].title,
        description: media.translations[0].description,
      };
    }
    this.categories = new MediaCategoryListResponse(media.categories);
  }
}
