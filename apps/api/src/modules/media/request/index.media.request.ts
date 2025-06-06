import { BaseIndexRequest } from '@common/requests/base.index.request';
import { IsArray, IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { IsOptional } from 'class-validator';
import {
  EnumMediaShape,
  EnumMediaType,
} from '@database/generated/prisma/client';
import { IsEnum } from 'class-validator';
import { ModelExist } from '@common/validators/model-exist.validator';
import { ModelArrayExist } from '@common/validators/model-array-exist.validator';

export class IndexMediaRequest extends BaseIndexRequest {
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(EnumMediaType)
  type?: EnumMediaType;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(EnumMediaShape)
  shape?: EnumMediaShape;

  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @ModelExist('User', 'id')
  userId?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  @ModelArrayExist('MediaCategory', 'id')
  categories?: number[];
}
