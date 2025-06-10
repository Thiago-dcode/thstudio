import { ModelExist } from '@common/validators/model-exist.validator';
import {
  isArray,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ModelArrayExist } from '@common/validators/model-array-exist.validator';

export class CreateMediaRequest {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  @ModelExist('User', 'id')
  userId: number;

  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @ModelExist('Project')
  projectId?: number;

  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @ModelExist('Service')
  serviceId?: number;

  @Transform(({ value }) =>
    value ? (Array.isArray(value) ? value.map(Number) : [Number(value)]) : [],
  )
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  @IsInt({ each: true })
  @ModelArrayExist('MediaCategory', 'id')
  categories?: number[];

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];

  @Transform(({ value }) => value == '1' || value === true)
  @IsBoolean()
  @IsOptional()
  addWatermark?: boolean;
}
