import { Expose } from 'class-transformer';
import { EnumMediaType, EnumMediaShape } from '@database/generated/prisma';
import {
  MediaCategoryCompactListParam,
  MediaCategoryCompactListResponse,
} from '../categories/response/media.category.compact.list.response';
export type MediaCompactResponseParam = {
  id: number;
  title: string;
  type: EnumMediaType;
  shape: EnumMediaShape;
  
  projectId?: number;
  serviceId?: number;
  userId?: number;
  tags: string[];
  categories?: MediaCategoryCompactListParam;
};
export class MediaCompactResponse {
  @Expose()
  id: number;
  @Expose()
  title: string;
  @Expose()
  type: EnumMediaType;
  @Expose()
  shape: EnumMediaShape;
  @Expose()
  url: string;
  @Expose()
  tags: string[];

  categories: MediaCategoryCompactListResponse;
  constructor(media: MediaCompactResponseParam, url: string) {
    this.id = media.id;
    this.title = media.title;
    this.type = media.type;
    this.shape = media.shape;
    this.url = url;
    this.tags = media.tags;
    this.categories = new MediaCategoryCompactListResponse(media.categories);
  }
}
