import { Injectable } from '@nestjs/common';

@Injectable()
export class BrandsService {
  async getOne(id: string) {
    return `Hello World brand ${id}`;
  }
  async getAll() {
    return 'Hello World from getAll';
  }
}
