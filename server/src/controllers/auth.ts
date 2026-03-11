import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES_IN ?? '15m';
const REFRESH_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function signAccess(userId: number) {
  return jwt.sign({ sub: userId }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: ACCESS_EXPIRES as jwt.SignOptions['expiresIn'],
  });
}

function signRefresh(userId: number) {
  return jwt.sign({ sub: userId }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: '7d',
  });
}

function setRefreshCookie(res: Response, token: string) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: REFRESH_EXPIRES_MS,
  });
}

export async function register(req: Request, res: Response): Promise<void> {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid input', errors: parsed.error.flatten() });
    return;
  }

  const { email, password } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ message: 'Email already in use' });
    return;
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, password: hashed },
  });

  const accessToken = signAccess(user.id);
  const refreshToken = signRefresh(user.id);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_EXPIRES_MS),
    },
  });

  setRefreshCookie(res, refreshToken);
  res.status(201).json({ accessToken, user: { id: user.id, email: user.email } });
}

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid input' });
    return;
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const accessToken = signAccess(user.id);
  const refreshToken = signRefresh(user.id);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_EXPIRES_MS),
    },
  });

  setRefreshCookie(res, refreshToken);
  res.json({ accessToken, user: { id: user.id, email: user.email } });
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const token = req.cookies.refreshToken as string | undefined;
  if (!token) {
    res.status(401).json({ message: 'No refresh token' });
    return;
  }

  // Rotation: find and immediately delete the used token
  const stored = await prisma.refreshToken.findUnique({ where: { token } });
  if (!stored || stored.expiresAt < new Date()) {
    res.clearCookie('refreshToken');
    res.status(401).json({ message: 'Invalid or expired refresh token' });
    return;
  }

  await prisma.refreshToken.delete({ where: { token } });

  let payload: { sub: number };
  try {
    payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as { sub: number };
  } catch {
    res.status(401).json({ message: 'Invalid refresh token' });
    return;
  }

  const newAccess = signAccess(payload.sub);
  const newRefresh = signRefresh(payload.sub);

  await prisma.refreshToken.create({
    data: {
      token: newRefresh,
      userId: payload.sub,
      expiresAt: new Date(Date.now() + REFRESH_EXPIRES_MS),
    },
  });

  setRefreshCookie(res, newRefresh);
  res.json({ accessToken: newAccess });
}

export async function logout(req: Request, res: Response): Promise<void> {
  const token = req.cookies.refreshToken as string | undefined;
  if (token) {
    await prisma.refreshToken.deleteMany({ where: { token } });
  }
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
}
