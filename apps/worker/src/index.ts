import { createResonanceWorker } from './processors/resonance-processor.js';
import { createRedisConnection } from './redis.js';

const connection = createRedisConnection();
const resonanceWorker = createResonanceWorker(connection);

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
  await resonanceWorker.close();
  connection.disconnect();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
