import { ModelExist } from '@common/validators/model-exist.validator';
import { IsOptional } from 'class-validator';
import { IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

export class BaseRequest {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ModelExist('Language', 'code')
  lan?: string;
}
