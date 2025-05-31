import { User } from '@database/generated/prisma';
import { Expose } from 'class-transformer';

export class LoginResponse {
  @Expose()
  readonly name: string;
  @Expose()
  readonly username: string;

  @Expose()
  readonly email: string;

  @Expose()
  readonly token: string;

  constructor(user: User, token: string) {
    this.name = user.name;
    this.username = user.username;
    this.email = user.email;
    this.token = token;
  }
}
