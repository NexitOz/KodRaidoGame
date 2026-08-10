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
 */

test('new user: register -> onboarding -> full tutorial -> reward -> normal PvE', async ({ page }) => {
  test.setTimeout(360_000);
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));

  await registerFreshUser(page, 'golden');
  await page.waitForTimeout(500);

  await expect(page.getByRole('heading', { name: 'Код Райдо: Резонанс' })).toBeVisible();
  await page.getByRole('button', { name: /Начать обучение/ }).click();
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

  expect(errors).toEqual([]);
});

test('refresh mid-tutorial resumes instead of soft-locking', async ({ page }) => {
  await registerFreshUser(page, 'refresh');
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: /Начать обучение/ }).click();
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

test('skip shows a confirmation and never blocks the rest of the app', async ({ page }) => {
  await registerFreshUser(page, 'skip');
  await page.waitForTimeout(500);

  await page.getByRole('button', { name: 'Пропустить' }).click();
  await expect(page.getByText('Ты сможешь пройти обучение позже в настройках.')).toBeVisible();
  await page.getByRole('button', { name: 'Понятно' }).click();

  await expect(page.getByRole('button', { name: /Начать обучение/ })).toHaveCount(0);
  await page.goto('/play');
  await expect(page.getByText('Матч не найден')).toHaveCount(0);
});

test('replay from Settings starts a fresh tutorial match', async ({ page }) => {
  await registerFreshUser(page, 'replay');
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Пропустить' }).click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Понятно' }).click();

  await page.goto('/settings');
  await page.getByRole('button', { name: 'Пройти обучение снова' }).click();
  await page.waitForURL('**/tutorial/**', { timeout: 15_000 });
  await expect(page.locator('[role="status"][aria-live="polite"]')).toBeVisible();
});

test('360x800 mobile: tutorial layout has no horizontal overflow and the tooltip stays on screen', async ({
  browser,
}) => {
  const context = await browser.newContext({ viewport: { width: 360, height: 800 } });
  const page = await context.newPage();
  await registerFreshUser(page, '360');
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: /Начать обучение/ }).click();
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
  await page.getByRole('button', { name: /Начать обучение/ }).click();
  await page.waitForURL('**/tutorial/**', { timeout: 15_000 });
  await page.waitForTimeout(800);

  const spotlight = page.locator('.animate-spotlight-ring, .animate-spotlight-ring-strong').first();
  await expect(spotlight).toBeVisible();
  const animationName = await spotlight.evaluate((el) => getComputedStyle(el).animationName);
  expect(animationName).toBe('none');
  await context.close();
});
