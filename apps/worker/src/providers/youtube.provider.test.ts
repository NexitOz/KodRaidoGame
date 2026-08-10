import { afterEach, describe, expect, it, vi } from 'vitest';
import { createYoutubeProvider } from './youtube.provider.js';

describe('createYoutubeProvider', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('is not configured without an API key', () => {
    const provider = createYoutubeProvider(undefined);
    expect(provider.isConfigured()).toBe(false);
  });

  it('is configured with an API key', () => {
    const provider = createYoutubeProvider('key123');
    expect(provider.isConfigured()).toBe(true);
  });

  it('rejects fetchMetrics when unconfigured', async () => {
    const provider = createYoutubeProvider(undefined);
    await expect(provider.fetchMetrics('vid1')).rejects.toThrow('YOUTUBE_API_KEY');
  });

  it('maps YouTube statistics to ProviderMetrics', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [{ statistics: { viewCount: '1000', likeCount: '50', commentCount: '5' } }],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const provider = createYoutubeProvider('key123');
    const metrics = await provider.fetchMetrics('vid1');

    expect(metrics).toEqual({ views: 1000, likes: 50, comments: 5, shares: 0, saves: 0, soundUses: 0 });
    const calledUrl = fetchMock.mock.calls[0]![0] as URL;
    expect(calledUrl.toString()).toContain('id=vid1');
    expect(calledUrl.toString()).toContain('key=key123');
  });

  it('throws when the video is not found', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ items: [] }) }));
    const provider = createYoutubeProvider('key123');
    await expect(provider.fetchMetrics('missing')).rejects.toThrow('not found');
  });

  it('throws when the API responds with a non-OK status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 403 }));
    const provider = createYoutubeProvider('key123');
    await expect(provider.fetchMetrics('vid1')).rejects.toThrow('403');
  });
});
