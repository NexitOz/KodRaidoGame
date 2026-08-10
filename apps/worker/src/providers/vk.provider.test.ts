import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVkProvider } from './vk.provider.js';

describe('createVkProvider', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('is not configured without an access token', () => {
    expect(createVkProvider(undefined).isConfigured()).toBe(false);
  });

  it('maps VK video.get response to ProviderMetrics', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        response: { items: [{ views: 500, likes: { count: 40 }, comments: 3, reposts: { count: 7 } }] },
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const provider = createVkProvider('token123');
    const metrics = await provider.fetchMetrics('-123_456');

    expect(metrics).toEqual({ views: 500, likes: 40, comments: 3, shares: 7, saves: 0, soundUses: 0 });
    const calledUrl = fetchMock.mock.calls[0]![0] as URL;
    expect(calledUrl.toString()).toContain('videos=-123_456');
    expect(calledUrl.toString()).toContain('access_token=token123');
  });

  it('throws on a VK API error payload', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ error: { error_msg: 'Invalid token' } }) }),
    );
    const provider = createVkProvider('token123');
    await expect(provider.fetchMetrics('-1_2')).rejects.toThrow('Invalid token');
  });

  it('throws when the video is missing', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ response: { items: [] } }) }));
    const provider = createVkProvider('token123');
    await expect(provider.fetchMetrics('-1_2')).rejects.toThrow('not found');
  });
});
