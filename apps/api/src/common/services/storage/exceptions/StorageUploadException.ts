import { HttpException, HttpStatus } from '@nestjs/common';

export class StorageUploadException extends HttpException {
  constructor(response: string | Record<string, any>) {
    super(response, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
