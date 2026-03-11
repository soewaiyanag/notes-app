import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { UnauthorizedException } from '../exceptions/UnauthorizedException';

const REFRESH_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export default class TokenService {
  static signAccess(userId: number): string {
    return jwt.sign({ sub: userId }, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: (process.env.ACCESS_TOKEN_EXPIRES_IN ?? '15m') as jwt.SignOptions['expiresIn'],
    });
  }

  static signRefresh(userId: number): string {
    return jwt.sign({ sub: userId }, process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: '7d',
    });
  }

  static async store(userId: number, token: string): Promise<void> {
    await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt: new Date(Date.now() + REFRESH_EXPIRES_MS),
      },
    });
  }

  /**
   * Refresh token rotation: invalidate the used token and issue a new pair.
   * If the token is reused after rotation, it is already deleted — this signals
   * a potential token theft and the client will be forced to re-authenticate.
   */
  static async rotate(
    oldToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const stored = await prisma.refreshToken.findUnique({ where: { token: oldToken } });

    if (!stored || stored.expiresAt < new Date()) {
      await prisma.refreshToken.deleteMany({ where: { token: oldToken } });
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await prisma.refreshToken.delete({ where: { token: oldToken } });

    let payload: { sub: number };
    try {
      payload = jwt.verify(oldToken, process.env.REFRESH_TOKEN_SECRET!) as unknown as { sub: number };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = TokenService.signAccess(payload.sub);
    const refreshToken = TokenService.signRefresh(payload.sub);
    await TokenService.store(payload.sub, refreshToken);

    return { accessToken, refreshToken };
  }

  static async revoke(token: string): Promise<void> {
    await prisma.refreshToken.deleteMany({ where: { token } });
  }
}
