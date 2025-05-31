import { ModelExist } from '@common/validators/ModelExist.validator';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
export class CreateMediaDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  @ModelExist('User','id')
  user_id: number;

  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @ModelExist('Project')
  project_id: number;

  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @ModelExist('Service')
  service_id: number;
}
