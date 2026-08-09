import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import type { MatchmakingStatus } from '@kod-raido/shared';
import { MatchesService } from '../matches/matches.service';
import { RedisService } from '../redis/redis.service';
import { MatchGateway } from './match.gateway';

const QUEUE_KEY = 'matchmaking:queue';
const ENTRY_KEY_PREFIX = 'matchmaking:entry:';
const ENTRY_TTL_SECONDS = 5 * 60;
const TICK_INTERVAL_MS = 2000;

interface QueueEntry {
  deckId: string;
  joinedAt: string;
}

/**
 * FIFO pairing over a single Redis sorted set. This is intentionally a
 * "skeleton" per the spec: it assumes a single game-server instance owns
 * the queue (no distributed lock across instances) and pairs the two
 * longest-waiting players regardless of MMR — good enough to prove out
 * matchmaking + the live match flow, with proper MMR-banded pairing and
 * multi-instance coordination left for when ranked actually ships.
 */
@Injectable()
export class MatchmakingService {
  private readonly logger = new Logger(MatchmakingService.name);
  private ticking = false;

  constructor(
    private readonly redis: RedisService,
    private readonly matchesService: MatchesService,
    private readonly gateway: MatchGateway,
  ) {}

  async join(userId: string, deckId: string): Promise<void> {
    await this.matchesService.assertDeckReady(userId, deckId);

    const entry: QueueEntry = { deckId, joinedAt: new Date().toISOString() };
    await this.redis
      .multi()
      .zadd(QUEUE_KEY, Date.now(), userId)
      .set(this.entryKey(userId), JSON.stringify(entry), 'EX', ENTRY_TTL_SECONDS)
      .exec();
  }

  async leave(userId: string): Promise<void> {
    await this.redis.multi().zrem(QUEUE_KEY, userId).del(this.entryKey(userId)).exec();
  }

  async status(userId: string): Promise<MatchmakingStatus> {
    const raw = await this.redis.get(this.entryKey(userId));
    if (!raw) return { queued: false };
    const entry = JSON.parse(raw) as QueueEntry;
    return { queued: true, queuedAt: entry.joinedAt };
  }

  @Interval(TICK_INTERVAL_MS)
  async tick(): Promise<void> {
    if (this.ticking) return;
    this.ticking = true;
    try {
      await this.pairWaitingPlayers();
    } finally {
      this.ticking = false;
    }
  }

  private async pairWaitingPlayers(): Promise<void> {
    for (;;) {
      const waiting = await this.redis.zrange(QUEUE_KEY, 0, 1);
      if (waiting.length < 2) return;
      const [userId1, userId2] = waiting as [string, string];

      // Remove both up front so nothing else can pair them a second time mid-tick.
      const removed = await this.redis.zrem(QUEUE_KEY, userId1, userId2);
      if (removed < 2) continue; // one of them left the queue between zrange and zrem; retry

      const [entry1Raw, entry2Raw] = await Promise.all([
        this.redis.get(this.entryKey(userId1)),
        this.redis.get(this.entryKey(userId2)),
      ]);
      await Promise.all([this.redis.del(this.entryKey(userId1)), this.redis.del(this.entryKey(userId2))]);

      if (!entry1Raw || !entry2Raw) {
        this.logger.warn(`Matchmaking pair ${userId1}/${userId2} lost queue metadata; skipping.`);
        continue;
      }

      const entry1 = JSON.parse(entry1Raw) as QueueEntry;
      const entry2 = JSON.parse(entry2Raw) as QueueEntry;

      try {
        const { matchId } = await this.matchesService.createPvpMatch(
          { userId: userId1, deckId: entry1.deckId },
          { userId: userId2, deckId: entry2.deckId },
        );
        this.gateway.notifyMatchFound(userId1, matchId);
        this.gateway.notifyMatchFound(userId2, matchId);
      } catch (err) {
        this.logger.error(`Failed to create PvP match for ${userId1}/${userId2}`, err as Error);
      }
    }
  }

  private entryKey(userId: string): string {
    return `${ENTRY_KEY_PREFIX}${userId}`;
  }
}
