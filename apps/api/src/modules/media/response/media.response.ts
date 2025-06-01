import { Expose } from 'class-transformer';
import { Media } from '@database/generated/prisma';
import { EnumMediaType, EnumMediaShape } from '@database/generated/prisma';
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
  constructor(media: Media, url: string) {
    this.id = media.id;
    this.title = media.title;
    this.description = media.description;
    this.type = media.type;
    this.shape = media.shape;
    this.url = url;
  }
}
