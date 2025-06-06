import { PartialType } from '@nestjs/swagger';
import { CreateMediaRequest } from './create.media.request';

export class UpdateMediaRequest extends PartialType(CreateMediaRequest) {}
