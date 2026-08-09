import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MatchmakingService } from './matchmaking.service';

interface MultiChain {
  zadd: (key: string, score: number, member: string) => MultiChain;
  zrem: (key: string, ...members: string[]) => MultiChain;
  set: (key: string, value: string, ...rest: unknown[]) => MultiChain;
  del: (key: string) => MultiChain;
  exec: () => Promise<Array<[Error | null, unknown]>>;
}

class FakeRedis {
  private strings = new Map<string, string>();
  private zsets = new Map<string, Map<string, number>>();

  async get(key: string): Promise<string | null> {
    return this.strings.get(key) ?? null;
  }

  async del(...keys: string[]): Promise<number> {
    let count = 0;
    for (const key of keys) {
      if (this.strings.delete(key)) count += 1;
      if (this.zsets.delete(key)) count += 1;
    }
    return count;
  }

  async zadd(key: string, score: number, member: string): Promise<number> {
    const set = this.zsets.get(key) ?? new Map<string, number>();
    const isNew = !set.has(member);
    set.set(member, score);
    this.zsets.set(key, set);
    return isNew ? 1 : 0;
  }

  async zrem(key: string, ...members: string[]): Promise<number> {
    const set = this.zsets.get(key);
    if (!set) return 0;
    let count = 0;
    for (const member of members) {
      if (set.delete(member)) count += 1;
    }
    return count;
  }

  async zrange(key: string, start: number, stop: number): Promise<string[]> {
    const set = this.zsets.get(key);
    if (!set) return [];
    const sorted = [...set.entries()].sort((a, b) => a[1] - b[1]).map(([member]) => member);
    const end = stop === -1 ? sorted.length : stop + 1;
    return sorted.slice(start, end);
  }

  multi(): MultiChain {
    const ops: Array<() => Promise<unknown>> = [];
    const chain: MultiChain = {
      zadd: (key, score, member) => {
        ops.push(() => this.zadd(key, score, member));
        return chain;
      },
      zrem: (key, ...members) => {
        ops.push(() => this.zrem(key, ...members));
        return chain;
      },
      set: (key, value) => {
        ops.push(async () => {
          this.strings.set(key, value);
          return 'OK';
        });
        return chain;
      },
      del: (key) => {
        ops.push(() => this.del(key));
        return chain;
      },
      exec: async () => {
        const results: Array<[Error | null, unknown]> = [];
        for (const op of ops) results.push([null, await op()]);
        return results;
      },
    };
    return chain;
  }
}

describe('MatchmakingService', () => {
  let redis: FakeRedis;
  let matchesService: { assertDeckReady: ReturnType<typeof vi.fn>; createPvpMatch: ReturnType<typeof vi.fn> };
  let gateway: { notifyMatchFound: ReturnType<typeof vi.fn> };
  let service: MatchmakingService;

  beforeEach(() => {
    redis = new FakeRedis();
    matchesService = {
      assertDeckReady: vi.fn().mockResolvedValue(undefined),
      createPvpMatch: vi.fn().mockResolvedValue({ matchId: 'match-1' }),
    };
    gateway = { notifyMatchFound: vi.fn() };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    service = new MatchmakingService(redis as any, matchesService as any, gateway as any);
  });

  it('validates the deck before enqueueing', async () => {
    await service.join('user-1', 'deck-1');
    expect(matchesService.assertDeckReady).toHaveBeenCalledWith('user-1', 'deck-1');
  });

  it('reports queued status after joining, and not-queued after leaving', async () => {
    await service.join('user-1', 'deck-1');
    expect(await service.status('user-1')).toMatchObject({ queued: true });

    await service.leave('user-1');
    expect(await service.status('user-1')).toEqual({ queued: false });
  });

  it('does not pair a single waiting player', async () => {
    await service.join('user-1', 'deck-1');
    await service.tick();
    expect(matchesService.createPvpMatch).not.toHaveBeenCalled();
    expect(await service.status('user-1')).toMatchObject({ queued: true });
  });

  it('pairs the two longest-waiting players FIFO and notifies both via the gateway', async () => {
    await service.join('user-1', 'deck-1');
    await service.join('user-2', 'deck-2');
    await service.tick();

    expect(matchesService.createPvpMatch).toHaveBeenCalledWith(
      { userId: 'user-1', deckId: 'deck-1' },
      { userId: 'user-2', deckId: 'deck-2' },
    );
    expect(gateway.notifyMatchFound).toHaveBeenCalledWith('user-1', 'match-1');
    expect(gateway.notifyMatchFound).toHaveBeenCalledWith('user-2', 'match-1');
    expect(await service.status('user-1')).toEqual({ queued: false });
    expect(await service.status('user-2')).toEqual({ queued: false });
  });

  it('pairs multiple waiting players into successive pairs on one tick', async () => {
    await service.join('user-1', 'deck-1');
    await service.join('user-2', 'deck-2');
    await service.join('user-3', 'deck-3');
    await service.join('user-4', 'deck-4');
    await service.tick();
    expect(matchesService.createPvpMatch).toHaveBeenCalledTimes(2);
  });

  it('leaves an odd player out unpaired', async () => {
    await service.join('user-1', 'deck-1');
    await service.join('user-2', 'deck-2');
    await service.join('user-3', 'deck-3');
    await service.tick();

    expect(matchesService.createPvpMatch).toHaveBeenCalledTimes(1);
    expect(await service.status('user-3')).toMatchObject({ queued: true });
  });

  it('rejects joining with an invalid deck and never enqueues it', async () => {
    matchesService.assertDeckReady.mockRejectedValueOnce(new Error('Deck not found.'));
    await expect(service.join('user-1', 'bad-deck')).rejects.toThrow('Deck not found.');
    expect(await service.status('user-1')).toEqual({ queued: false });
  });
});
