import { EnumMediaType } from '@database/generated/prisma';
import {
  Injectable,
  UnprocessableEntityException,
  PipeTransform,
} from '@nestjs/common';

const MAX_SIZE_MAP = {
  [EnumMediaType.IMAGE]: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  [EnumMediaType.VIDEO]: ['video/mp4', 'video/avi', 'video/mov'],
};
export interface FileValidationOptions {
  maxSize?:
    | number
    | {
        [key in EnumMediaType]: number;
      }; // in bytes
  allowedMimeTypes?: string[];
  required?: boolean;
}

@Injectable()
export class FileValidationPipe
  implements PipeTransform<Express.Multer.File, Express.Multer.File>
{
  constructor(
    public validationOptions: FileValidationOptions,
    public property: string = 'file',
  ) {}
  transform(file: Express.Multer.File) {
    const { maxSize, allowedMimeTypes, required } = this.validationOptions;
    const property = this.property;
    if (required && !file) {
      throw new UnprocessableEntityException([
        {
          property,
          message: `${property} is required`,
        },
      ]);
    }
    if (allowedMimeTypes && !allowedMimeTypes.includes(file.mimetype)) {
      throw new UnprocessableEntityException([
        {
          property,
          message: `${property} type is not allowed, allowed types: ${allowedMimeTypes.join(
            ', ',
          )}`,
        },
      ]);
    }
    //Should be last because its more computationally expensive
    if (maxSize) {
      if (typeof maxSize === 'number') {
        if (file.size > maxSize) {
          throw new UnprocessableEntityException([
            {
              property,
              message: `${property} size is too large, max size: ${maxSize} bytes`,
            },
          ]);
        }
      } else {
        const keys = Object.keys(maxSize);
        for (let index = 0; index < keys.length; index++) {
          const key = keys[index];

          if (MAX_SIZE_MAP[key].includes(file.mimetype)) {
            const _maxSize = maxSize[key];
            if (file.size > _maxSize) {
              throw new UnprocessableEntityException([
                {
                  property,
                  message: `${property} size ${
                    Math.round((file.size / 1024 / 1024) * 100) / 100
                  }MB is too large for ${key} type, max size: ${
                    Math.round((_maxSize / 1024 / 1024) * 100) / 100
                  }MB`,
                },
              ]);
            }
          }
        }
      }
    }

    return file;
  }
}
