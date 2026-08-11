import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * A minimal first-party event log (see AnalyticsEvent in schema.prisma) for the
 * onboarding funnel. No personal/sensitive data - only userId plus coarse
 * facts like a tutorial step number.
 */
@Injectable()
export class AnalyticsEventsService {
  constructor(private readonly prisma: PrismaService) {}

  async log(type: string, userId: string | undefined, payload: Record<string, unknown> = {}): Promise<void> {
    await this.prisma.analyticsEvent.create({
      data: { type, userId, payloadJson: payload as object },
    });
  }

  /** Logs `type` for `userId` only if no prior event of that type exists for them - for one-time funnel markers. */
  async logOnce(type: string, userId: string, payload: Record<string, unknown> = {}): Promise<boolean> {
    const existing = await this.prisma.analyticsEvent.findFirst({ where: { type, userId } });
    if (existing) return false;
    await this.log(type, userId, payload);
    return true;
  }
}
