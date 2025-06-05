import { Injectable, Scope } from '@nestjs/common';
import { User, EnumLanguage } from '@database/generated/prisma';

@Injectable({ scope: Scope.REQUEST })
export class RequestService {
  private _user: User;
  private _language: EnumLanguage;
  constructor() {}
  get user(): User {
    return this._user;
  }
  set user(user: User) {
    this._user = user;
  }
  get language(): EnumLanguage {
    return this._language;
  }
  set language(language: EnumLanguage) {
    this._language = language;
  }
}
