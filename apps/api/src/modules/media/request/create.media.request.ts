import { ModelExist } from '@common/validators/model-exist.validator';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

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
  user_id: number;

  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @ModelExist('Project')
  project_id?: number;

  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @ModelExist('Service')
  service_id?: number;

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  @IsInt({ each: true })
  @ModelExist('MediaCategory')
  categories?: number[];
}
