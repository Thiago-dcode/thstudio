import { Controller, Get, Param } from '@nestjs/common';
import { BrandsService } from './brands.service';
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  async index() {
    return await this.brandsService.getAll();
  }

  @Get('/:id')
  async show(@Param('id') id: string) {
    return await this.brandsService.getOne(id);
  }
}
