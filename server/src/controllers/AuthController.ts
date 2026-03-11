import type { Request, Response, CookieOptions } from 'express';
import Controller from '../classes/Controller';
import AuthService from '../services/AuthService';
import { UnauthorizedException } from '../exceptions/UnauthorizedException';
import { HTTP_STATUS } from '../constants/httpStatus';
import type { LoginBody } from '../schemas/auth.schema';

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export default class AuthController extends Controller {
  static async register(req: Request, res: Response): Promise<Response> {
    const body = Controller.getValidatedBody<LoginBody>(req);
    const { accessToken, refreshToken, user } = await AuthService.register(body);

    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    return res.status(HTTP_STATUS.CREATED).json({ accessToken, user });
  }

  static async login(req: Request, res: Response): Promise<Response> {
    const body = Controller.getValidatedBody<LoginBody>(req);
    const { accessToken, refreshToken, user } = await AuthService.login(body);

    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    return res.status(HTTP_STATUS.OK).json({ accessToken, user });
  }

  static async refresh(req: Request, res: Response): Promise<Response> {
    const token = req.cookies.refreshToken as string | undefined;
    if (!token) throw new UnauthorizedException('No refresh token');

    const { accessToken, refreshToken } = await AuthService.refresh(token);

    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    return res.status(HTTP_STATUS.OK).json({ accessToken });
  }

  static async logout(req: Request, res: Response): Promise<Response> {
    const token = req.cookies.refreshToken as string | undefined;
    if (token) await AuthService.logout(token);

    res.clearCookie('refreshToken');
    return res.status(HTTP_STATUS.OK).json({ message: 'Logged out' });
  }
}
