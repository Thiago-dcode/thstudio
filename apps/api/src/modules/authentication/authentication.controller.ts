import { Controller, Post, Body } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginRequest } from './request/login.request';
import {  LoginResponse } from './response/login.response';
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('login')
  login(@Body() loginDto: LoginRequest): Promise<LoginResponse> {
    return this.authenticationService.login(loginDto);
  }
}
