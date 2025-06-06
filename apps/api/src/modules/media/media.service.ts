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
import { Prisma } from '@database/generated/prisma';

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

  findAll(indexMediaRequest: IndexMediaRequest) {
    const { type, shape, userId, categories } = indexMediaRequest;

    return `This action returns all media`;
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
    });
    if (!media) {
      throw new InternalServerErrorException('Failed to create media');
    }
    try {
      //compress image
      if (media.type === 'IMAGE') {
        file.buffer = await this.storageService.optimizeImageToWebp(
          file,
          90,
          1 * 1024 * 1024,
        );
      } else if (media.type === 'VIDEO') {
        //TODO: compress video
      }
      const url = await this.storageService.uploadAndGetFile(
        file,
        this.mediaHelper.buildPath(media),
      );
      return this.findOne(media.id);
    } catch (error) {
      await this.prisma.media.delete({
        where: {
          id: media.id,
        },
      });
      throw error;
    }
  }
  update(
    id: number,
    updateMediaRequest: UpdateMediaRequest,
    file: Express.Multer.File,
  ) {
    console.log(updateMediaRequest);
    console.log(file);
    return `This action updates a #${id} media`;
  }

  remove(id: number) {
    return `This action removes a #${id} media`;
  }
}
