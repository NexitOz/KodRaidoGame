import { Body, Controller, HttpCode, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthResult, AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const REFRESH_COOKIE = 'raido_refresh_token';

/**
 * In production the frontend (Vercel/Replit) and this API (Railway/etc.) live on
 * different domains, so the refresh cookie must be SameSite=None (which requires
 * Secure). Locally everything is same-site (just different localhost ports), so
 * Lax without Secure keeps the cookie working over plain HTTP in dev.
 */
function cookieSecurityAttrs(): { secure: boolean; sameSite: 'none' | 'lax' } {
  const isProduction = process.env.NODE_ENV === 'production';
  return isProduction ? { secure: true, sameSite: 'none' } : { secure: false, sameSite: 'lax' };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(dto.email, dto.username, dto.password);
    this.setRefreshCookie(res, result);
    return this.toResponse(result);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto.email, dto.password);
    this.setRefreshCookie(res, result);
    return this.toResponse(result);
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = (req.cookies as Record<string, string> | undefined)?.[REFRESH_COOKIE];
    if (!token) throw new UnauthorizedException('Missing refresh token.');

    const result = await this.authService.refresh(token);
    this.setRefreshCookie(res, result);
    return this.toResponse(result);
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = (req.cookies as Record<string, string> | undefined)?.[REFRESH_COOKIE];
    if (token) await this.authService.logout(token);
    res.clearCookie(REFRESH_COOKIE, { path: '/api/auth', ...cookieSecurityAttrs() });
    return { success: true };
  }

  private setRefreshCookie(res: Response, result: AuthResult) {
    res.cookie(REFRESH_COOKIE, result.refreshToken, {
      httpOnly: true,
      expires: result.refreshTokenExpiresAt,
      path: '/api/auth',
      ...cookieSecurityAttrs(),
    });
  }

  private toResponse(result: AuthResult) {
    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        username: result.user.username,
        level: result.user.level,
        xp: result.user.xp,
        softCurrency: result.user.softCurrency,
        createdAt: result.user.createdAt,
      },
      accessToken: result.accessToken,
      accessTokenExpiresAt: result.accessTokenExpiresAt,
    };
  }
}
