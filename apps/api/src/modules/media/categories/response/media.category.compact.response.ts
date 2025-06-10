import {
  MediaCategory,
} from '@database/generated/prisma';
import { Expose } from 'class-transformer';
export type MediaCategoryCompactResponseParam = Pick<
  MediaCategory,
  'id' | 'name'
>;
export class MediaCategoryCompactResponse {
  @Expose()
  id: number;
  @Expose()
  name: string;

  constructor(mediaCategory: MediaCategoryCompactResponseParam) {
    this.id = mediaCategory.id;
    this.name = mediaCategory.name;
  }
}
