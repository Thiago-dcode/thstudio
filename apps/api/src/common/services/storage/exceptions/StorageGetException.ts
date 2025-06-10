import { HttpStatus } from '@nestjs/common';
import { StorageException } from './StorageException';

export class StorageGetException extends StorageException {
  constructor(response: string | Record<string, any>) {
    super(response, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
