import { defineConfig, devices } from '@playwright/test';

/**
 * Requires a running local stack (Postgres + Redis + a seeded game-server on :4000 + this app
 * on :3000, see README/docs/deployment.md) - not part of `npm test` / CI. Run manually via
 * `npm run test:e2e -w apps/web` after `npm run dev:server` and `npm run dev:web`.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 120_000,
  fullyParallel: false,
  // All e2e specs share one live dev-server + Postgres/Redis instance (see header comment) - two
  // workers hammering match-engine/bot actions concurrently starves that single backend enough
  // to flake otherwise-reliable PvE-win-driving tests. Serial execution trades wall-clock time
  // for determinism, which matters more for a manually-run suite than for a CI-parallel one.
  workers: 1,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'mobile-390x844',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        launchOptions: { executablePath: '/opt/pw-browsers/chromium' },
      },
    },
  ],
});
