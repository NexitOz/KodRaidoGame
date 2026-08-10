import { afterEach, describe, expect, it, vi } from 'vitest';
import { createTiktokProvider } from './tiktok.provider.js';

describe('createTiktokProvider', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('is not configured without an access token', () => {
    expect(createTiktokProvider(undefined).isConfigured()).toBe(false);
  });

  it('maps TikTok research API response to ProviderMetrics', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: { videos: [{ view_count: 2000, like_count: 300, comment_count: 10, share_count: 25 }] },
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const provider = createTiktokProvider('token123');
    const metrics = await provider.fetchMetrics('video1');

    expect(metrics).toEqual({ views: 2000, likes: 300, comments: 10, shares: 25, saves: 0, soundUses: 0 });
    const [reqUrl, reqInit] = fetchMock.mock.calls[0]!;
    expect(reqUrl).toContain('research/video/query');
    expect((reqInit as RequestInit).method).toBe('POST');
    expect((reqInit as RequestInit).headers).toMatchObject({ authorization: 'Bearer token123' });
  });

  it('throws when the video is missing from the response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: { videos: [] } }) }));
    const provider = createTiktokProvider('token123');
    await expect(provider.fetchMetrics('missing')).rejects.toThrow('not found');
  });
});
