import {
  MediaCategory,
  MediaCategoryTranslation,
} from '@database/generated/prisma';
import { MediaCategoryResponse } from './media.category.response';

export type MediaCategoryListParam = (MediaCategory & {
  translations: MediaCategoryTranslation[];
})[];

export class MediaCategoryListResponse extends Array<MediaCategoryResponse> {
  constructor(mediaCategory: MediaCategoryListParam) {
    super();
    const categories = mediaCategory.map(
      (category) => new MediaCategoryResponse(category),
    );
    this.push(...categories);
  }
}
