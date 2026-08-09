import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';

/**
 * There's no user/role system yet (see docs/progress.md Phase 5 simplifications),
 * so admin endpoints are gated by a single shared secret instead of RBAC — a
 * deliberately minimal "skeleton" matching how the spec frames the admin surface.
 * Fails closed: an unset ADMIN_API_KEY rejects every request, not just unkeyed ones.
 */
@Injectable()
export class AdminKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const expected = process.env.ADMIN_API_KEY;
    if (!expected) {
      throw new UnauthorizedException('Admin API is not configured.');
    }

    const request = context.switchToHttp().getRequest<Request>();
    const provided = request.headers['x-admin-key'];
    if (provided !== expected) {
      throw new UnauthorizedException('Invalid admin key.');
    }

    return true;
  }
}
