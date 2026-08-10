import { PrismaClient } from '@prisma/client';
import { createResonanceWorker } from './processors/resonance-processor.js';
import { createRedisConnection } from './redis.js';
import { createTiktokProvider } from './providers/tiktok.provider.js';
import { createYoutubeProvider } from './providers/youtube.provider.js';
import { createVkProvider } from './providers/vk.provider.js';
import { pollProviderMetrics } from './providers/poll-metrics.js';
import { recalculateAll } from './resonance/recalculate.js';

const connection = createRedisConnection();
const prisma = new PrismaClient();
const resonanceWorker = createResonanceWorker(connection, prisma);

const metricsProviders = [
  createYoutubeProvider(process.env.YOUTUBE_API_KEY),
  createTiktokProvider(process.env.TIKTOK_ACCESS_TOKEN),
  createVkProvider(process.env.VK_ACCESS_TOKEN),
];
const configuredProviders = metricsProviders.filter((p) => p.isConfigured());

const PROVIDER_POLL_INTERVAL_MS = 6 * 60 * 60 * 1000;
let providerPollTimer: NodeJS.Timeout | undefined;

if (configuredProviders.length > 0) {
  // eslint-disable-next-line no-console
  console.log(
    `[worker] metrics providers configured: ${configuredProviders.map((p) => p.name).join(', ')}`,
  );
  const runProviderPoll = async () => {
    try {
      const results = await pollProviderMetrics(prisma, configuredProviders);
      if (results.some((r) => r.fetched > 0)) {
        await recalculateAll(prisma);
      }
      // eslint-disable-next-line no-console
      console.log('[worker] provider metrics poll:', results);
    } catch (error) {
      // A failed poll (DB hiccup, provider outage) must not take down the
      // resonance job worker running alongside it in this same process.
      console.error('[worker] provider metrics poll failed:', error);
    }
  };
  void runProviderPoll();
  providerPollTimer = setInterval(() => void runProviderPoll(), PROVIDER_POLL_INTERVAL_MS);
} else {
  // eslint-disable-next-line no-console
  console.log('[worker] no metrics provider API keys configured, skipping automatic polling');
}

resonanceWorker.on('completed', (job) => {
  // eslint-disable-next-line no-console
  console.log(`[worker] job ${job.id} completed`);
});

resonanceWorker.on('failed', (job, error) => {
  console.error(`[worker] job ${job?.id} failed`, error);
});

// eslint-disable-next-line no-console
console.log('[worker] Kod Raido worker started, listening for jobs...');

async function shutdown() {
  if (providerPollTimer) clearInterval(providerPollTimer);
  await resonanceWorker.close();
  await prisma.$disconnect();
  connection.disconnect();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
