import {
  Injectable,
  Inject,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateMediaRequest } from './request/create.media.request';
import { PrismaService } from '@common/services/db/prisma.service';
import { STORAGE_SERVICE } from '@common/services/storage/storage.config';
import { StorageService } from '@common/services/storage/StorageService';
import { UpdateMediaRequest } from './request/update.media.request';
import { MediaResponse } from './response/media.response';
import { RequestService } from '@common/services/request/request.service';
import { MediaHelper } from './media.helper';
import { IndexMediaRequest } from './request/index.media.request';
import { MediaCompactListResponse } from './response/media.category.list.response';
import { Media } from '@database/generated/prisma';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  constructor(
    private readonly prisma: PrismaService,
    @Inject(STORAGE_SERVICE)
    private readonly storageService: StorageService,
    private readonly requestService: RequestService,
    private readonly mediaHelper: MediaHelper,
  ) {}

  async findAll(indexMediaRequest: IndexMediaRequest) {
    const { type, shape, userId, categories } = indexMediaRequest;
    const media = await this.prisma.media.findMany({
      select: {
        id: true,
        title: true,
        type: true,
        shape: true,
        projectId: true,
        serviceId: true,
        userId: true,
        tags: true,
        categories: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        type,
        shape,
        userId,
        categories: categories
          ? {
              some: {
                id: {
                  in: categories,
                },
              },
            }
          : undefined,
      },
    });

    if (!media) {
      throw new NotFoundException('Media not found');
    }
    const mediaWithUrl = await Promise.all(
      media.map(async (media) => {
        const url = await this.storageService.getFile(
          this.mediaHelper.buildPath(media),
        );
        return {
          ...media,
          url,
        };
      }),
    );

    return new MediaCompactListResponse(mediaWithUrl);
  }

  async findOne(id: number) {
    const media = await this.prisma.media.findUnique({
      where: {
        id,
      },
      include: {
        address: true,
        translations: {
          where: {
            languageCode: this.requestService.language,
          },
        },
        categories: {
          include: {
            translations: {
              where: {
                languageCode: this.requestService.language,
              },
            },
          },
        },
      },
    });
    if (!media) {
      throw new NotFoundException('Media not found');
    }

    const url = await this.storageService.getFile(
      this.mediaHelper.buildPath(media),
    );
    return new MediaResponse(media, url);
  }
  async create(
    createMediaRequest: CreateMediaRequest,
    file: Express.Multer.File,
  ) {
    const {
      title,
      description,
      userId,
      projectId,
      serviceId,
      categories,
      tags,
      addWatermark,
    } = createMediaRequest;
    const type = this.storageService.getType(file);
    if (!type) {
      throw new BadRequestException('Invalid file type');
    }
    const shape = this.storageService.getShape(file);
    const media = await this.prisma.media.create({
      data: {
        userId,
        projectId,
        serviceId,
        type,
        shape,
        title,
        description,
        categories: {
          connect: categories?.map((id) => ({ id })),
        },
        tags: tags || [],
      },
      include: {
        categories: {
          include: {
            translations: {
              where: {
                languageCode: this.requestService.language,
              },
            },
          },
        },
        translations: {
          where: {
            languageCode: this.requestService.language,
          },
        },
      },
    });
    if (!media) {
      throw new InternalServerErrorException('Failed to create media');
    }
    try {
      const url = await this.handleMediaStorage(media, file, addWatermark);
      return new MediaResponse(media, url);
    } catch (error) {
      await this.prisma.media.delete({
        where: {
          id: media.id,
        },
      });
      throw error;
    }
  }
  async update(
    id: number,
    updateMediaRequest: UpdateMediaRequest,
    file: Express.Multer.File,
  ) {
    const {
      title,
      description,
      categories,
      tags,
      projectId,
      serviceId,
      userId,
      addWatermark,
    } = updateMediaRequest;
    console.log('file', file);
    let media = await this.prisma.media.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            translations: {
              where: {
                languageCode: this.requestService.language,
              },
            },
          },
        },
        translations: {
          where: {
            languageCode: this.requestService.language,
          },
        },
      },
    });
    if (!media) {
      throw new NotFoundException('Media not found');
    }
    const type = file ? this.storageService.getType(file) : media.type;
    const shape = file ? this.storageService.getShape(file) : media.shape;
    media = await this.prisma.media.update({
      where: { id },
      data: {
        title,
        description,
        projectId,
        serviceId,
        shape,
        type,
        userId,
        categories: {
          set: categories?.map((id) => ({ id, categoryType: type })),
          disconnect: media.categories
            .filter((category) => !categories?.includes(category.id))
            .map((category) => ({ id: category.id })),
        },
        tags: tags || [],
      },
      include: {
        categories: {
          include: {
            translations: {
              where: {
                languageCode: this.requestService.language,
              },
            },
          },
        },
        translations: {
          where: {
            languageCode: this.requestService.language,
          },
        },
      },
    });
    if (!media) {
      throw new NotFoundException('Media not found');
    }
    let url: string;
    if (!file) {
      url = await this.storageService.getFile(
        this.mediaHelper.buildPath(media),
      );
    } else {
      url = await this.handleMediaStorage(media, file, addWatermark);
    }
    return new MediaResponse(media, url);
  }

  async bulkCreate(
    csv: Express.Multer.File,
    files: Express.Multer.File[],
  ) {
    const csvData = await this.storageService.getFileBuffer(csv.path);
  
  }

  async remove(id: number) {
    const media = await this.prisma.media.findUnique({
      where: { id },
    });
    if (!media) {
      throw new NotFoundException('Media not found');
    }
    await this.prisma.media.delete({
      where: { id },
    });
    await this.storageService.deleteFile(this.mediaHelper.buildPath(media));
    return media;
  }
  async handleMediaStorage(
    media: Media,
    file: Express.Multer.File,
    addWatermark: boolean,
  ) {
    if (media.type === 'IMAGE') {
      file.buffer = await this.storageService.optimizeImageToWebp(
        file,
        90,
        1 * 1024 * 1024,
      );
      if (addWatermark) {
        try {
          const watermarkBuffer =
            await this.storageService.getFileBuffer('media/watermark');
          file.buffer = await this.storageService.addWatermark(
            file.buffer,
            watermarkBuffer,
          );
        } catch (error) {
          throw new InternalServerErrorException(
            'Failed to add watermark to image',
          );
        }
      }
    } else if (media.type === 'VIDEO') {
      // file.buffer = await this.storageService.optimizeVideo(file);
    }
    const url = await this.storageService.uploadAndGetFile(
      file,
      this.mediaHelper.buildPath(media),
    );
    return url;
  }
}
