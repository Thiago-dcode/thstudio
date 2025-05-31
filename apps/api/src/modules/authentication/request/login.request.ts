import { ModelExist } from '@common/validators/model-exist.validator';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequest {
  @IsNotEmpty()
  @IsString()
  @ModelExist('User', 'username')
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
