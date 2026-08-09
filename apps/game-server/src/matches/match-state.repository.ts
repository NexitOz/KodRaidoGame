import { Injectable } from '@nestjs/common';
import type { GameEvent, MatchState } from '@kod-raido/game-engine';
import { RedisService } from '../redis/redis.service';

const MATCH_TTL_SECONDS = 6 * 60 * 60; // 6 hours — long enough to resume an abandoned tab

@Injectable()
export class MatchStateRepository {
  constructor(private readonly redis: RedisService) {}

  private stateKey(matchId: string): string {
    return `match:${matchId}:state`;
  }

  private eventsKey(matchId: string): string {
    return `match:${matchId}:events`;
  }

  private ownerKey(matchId: string): string {
    return `match:${matchId}:owner`;
  }

  async save(matchId: string, state: MatchState, humanPlayerId: string): Promise<void> {
    await this.redis
      .multi()
      .set(this.stateKey(matchId), JSON.stringify(state), 'EX', MATCH_TTL_SECONDS)
      .set(this.ownerKey(matchId), humanPlayerId, 'EX', MATCH_TTL_SECONDS)
      .exec();
  }

  async load(matchId: string): Promise<MatchState | null> {
    const raw = await this.redis.get(this.stateKey(matchId));
    return raw ? (JSON.parse(raw) as MatchState) : null;
  }

  async getOwner(matchId: string): Promise<string | null> {
    return this.redis.get(this.ownerKey(matchId));
  }

  async appendEvents(matchId: string, events: GameEvent[]): Promise<void> {
    if (events.length === 0) return;
    await this.redis.rpush(this.eventsKey(matchId), ...events.map((e) => JSON.stringify(e)));
    await this.redis.expire(this.eventsKey(matchId), MATCH_TTL_SECONDS);
  }

  async loadAllEvents(matchId: string): Promise<GameEvent[]> {
    const raw = await this.redis.lrange(this.eventsKey(matchId), 0, -1);
    return raw.map((entry) => JSON.parse(entry) as GameEvent);
  }

  async delete(matchId: string): Promise<void> {
    await this.redis.del(this.stateKey(matchId), this.eventsKey(matchId), this.ownerKey(matchId));
  }
}
