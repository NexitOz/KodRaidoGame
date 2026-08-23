import { expect, test, type Page } from '@playwright/test';
import { FIRST_WIN_OF_DAY_BONUS, REWARD_TABLE, levelForXp } from '@kod-raido/shared';
import { attackWithReadyUnit, playCardByTarget, registerFreshUser, startPracticePveMatch } from './helpers';

/**
 * Player Progression & Economy 1.0 end-to-end coverage. Requires the same running local stack as
 * tutorial-fpx.spec.ts / starter-deck-provisioning.spec.ts. Not part of `npm test` / CI; run
 * manually with `npm run test:e2e -w apps/web`.
 *
 * These tests exercise the reward system, not the bot's combat AI - they use the PRACTICE bot
 * difficulty (a deterministic no-op that never plays a card or attacks, see pve-bot.ts), which
 * only exists in non-production builds/environments (see PlayPage's DIFFICULTIES gate and
 * MatchesService.createPveMatch's production rejection). Real players never see or can reach it.
 * This removes any dependency on beating the genuinely-random EASY bot (pve-bot.ts's
 * randomAction) within a bounded number of attempts, which was a real source of flakiness
 * unrelated to anything these tests are meant to verify.
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

/**
 * The PRACTICE bot never plays a card or attacks (see pve-bot.ts), so any player who attacks
 * with ready units each turn wins deterministically - no retry budget needed. A loss here is a
 * real failure (the reward/combat pipeline broke), not expected variance.
 */
async function winPracticeMatch(page: Page): Promise<void> {
  await startPracticePveMatch(page);
  const result = await driveNormalPveToFinish(page);
  if (!result.won) throw new Error('Expected a deterministic win against the PRACTICE bot but lost.');
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

test('fresh user: skip -> win a deterministic PvE match -> result shows XP/Echo -> profile currency increased', async ({
  page,
}) => {
  test.setTimeout(1_200_000);
  await registerFreshUser(page, 'progression-first-win');
  await page.waitForTimeout(500);

  const currencyBefore = await readProfileCurrency(page);

  await winPracticeMatch(page);

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

  await winPracticeMatch(page);
  await expect(page.getByRole('dialog', { name: 'Победа' })).toBeVisible();
  // The very first win of a fresh account always carries the daily bonus.
  await expect(page.getByTestId('reward-first-win-bonus')).toBeVisible();
  const currencyAfterFirst = await readProfileCurrency(page);

  await winPracticeMatch(page);
  await expect(page.getByRole('dialog', { name: 'Победа' })).toBeVisible();
  await expect(page.getByTestId('reward-first-win-bonus')).toHaveCount(0);
  const currencyAfterSecond = await readProfileCurrency(page);

  expect(currencyAfterSecond).toBeGreaterThan(currencyAfterFirst);
});

test('refreshing the finished match result page does not grant a duplicate reward', async ({ page }) => {
  test.setTimeout(1_200_000);
  await registerFreshUser(page, 'progression-refresh');
  await page.waitForTimeout(500);

  await winPracticeMatch(page);
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

  // A fresh account's very first WIN always carries the first-win-of-day bonus, and
  // PVE.WIN.xp + FIRST_WIN_OF_DAY_BONUS.xp already crosses the level-2 threshold (computed from
  // the real economy constants, not hardcoded, so this stays correct if the numbers are ever
  // tuned) - so with the deterministic PRACTICE bot, the very first win is guaranteed to be the
  // one that levels up the account. No retries, no "keep winning until it happens" loop.
  const expectedLevel = levelForXp(REWARD_TABLE.PVE.WIN.xp + FIRST_WIN_OF_DAY_BONUS.xp);
  expect(expectedLevel).toBeGreaterThanOrEqual(2);

  await winPracticeMatch(page);
  await expect(page.getByRole('dialog', { name: 'Победа' })).toBeVisible();

  const levelUp = page.getByTestId('reward-level-up');
  await expect(levelUp).toBeVisible();
  await expect(levelUp).toContainText(`Уровень ${expectedLevel}`);

  await page.goto('/profile');
  await expect(page.getByTestId('profile-level')).toContainText(`Уровень ${expectedLevel}`);
});
