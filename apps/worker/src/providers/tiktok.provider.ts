import type { MetricsProvider, ProviderMetrics } from './types.js';

interface TiktokResearchVideoResponse {
  data?: {
    videos?: Array<{
      view_count?: number;
      like_count?: number;
      comment_count?: number;
      share_count?: number;
    }>;
  };
}

/**
 * TikTok Research API v2 (`/v2/research/video/query/`), official and
 * OAuth-based — no scraping. Unlike YouTube's key-only API, this endpoint
 * requires an approved TikTok Research API application (not just an app
 * client id), so `TIKTOK_ACCESS_TOKEN` realistically stays unset until that
 * approval exists; the provider then simply reports itself unconfigured
 * and polling skips it. Response field names follow TikTok's published
 * schema at implementation time — reverify against current docs once a
 * real app is approved, since third-party platform APIs do change shape.
 */
export function createTiktokProvider(accessToken: string | undefined): MetricsProvider {
  return {
    name: 'tiktok',
    isConfigured: () => Boolean(accessToken),
    async fetchMetrics(externalId: string): Promise<ProviderMetrics> {
      if (!accessToken) throw new Error('TIKTOK_ACCESS_TOKEN is not configured.');

      const res = await fetch(
        'https://open.tiktokapis.com/v2/research/video/query/?fields=view_count,like_count,comment_count,share_count',
        {
          method: 'POST',
          headers: {
            authorization: `Bearer ${accessToken}`,
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            query: { and: [{ operation: 'IN', field_name: 'video_id', field_values: [externalId] }] },
            max_count: 1,
          }),
        },
      );
      if (!res.ok) {
        throw new Error(`TikTok API request failed (${res.status}) for video ${externalId}.`);
      }
      const body = (await res.json()) as TiktokResearchVideoResponse;
      const video = body.data?.videos?.[0];
      if (!video) {
        throw new Error(`TikTok video ${externalId} not found.`);
      }

      return {
        views: video.view_count ?? 0,
        likes: video.like_count ?? 0,
        comments: video.comment_count ?? 0,
        shares: video.share_count ?? 0,
        saves: 0,
        soundUses: 0,
      };
    },
  };
}
