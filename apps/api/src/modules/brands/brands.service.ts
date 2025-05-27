import { Injectable } from '@nestjs/common';
import { Brand } from '@repo/types';
@Injectable()
export class BrandsService {
  async getOne(id: string): Promise<Brand> {
    return {
      id,
      name: `Brand ${id}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
  async getAll(): Promise<Brand[]> {
    return [];
  }
}
