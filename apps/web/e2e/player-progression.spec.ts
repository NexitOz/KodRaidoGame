import { expect, test, type Page } from '@playwright/test';
import { attackWithReadyUnit, playCardByTarget, registerFreshUser } from './helpers';

/**
 * Player Progression & Economy 1.0 end-to-end coverage. Requires the same running local stack as
 * tutorial-fpx.spec.ts / starter-deck-provisioning.spec.ts. Not part of `npm test` / CI; run
 * manually with `npm run test:e2e -w apps/web`.
 */

const HAND_TARGETS = ['hand-character', 'hand-rune', 'hand-track', 'hand-event'];

/**
 * Drives a live (non-tutorial) PvE match to completion using only generic, type-driven actions -
 * always attack a ready unit first, otherwise play any affordable hand card, otherwise end the
 * turn. The same data-tutorial-target attributes the tutorial driver uses are present on every
 * match (tutorial or not), so the exact same low-level helpers apply here.
 */
async function driveNormalPveToFinish(page: Page, maxIterations = 250): Promise<{ won: boolean }> {
  for (let i = 0; i < maxIterations; i++) {
    if ((await page.getByRole('dialog', { name: 'Победа' }).count()) > 0) return { won: true };
    if ((await page.getByRole('dialog', { name: 'Поражение' }).count()) > 0) return { won: false };

    if (await attackWithReadyUnit(page)) {
      await page.waitForTimeout(250);
      continue;
    }

    let played = false;
    for (const target of HAND_TARGETS) {
      if (await playCardByTarget(page, target)) {
        played = true;
        break;
      }
    }
    if (played) {
      await page.waitForTimeout(300);
      continue;
    }

    const endTurn = page.locator('[data-tutorial-target="end-turn"]');
    if (await endTurn.isEnabled().catch(() => false)) {
      await endTurn.click();
      await page.waitForTimeout(500);
    } else {
      await page.waitForTimeout(300);
    }
  }
  throw new Error('driveNormalPveToFinish exceeded max iterations without a result');
}

async function startEasyPveMatch(page: Page): Promise<void> {
  await page.goto('/play');
  await expect(page.getByText('У тебя нет готовой колоды')).toHaveCount(0);
  const deckButtons = page.locator('section', { hasText: 'Колода' }).first().getByRole('button');
  await expect(deckButtons.first()).toBeVisible({ timeout: 10_000 });
  await deckButtons.first().click();
  await page.getByRole('button', { name: 'Легко' }).click();
  await page.getByRole('button', { name: 'Начать бой' }).click();
  await page.waitForURL(/\/play\/[^/]+$/, { timeout: 20_000 });
}

/** A fresh 6-starter-deck account vs. the EASY bot wins the large majority of the time when
 * played aggressively; retrying with a brand-new match on a loss keeps this non-brittle without
 * asserting anything about a specific match's outcome. */
async function winAnEasyPveMatch(page: Page, attempts = 8): Promise<void> {
  for (let attempt = 0; attempt < attempts; attempt++) {
    await startEasyPveMatch(page);
    const result = await driveNormalPveToFinish(page);
    if (result.won) return;
  }
  throw new Error(`Could not win an Easy PvE match after ${attempts} attempts`);
}

async function readProfileCurrency(page: Page): Promise<number> {
  await page.goto('/profile');
  const value = page.getByTestId('profile-currency');
  await expect(value).toBeVisible({ timeout: 10_000 });
  const text = (await value.textContent())?.trim() ?? '';
  const parsed = Number(text);
  if (Number.isNaN(parsed)) throw new Error(`Could not parse profile currency from "${text}"`);
  return parsed;
}

test('fresh user: skip -> win an Easy PvE match -> result shows XP/Echo -> profile currency increased', async ({
  page,
}) => {
  test.setTimeout(1_200_000);
  await registerFreshUser(page, 'progression-first-win');
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Пропустить' }).click();
  await expect(page.getByText('Ты сможешь пройти обучение позже в настройках.')).toBeVisible();
  await page.getByRole('button', { name: 'Понятно' }).click();

  const currencyBefore = await readProfileCurrency(page);

  await winAnEasyPveMatch(page);

  await expect(page.getByRole('dialog', { name: 'Победа' })).toBeVisible();
  const xpText = (await page.getByTestId('reward-xp').textContent()) ?? '';
  const currencyText = (await page.getByTestId('reward-currency').textContent()) ?? '';
  expect(xpText).toMatch(/^\+\d+$/);
  expect(currencyText).toMatch(/^\+\d+$/);

  const currencyAfter = await readProfileCurrency(page);
  expect(currencyAfter).toBeGreaterThan(currencyBefore);
});

test('a second win the same day grants reward again but never repeats the first-win-of-day bonus', async ({
  page,
}) => {
  test.setTimeout(1_200_000);
  await registerFreshUser(page, 'progression-second-win');
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Пропустить' }).click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Понятно' }).click();

  await winAnEasyPveMatch(page);
  await expect(page.getByRole('dialog', { name: 'Победа' })).toBeVisible();
  // The very first win of a fresh account always carries the daily bonus.
  await expect(page.getByTestId('reward-first-win-bonus')).toBeVisible();
  const currencyAfterFirst = await readProfileCurrency(page);

  await winAnEasyPveMatch(page);
  await expect(page.getByRole('dialog', { name: 'Победа' })).toBeVisible();
  await expect(page.getByTestId('reward-first-win-bonus')).toHaveCount(0);
  const currencyAfterSecond = await readProfileCurrency(page);

  expect(currencyAfterSecond).toBeGreaterThan(currencyAfterFirst);
});

test('refreshing the finished match result page does not grant a duplicate reward', async ({ page }) => {
  test.setTimeout(1_200_000);
  await registerFreshUser(page, 'progression-refresh');
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Пропустить' }).click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Понятно' }).click();

  await winAnEasyPveMatch(page);
  await expect(page.getByRole('dialog', { name: 'Победа' })).toBeVisible();
  const matchUrl = page.url();

  const currencyBeforeRefresh = await readProfileCurrency(page);

  await page.goto(matchUrl); // full navigation reload of the finished match's own result page
  await page.waitForTimeout(800);

  const currencyAfterRefresh = await readProfileCurrency(page);
  expect(currencyAfterRefresh).toBe(currencyBeforeRefresh);
});

test('the first win that crosses a level threshold shows the level-up presentation and unlocked reward', async ({
  page,
}) => {
  test.setTimeout(1_200_000);
  await registerFreshUser(page, 'progression-level-up');
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Пропустить' }).click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Понятно' }).click();

  // A fresh account's first WIN always carries the first-win-of-day bonus (>= 110 xp, past the
  // 100xp level-2 threshold), but EASY is a literally-random bot (see pve-bot.ts randomAction) -
  // it can still win a close race even though it never plays well, so winAnEasyPveMatch may need
  // several losing attempts first. Those losses also grant xp (just no bonus), which can push the
  // account across a level threshold *before* the eventual win - so the win that finally happens
  // isn't guaranteed to itself be the one crossing a level. Keep winning (bounded) until a level-up
  // is actually observed on a win - with real reward numbers, this is reached within a handful of
  // wins at the latest, since every match (win or loss) always grants some xp.
  let reachedLevel: number | null = null;
  for (let win = 0; win < 6 && reachedLevel === null; win += 1) {
    await winAnEasyPveMatch(page);
    await expect(page.getByRole('dialog', { name: 'Победа' })).toBeVisible();

    const levelUp = page.getByTestId('reward-level-up');
    if ((await levelUp.count()) > 0) {
      const levelUpText = (await levelUp.textContent()) ?? '';
      const levelMatch = levelUpText.match(/Уровень (\d+)/);
      if (levelMatch) reachedLevel = Number(levelMatch[1]);
    }
  }

  expect(reachedLevel, 'expected a level-up to show on at least one of several wins').not.toBeNull();
  expect(reachedLevel!).toBeGreaterThanOrEqual(2);

  await page.goto('/profile');
  await expect(page.getByTestId('profile-level')).toContainText(`Уровень ${reachedLevel}`);
});
