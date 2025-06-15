import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaRequest } from './request/create.media.request';
import { UpdateMediaRequest } from './request/update.media.request';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  FileValidationPipe,
  FileValidationOptions,
} from '@common/pipes/file-validation.pipe';
import { EnumMediaType } from '@database/generated/prisma/client';
import { IndexMediaRequest } from './request/index.media.request';

const validationOptions = (required: boolean): FileValidationOptions => {
  return {
    required,
    maxSize: {
      [EnumMediaType.IMAGE]: 10 * 1024 * 1024, // 10MB
      [EnumMediaType.VIDEO]: 100 * 1024 * 1024, // 100MB
    },
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'video/mp4'],
  };
};

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  index(@Query() indexMediaRequest: IndexMediaRequest) {
    return this.mediaService.findAll(indexMediaRequest);
  }

  @Get(':id')
  show(@Param('id') id: string) {
    return this.mediaService.findOne(+id);
  }
  @Post()
  @UseInterceptors(FileInterceptor('media'))
  create(
    @Body() createMediaRequest: CreateMediaRequest,
    @UploadedFile(new FileValidationPipe(validationOptions(true), 'media'))
    file: Express.Multer.File,
  ) {
    return this.mediaService.create(createMediaRequest, file);
  }


  @Patch(':id')
  @UseInterceptors(FileInterceptor('media'))
  update(
    @Param('id') id: string,
    @Body() updateMediaRequest: UpdateMediaRequest,
    @UploadedFile(new FileValidationPipe(validationOptions(false), 'media'))
    file: Express.Multer.File,
  ) {
    return this.mediaService.update(+id, updateMediaRequest, file);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaService.remove(+id);
  }
}
