import {
  Injectable,
  Inject,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateMediaRequest } from './request/create.media.request';
import { PrismaService } from '@common/services/db/prisma.service';
import { STORAGE_SERVICE } from '@common/services/storage/storage.config';
import { StorageService } from '@common/services/storage/StorageService';
import { UpdateMediaRequest } from './request/update.media.reques';
import { MediaResponse } from './response/media.response';

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(STORAGE_SERVICE)
    private readonly storageService: StorageService,
  ) {}

  async create(
    createMediaRequest: CreateMediaRequest,
    file: Express.Multer.File,
  ) {
    const { title, description, user_id, project_id, service_id } =
      createMediaRequest;
    const type = this.storageService.getType(file);
    if (!type) {
      throw new BadRequestException('Invalid file type');
    }
    const shape = this.storageService.getShape(file);
    const media = await this.prisma.media.create({
      data: {
        userId: user_id,
        projectId: project_id,
        serviceId: service_id,
        type,
        shape,
        title,
        description,
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
        `media/${media.type}/${media.id}`,
      );
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
  findAll() {
    return `This action returns all media`;
  }

  findOne(id: number) {
    return `This action returns a #${id} media`;
  }

  update(
    id: number,
    updateMediaRequest: UpdateMediaRequest,
    file: Express.Multer.File,
  ) {
    return `This action updates a #${id} media`;
  }

  remove(id: number) {
    return `This action removes a #${id} media`;
  }
}
