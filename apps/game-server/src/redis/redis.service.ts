import { Injectable, type OnModuleDestroy } from '@nestjs/common';
import IORedis from 'ioredis';

@Injectable()
export class RedisService extends IORedis implements OnModuleDestroy {
  constructor() {
    super(process.env.REDIS_URL ?? 'redis://localhost:6379', { maxRetriesPerRequest: null });
  }

  async onModuleDestroy() {
    await this.quit();
  }
}
