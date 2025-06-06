import { Controller, Get, Param } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { ApiParam } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';
import { Brand } from '@repo/types';
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  async index() {
    return await this.brandsService.getAll();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get a brand by ID' })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the brand' })
  @ApiResponse({
    status: 200,
    description: 'The brand has been successfully retrieved.',
    type: 'object',
  })
  @ApiResponse({
    status: 404,
    description: 'The brand with the given ID was not found.',
  })
  async show(@Param('id') id: string) {
    return await this.brandsService.getOne(id);
  }
}
