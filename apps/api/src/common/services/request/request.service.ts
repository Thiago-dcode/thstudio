import { Injectable, Scope } from '@nestjs/common';
import { User } from '@database/generated/prisma';

@Injectable({ scope: Scope.REQUEST })
export class RequestService {
  private _user: User;
  constructor() {}
  get user(): User {
    return this._user;
  }
  set user(user: User) {
    this._user = user;
  }
}
