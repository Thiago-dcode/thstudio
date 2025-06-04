import { Injectable, Scope } from '@nestjs/common';
import { Language, User } from '@database/generated/prisma';

@Injectable({ scope: Scope.REQUEST })
export class RequestService {
  private _user: User;
  private _language: Language;
  constructor() {}
  get user(): User {
    return this._user;
  }
  set user(user: User) {
    this._user = user;
  }
  get language(): Language {
    return this._language;
  }
  set language(language: Language) {
    this._language = language;
  }
}
