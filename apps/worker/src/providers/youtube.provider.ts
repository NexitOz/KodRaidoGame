import type { MetricsProvider, ProviderMetrics } from './types.js';

interface YoutubeStatisticsResponse {
  items?: Array<{
    statistics?: {
      viewCount?: string;
      likeCount?: string;
      commentCount?: string;
    };
  }>;
}

/**
 * YouTube Data API v3 (`videos.list`, official, key-only auth). No
 * scraping — this is the same endpoint YouTube's own developer docs
 * document for reading public video stats. Share/save counts aren't
 * exposed by the public API, so those come back as 0.
 */
export function createYoutubeProvider(apiKey: string | undefined): MetricsProvider {
  return {
    name: 'youtube',
    isConfigured: () => Boolean(apiKey),
    async fetchMetrics(externalId: string): Promise<ProviderMetrics> {
      if (!apiKey) throw new Error('YOUTUBE_API_KEY is not configured.');

      const url = new URL('https://www.googleapis.com/youtube/v3/videos');
      url.searchParams.set('part', 'statistics');
      url.searchParams.set('id', externalId);
      url.searchParams.set('key', apiKey);

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`YouTube API request failed (${res.status}) for video ${externalId}.`);
      }
      const body = (await res.json()) as YoutubeStatisticsResponse;
      const stats = body.items?.[0]?.statistics;
      if (!stats) {
        throw new Error(`YouTube video ${externalId} not found or has no statistics.`);
      }

      return {
        views: Number(stats.viewCount ?? 0),
        likes: Number(stats.likeCount ?? 0),
        comments: Number(stats.commentCount ?? 0),
        shares: 0,
        saves: 0,
        soundUses: 0,
      };
    },
  };
}
