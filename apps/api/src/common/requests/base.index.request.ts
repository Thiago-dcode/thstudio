import { IsBoolean, IsOptional } from 'class-validator';
import { BaseRequest } from './Base.request';

export class BaseIndexRequest extends BaseRequest {
  @IsOptional()
  @IsBoolean()
  pagination: boolean = true;

  @IsOptional()
  @IsBoolean()
  withTranslations: boolean = false;
}
