import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@common/services/db/prisma.service';
import { LoginRequest } from './request/login.request';
import { LoginResponse } from './response/login.response';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthenticationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginRequest) {
    const user = await this.prisma.user.findUnique({
      where: { username: loginDto.username },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, username: user.username };
    const token = await this.jwtService.signAsync(payload);
    return new LoginResponse(user, token);
  }
}
