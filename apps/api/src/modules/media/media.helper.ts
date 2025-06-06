import { Media } from '@database/generated/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MediaHelper {
  public buildPath(media: Media): string {
    return `media/${media.type}/${media.id}`;
  }
}
