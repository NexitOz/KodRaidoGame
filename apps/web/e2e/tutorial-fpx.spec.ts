import { expect, test } from '@playwright/test';
import {
  currentTutorialStep,
  dismissIntroSteps,
  driveTutorialToVictory,
  playCardByTarget,
  registerFreshUser,
} from './helpers';

/**
 * First Player Experience 1.0 end-to-end coverage. Requires a running local stack (Postgres +
 * Redis + a seeded game-server on :4000 + this app on :3000) - see docs/tutorial-fpx.md. Not
 * part of `npm test` / CI; run manually with `npm run test:e2e -w apps/web`.
 *
 * There is no automatic first-run gate anymore - a fresh account is never interrupted by a modal,
 * banner, or redirect. The only two entry points into the tutorial are the dynamic-state CTA
 * button on the Home screen and the "Обучение" section in Settings (see `useTutorialCta`).
 */

test('new user: register -> lands on Home with no automatic modal -> explicit start -> full tutorial -> reward -> normal PvE', async ({
  page,
}) => {
  test.setTimeout(360_000);
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));

  await registerFreshUser(page, 'golden');
  await page.waitForTimeout(500);

  await page.goto('/');
  await page.waitForTimeout(300);
  // No automatic first-run modal/dialog of any kind - the hero content is immediately visible and
  // interactive, and the only tutorial affordance is the explicit CTA button below it.
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: /Музыка рождает/ })).toBeVisible();
  const startButton = page.getByRole('button', { name: 'Пройти обучение' });
  await expect(startButton).toBeVisible();

  await startButton.click();
  await page.waitForURL('**/tutorial/**', { timeout: 15_000 });

  const result = await driveTutorialToVictory(page);
  expect(result.won).toBe(true);
  // All 9 teaching objectives must have been reached at least once, in order, with no cardId
  // branching anywhere in the driver above - it only ever looked at card TYPE and game state.
  expect(result.seenSteps).toEqual([
    'CONDUCTOR',
    'ENERGY',
    'PLAY_CHARACTER',
    'END_TURN',
    'ATTACK',
    'PLAY_RUNE',
    'PLAY_TRACK',
    'PLAY_EVENT',
    'RESONANCE',
  ]);

  // The trailing "**" matters: the real URL carries a ?xp=...&currency=... query string.
  await page.waitForURL('**/tutorial/victory**', { timeout: 20_000 });
  await expect(page.getByText('РЕЗОНАНС УСЛЫШАЛ ТЕБЯ')).toBeVisible();
  await expect(page.getByText('Обучение завершено.')).toBeVisible();

  await page.getByRole('link', { name: 'Продолжить' }).click();
  await page.waitForURL('**/tutorial/archetypes');
  await expect(page.getByText('Стартовые колоды')).toBeVisible();

  await page.getByRole('link', { name: 'Начать бой' }).click();
  await page.waitForURL('**/play');

  // Completed state now reads "Пройти заново" on both entry points - no parallel progress system.
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Пройти заново' })).toBeVisible();
  await page.goto('/settings');
  await expect(page.getByRole('button', { name: 'Пройти заново' })).toBeVisible();

  expect(errors).toEqual([]);
});

test('normal PvE and PvP screens never show a tutorial CTA, modal, or automatic redirect', async ({ page }) => {
  await registerFreshUser(page, 'no-auto-cta');
  await page.waitForTimeout(500);

  // A completely untouched account (never visited Home's CTA or Settings) going straight into a
  // normal match must see nothing tutorial-related - no dialog, no banner, no redirect away from
  // the match it asked for.
  await page.goto('/play');
  await page.waitForTimeout(500);
  await expect(page.getByText('У тебя нет готовой колоды')).toHaveCount(0);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByText('Продолжить обучение')).toHaveCount(0);
  expect(page.url()).toContain('/play');

  await page.goto('/pvp');
  await page.waitForTimeout(500);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByText('Продолжить обучение')).toHaveCount(0);
  expect(page.url()).toContain('/pvp');
});

test('refresh mid-tutorial resumes instead of soft-locking', async ({ page }) => {
  await registerFreshUser(page, 'refresh');
  await page.waitForTimeout(500);
  await page.goto('/');
  await page.getByRole('button', { name: 'Пройти обучение' }).click();
  await page.waitForURL('**/tutorial/**', { timeout: 15_000 });

  await dismissIntroSteps(page);
  await playCardByTarget(page, 'hand-character');
  await page.waitForTimeout(600);

  await page.reload();
  await page.waitForTimeout(1200);

  await expect(page.getByText('Обучающий матч не найден')).toHaveCount(0);
  const step = await currentTutorialStep(page);
  // Section 18: refresh must not destroy progress or regress past what was already completed.
  expect(step).not.toBe('CONDUCTOR');
  expect(step).not.toBe('ENERGY');
});

test('explicit start from Settings works and shows the not-started label', async ({ page }) => {
  await registerFreshUser(page, 'replay');
  await page.waitForTimeout(500);

  await page.goto('/settings');
  await expect(page.getByRole('button', { name: 'Пройти обучение' })).toBeVisible();
  await page.getByRole('button', { name: 'Пройти обучение' }).click();
  await page.waitForURL('**/tutorial/**', { timeout: 15_000 });
  await expect(page.locator('[role="status"][aria-live="polite"]')).toBeVisible();
});

test('start from Settings -> navigate away -> Home CTA resumes the same active match at the saved step', async ({
  page,
}) => {
  await registerFreshUser(page, 'exit-resume');
  await page.waitForTimeout(500);

  await page.goto('/settings');
  await page.getByRole('button', { name: 'Пройти обучение' }).click();
  await page.waitForURL('**/tutorial/**', { timeout: 15_000 });
  const matchUrl = page.url();

  // Leave the tutorial mid-way (exiting an unfinished attempt) - progress must be preserved.
  await dismissIntroSteps(page);
  const stepBeforeExit = await currentTutorialStep(page);

  await page.goto('/');
  await page.waitForTimeout(500);

  const resumeButton = page.getByRole('button', { name: 'Продолжить обучение' });
  await expect(resumeButton).toBeVisible();
  await resumeButton.click();
  await page.waitForURL(matchUrl, { timeout: 10_000 });

  const stepAfterResume = await currentTutorialStep(page);
  expect(stepAfterResume).toBe(stepBeforeExit);
});

test('complete tutorial -> replay from Settings -> navigate away -> Home CTA resume path still works', async ({
  page,
}) => {
  test.setTimeout(360_000);
  await registerFreshUser(page, 'complete-resume');
  await page.waitForTimeout(500);
  await page.goto('/');
  await page.getByRole('button', { name: 'Пройти обучение' }).click();
  await page.waitForURL('**/tutorial/**', { timeout: 15_000 });

  const result = await driveTutorialToVictory(page);
  expect(result.won).toBe(true);
  await page.waitForURL('**/tutorial/victory**', { timeout: 20_000 });

  await page.goto('/settings');
  // Completed (no active match) reads as "completed" -> "Пройти заново".
  await page.getByRole('button', { name: 'Пройти заново' }).click();
  await page.waitForURL('**/tutorial/**', { timeout: 15_000 });
  const matchUrl = page.url();

  await page.goto('/');
  await page.waitForTimeout(500);

  const resumeButton = page.getByRole('button', { name: 'Продолжить обучение' });
  await expect(resumeButton).toBeVisible();
  await resumeButton.click();
  await page.waitForURL(matchUrl, { timeout: 10_000 });
});

test('360x800 mobile: tutorial layout has no horizontal overflow and the tooltip stays on screen', async ({
  browser,
}) => {
  const context = await browser.newContext({ viewport: { width: 360, height: 800 } });
  const page = await context.newPage();
  await registerFreshUser(page, '360');
  await page.waitForTimeout(500);
  await page.goto('/');
  await page.getByRole('button', { name: 'Пройти обучение' }).click();
  await page.waitForURL('**/tutorial/**', { timeout: 15_000 });
  await page.waitForTimeout(800);

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);

  const tooltipBox = await page.locator('[role="status"][aria-live="polite"]').first().boundingBox();
  expect(tooltipBox).not.toBeNull();
  if (tooltipBox) {
    expect(tooltipBox.x).toBeGreaterThanOrEqual(0);
    expect(tooltipBox.x + tooltipBox.width).toBeLessThanOrEqual(360);
  }
  await context.close();
});

test('prefers-reduced-motion disables the spotlight animation', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await registerFreshUser(page, 'rm');
  await page.waitForTimeout(500);
  await page.goto('/');
  await page.getByRole('button', { name: 'Пройти обучение' }).click();
  await page.waitForURL('**/tutorial/**', { timeout: 15_000 });
  await page.waitForTimeout(800);

  const spotlight = page.locator('.animate-spotlight-ring, .animate-spotlight-ring-strong').first();
  await expect(spotlight).toBeVisible();
  const animationName = await spotlight.evaluate((el) => getComputedStyle(el).animationName);
  expect(animationName).toBe('none');
  await context.close();
});
