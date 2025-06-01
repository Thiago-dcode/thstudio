import { User, Role } from '@database/generated/prisma';
import { Expose } from 'class-transformer';

export class LoginResponse {
  @Expose()
  readonly id: number;
  @Expose()
  readonly name: string;
  @Expose()
  readonly username: string;

  @Expose()
  readonly email: string;
  @Expose()
  readonly role: {
    id: number;
    name: string;
  };
  @Expose()
  readonly token: string;

  constructor(user: User, role: Role, token: string) {
    this.id = user.id;
    this.name = user.name;
    this.username = user.username;
    this.email = user.email;
    this.role = {
      id: role.id,
      name: role.name,
    };
    this.token = token;
  }
}
