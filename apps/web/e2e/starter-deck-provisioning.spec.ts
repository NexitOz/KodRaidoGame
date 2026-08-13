import { expect, test } from '@playwright/test';
import { driveTutorialToVictory, registerFreshUser } from './helpers';

/**
 * Starter Deck Provisioning 1.0 end-to-end coverage: a brand-new account must be able to reach
 * normal PvE without ever visiting the Deck Builder, whether they skip the tutorial or complete
 * it. Requires the same running local stack as tutorial-fpx.spec.ts. Not part of `npm test` /
 * CI; run manually with `npm run test:e2e -w apps/web`.
 */

async function startEasyPveFromPlayPage(page: import('@playwright/test').Page) {
  await page.goto('/play');
  // The negative case ("У тебя нет готовой колоды...") must never render for a freshly
  // provisioned account - if it does, the starter decks were not created.
  await expect(page.getByText('У тебя нет готовой колоды')).toHaveCount(0);

  const deckButtons = page.locator('section', { hasText: 'Колода' }).first().getByRole('button');
  await expect(deckButtons.first()).toBeVisible({ timeout: 10_000 });
  await deckButtons.first().click();

  await page.getByRole('button', { name: 'Легко' }).click();
  await page.getByRole('button', { name: 'Начать бой' }).click();

  await page.waitForURL(/\/play\/[^/]+$/, { timeout: 20_000 });
  await expect(page.getByText('Матч не найден')).toHaveCount(0);
  await expect(page.locator('button[aria-label*="здоровья"]').first()).toBeVisible({
    timeout: 10_000,
  });
}

test('register -> never touch the tutorial -> /play already has a ready starter deck -> PvE starts', async ({
  page,
}) => {
  await registerFreshUser(page, 'starter-skip');
  await page.waitForTimeout(500);

  // The tutorial has no automatic first-run prompt - a fresh account that never visits the Home
  // CTA or Settings' Обучение section should still reach normal PvE with a ready starter deck.
  await startEasyPveFromPlayPage(page);
});

test('register -> complete tutorial -> archetypes -> /play already has a ready starter deck -> PvE starts', async ({
  page,
}) => {
  test.setTimeout(360_000);
  await registerFreshUser(page, 'starter-tutorial');
  await page.waitForTimeout(500);

  // Tutorial start is only reachable via the explicit Home CTA now (no automatic modal).
  await page.goto('/');
  await page.getByRole('button', { name: 'Пройти обучение' }).click();
  await page.waitForURL('**/tutorial/**', { timeout: 15_000 });

  const result = await driveTutorialToVictory(page);
  expect(result.won).toBe(true);

  await page.waitForURL('**/tutorial/victory**', { timeout: 20_000 });
  await page.getByRole('link', { name: 'Продолжить' }).click();
  await page.waitForURL('**/tutorial/archetypes');
  await expect(page.getByText('Стартовые колоды')).toBeVisible();

  await page.getByRole('link', { name: 'Начать бой' }).click();
  await page.waitForURL('**/play');

  await startEasyPveFromPlayPage(page);
});
