import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { ConflictException } from '../exceptions/ConflictException';
import { UnauthorizedException } from '../exceptions/UnauthorizedException';
import TokenService from './TokenService';
import type { LoginBody } from '../schemas/auth.schema';

interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: { id: number; email: string };
}

export default class AuthService {
  static async register({ email, password }: LoginBody): Promise<AuthResult> {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { email, password: hashed } });

    const accessToken = TokenService.signAccess(user.id);
    const refreshToken = TokenService.signRefresh(user.id);
    await TokenService.store(user.id, refreshToken);

    return { accessToken, refreshToken, user: { id: user.id, email: user.email } };
  }

  static async login({ email, password }: LoginBody): Promise<AuthResult> {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = TokenService.signAccess(user.id);
    const refreshToken = TokenService.signRefresh(user.id);
    await TokenService.store(user.id, refreshToken);

    return { accessToken, refreshToken, user: { id: user.id, email: user.email } };
  }

  static async refresh(
    token: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return TokenService.rotate(token);
  }

  static async logout(token: string): Promise<void> {
    await TokenService.revoke(token);
  }
}
