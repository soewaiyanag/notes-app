import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { ConflictException } from '../exceptions/ConflictException';
import { UnauthorizedException } from '../exceptions/UnauthorizedException';
import TokenService from './TokenService';
import EmailService from './EmailService';
import type {
  LoginBody,
  ForgotPasswordBody,
  ResetPasswordBody,
  ChangePasswordBody,
} from '../schemas/auth.schema';

const RESET_TOKEN_EXPIRES_MS = 60 * 60 * 1000; // 1 hour

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

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

  // Always resolves without revealing whether the email is registered.
  static async forgotPassword({ email }: ForgotPasswordBody): Promise<void> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return;

    const rawToken = crypto.randomBytes(32).toString('hex');

    await prisma.passwordResetToken.create({
      data: {
        tokenHash: hashToken(rawToken),
        userId: user.id,
        expiresAt: new Date(Date.now() + RESET_TOKEN_EXPIRES_MS),
      },
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`;
    await EmailService.sendPasswordResetEmail(email, resetUrl);
  }

  static async resetPassword({ token, password }: ResetPasswordBody): Promise<void> {
    const tokenHash = hashToken(token);
    const stored = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const hashed = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({ where: { id: stored.userId }, data: { password: hashed } }),
      prisma.passwordResetToken.deleteMany({ where: { userId: stored.userId } }),
      prisma.refreshToken.deleteMany({ where: { userId: stored.userId } }),
    ]);
  }

  static async changePassword(
    userId: number,
    { currentPassword, newPassword }: ChangePasswordBody,
  ): Promise<void> {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

    if (!(await bcrypt.compare(currentPassword, user.password))) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
  }
}
