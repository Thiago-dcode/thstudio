import { HttpException, HttpStatus } from '@nestjs/common';

export class StorageException extends HttpException {
  constructor(
    message: string | Record<string, any>,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(message, status);
  }
}
