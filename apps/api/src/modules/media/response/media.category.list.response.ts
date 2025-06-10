import {
  MediaCompactResponse,
  MediaCompactResponseParam,
} from './media.compact.response';

type MediaCompactListResponseParam = MediaCompactResponseParam & {
  url: string;
};
export class MediaCompactListResponse extends Array<MediaCompactResponse> {
  constructor(media: MediaCompactListResponseParam[]) {
    super();
    const mediaCompactResponse = media.map((media) => {
      return new MediaCompactResponse(media, media.url);
    });
    this.push(...mediaCompactResponse);
  }
}
