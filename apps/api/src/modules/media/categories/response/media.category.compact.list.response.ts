import {
  MediaCategoryCompactResponse,
  MediaCategoryCompactResponseParam,
} from './media.category.compact.response';

export type MediaCategoryCompactListParam = MediaCategoryCompactResponseParam[];

export class MediaCategoryCompactListResponse extends Array<MediaCategoryCompactResponse> {
  constructor(mediaCategory: MediaCategoryCompactListParam) {
    super();
    const categories = mediaCategory.map(
      (category) => new MediaCategoryCompactResponse(category),
    );
    this.push(...categories);
  }
}
