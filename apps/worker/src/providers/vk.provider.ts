import type { MetricsProvider, ProviderMetrics } from './types.js';

interface VkVideoGetResponse {
  response?: {
    items?: Array<{
      views?: number;
      likes?: { count?: number };
      comments?: number;
      reposts?: { count?: number };
    }>;
  };
  error?: { error_msg?: string };
}

const VK_API_VERSION = '5.199';

/**
 * VK official API (`video.get`, https://dev.vk.com/method/video.get) —
 * token-based, no scraping. VK identifies a video as `{ownerId}_{videoId}`,
 * so `externalId` on the `MediaAsset` row is expected in that form.
 */
export function createVkProvider(accessToken: string | undefined): MetricsProvider {
  return {
    name: 'vk',
    isConfigured: () => Boolean(accessToken),
    async fetchMetrics(externalId: string): Promise<ProviderMetrics> {
      if (!accessToken) throw new Error('VK_ACCESS_TOKEN is not configured.');

      const url = new URL('https://api.vk.com/method/video.get');
      url.searchParams.set('videos', externalId);
      url.searchParams.set('access_token', accessToken);
      url.searchParams.set('v', VK_API_VERSION);

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`VK API request failed (${res.status}) for video ${externalId}.`);
      }
      const body = (await res.json()) as VkVideoGetResponse;
      if (body.error) {
        throw new Error(`VK API error for video ${externalId}: ${body.error.error_msg ?? 'unknown error'}.`);
      }
      const video = body.response?.items?.[0];
      if (!video) {
        throw new Error(`VK video ${externalId} not found.`);
      }

      return {
        views: video.views ?? 0,
        likes: video.likes?.count ?? 0,
        comments: video.comments ?? 0,
        shares: video.reposts?.count ?? 0,
        saves: 0,
        soundUses: 0,
      };
    },
  };
}
