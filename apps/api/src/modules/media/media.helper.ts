import { Media } from '@database/generated/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MediaHelper {
  public buildPath(media: Pick<Media, 'type' | 'id'>): string {
    return `media/${media.type}/${media.id}`;
  }

}
