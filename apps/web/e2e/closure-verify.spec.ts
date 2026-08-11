import { expect, test, type Page } from '@playwright/test';
import { attackWithReadyUnit, buildReadyDeck, playCardByTarget, registerFreshUser } from './helpers';

/**
 * Premium Visual Closure Pass verification script (not part of the regular regression suite -
 * deleted once its screenshots/findings are captured). Two jobs:
 *  1. Empirically answer "can a new user start normal PvE without manually building a deck?"
 *     by driving the real register -> tutorial -> archetypes -> /play flow.
 *  2. Capture Deck Select (with real ready decks) and Battlefield (normal PvE, no
 *     TutorialOverlay) screenshots at 390x844 and 1440x900.
 */
const DIR = '/tmp/claude-0/-home-user-KodRaidoGame/16c847b4-b2d5-56c2-8b08-11f7baff04ca/scratchpad/screenshots-v2';

async function skipOnboarding(page: Page) {
  await page.waitForTimeout(500);
  const skipBtn = page.getByRole('button', { name: 'Пропустить' });
  if ((await skipBtn.count()) > 0) {
    await skipBtn.click();
    await page.getByRole('button', { name: 'Понятно' }).click();
    await page.waitForTimeout(200);
  }
}

test('VERIFY: new user cannot start normal PvE without a manually-built deck', async ({ page }) => {
  test.setTimeout(300_000);
  await registerFreshUser(page, 'verify-noDeck');
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: /Начать обучение/ }).click();
  await page.waitForURL('**/tutorial/**', { timeout: 15_000 });

  // Drive the tutorial to victory using the same generic driver the regression suite uses.
  const { driveTutorialToVictory } = await import('./helpers');
  const result = await driveTutorialToVictory(page);
  expect(result.won).toBe(true);
  await page.waitForURL('**/tutorial/victory**', { timeout: 20_000 });

  await page.getByRole('link', { name: 'Продолжить' }).click();
  await page.waitForURL('**/tutorial/archetypes');
  await page.screenshot({ path: `${DIR}/verify-archetypes-page.png`, fullPage: true });

  await page.getByRole('link', { name: 'Начать бой' }).click();
  await page.waitForURL('**/play');
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${DIR}/verify-play-after-tutorial.png`, fullPage: true });

  const startBtn = page.getByRole('button', { name: 'Начать бой' });
  const noDeckMessage = page.getByText('У тебя нет готовой колоды');
  const hasNoDeckMessage = (await noDeckMessage.count()) > 0;
  const startDisabled = await startBtn.isDisabled().catch(() => true);

  console.log(
    `CAN_START_PVE_WITHOUT_MANUAL_DECK=${!hasNoDeckMessage && !startDisabled ? 'YES' : 'NO'} ` +
      `(noDeckMessageVisible=${hasNoDeckMessage}, startButtonDisabled=${startDisabled})`,
  );
});

test('SCREENSHOTS: real Deck Select + Battlefield without tutorial overlay', async ({ page, browser }) => {
  test.setTimeout(300_000);
  await registerFreshUser(page, 'shots-real-deck');
  await page.waitForURL('**/collection', { timeout: 15_000 });
  await skipOnboarding(page);

  await buildReadyDeck(page, 'Красный Клинок');
  await buildReadyDeck(page, 'Серебряный Щит');

  // Deck Select at the mobile-project default viewport (390x844).
  await page.goto('/play');
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${DIR}/06-deck-select-390x844.png`, fullPage: true });

  // Select the second deck + a difficulty to show selected state before starting.
  const deckButtons = page.locator('button.group');
  if ((await deckButtons.count()) > 1) {
    await deckButtons.nth(1).click();
    await page.waitForTimeout(200);
  }
  await page.getByRole('button', { name: 'Сложно' }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${DIR}/06b-deck-select-selected.png`, fullPage: true });

  // Start a real normal PvE match (no TutorialOverlay).
  await page.getByRole('button', { name: 'Начать бой' }).click();
  await page.waitForURL('**/play/**', { timeout: 15_000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${DIR}/07-battlefield-opening-390x844.png` });

  // Select a playable hand card without confirming, to capture the "selected" state.
  const handCard = page.locator('[data-tutorial-target^="hand-"]').first();
  if ((await handCard.count()) > 0) {
    await handCard.click();
    await page.waitForTimeout(250);
    await page.screenshot({ path: `${DIR}/07b-selected-card-390x844.png` });
    // Deselect by playing it (or cancel via a second click if the UI supports it) so the loop
    // below starts from a clean state.
    const noTarget = page.getByRole('button', { name: 'Сыграть без цели' });
    if ((await noTarget.count()) > 0) await noTarget.click();
    await page.waitForTimeout(300);
  }

  let capturedRune = false;
  let capturedTrack = false;
  let capturedMidCombat = false;
  for (let i = 0; i < 80; i++) {
    if ((await page.getByRole('dialog').count()) > 0) break;

    if (!capturedRune && (await page.locator('[data-tutorial-target="hand-rune"]').count()) > 0) {
      await playCardByTarget(page, 'hand-rune');
      capturedRune = true;
      await page.waitForTimeout(200);
      await page.screenshot({ path: `${DIR}/10-rune-active-390x844.png` });
      continue;
    }
    if (!capturedTrack && (await page.locator('[data-tutorial-target="hand-track"]').count()) > 0) {
      await playCardByTarget(page, 'hand-track');
      capturedTrack = true;
      await page.waitForTimeout(150);
      await page.screenshot({ path: `${DIR}/11-track-active-390x844.png` });
      continue;
    }
    if (await attackWithReadyUnit(page)) {
      if (!capturedMidCombat) {
        capturedMidCombat = true;
        await page.waitForTimeout(150);
        await page.screenshot({ path: `${DIR}/08-mid-combat-390x844.png` });
      }
      await page.waitForTimeout(200);
      continue;
    }
    if (await playCardByTarget(page, 'hand-character')) {
      await page.waitForTimeout(250);
      continue;
    }
    const endTurn = page.locator('[data-tutorial-target="end-turn"]');
    if (await endTurn.isEnabled().catch(() => false)) {
      await endTurn.click();
      await page.waitForTimeout(500);
    } else {
      await page.waitForTimeout(250);
    }
  }
  await page.screenshot({ path: `${DIR}/12-resonance-390x844.png` });
  if ((await page.getByRole('dialog').count()) > 0) {
    await page.screenshot({ path: `${DIR}/13-result-390x844.png` });
  }

  // 1440x900: a second account with its own ready deck, its own match.
  const desktopCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const desktopPage = await desktopCtx.newPage();
  await registerFreshUser(desktopPage, 'shots-real-deck-1440');
  await desktopPage.waitForURL('**/collection', { timeout: 15_000 });
  await skipOnboarding(desktopPage);
  await buildReadyDeck(desktopPage, 'Резонансный Авангард');

  await desktopPage.goto('/play');
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({ path: `${DIR}/06-deck-select-1440x900.png`, fullPage: true });

  await desktopPage.getByRole('button', { name: 'Начать бой' }).click();
  await desktopPage.waitForURL('**/play/**', { timeout: 15_000 });
  await desktopPage.waitForTimeout(1000);
  await desktopPage.screenshot({ path: `${DIR}/16-battlefield-opening-1440x900.png` });

  let desktopMidCombat = false;
  for (let i = 0; i < 80; i++) {
    if ((await desktopPage.getByRole('dialog').count()) > 0) break;
    if (await attackWithReadyUnit(desktopPage)) {
      if (!desktopMidCombat) {
        desktopMidCombat = true;
        await desktopPage.waitForTimeout(150);
        await desktopPage.screenshot({ path: `${DIR}/16b-mid-combat-1440x900.png` });
      }
      await desktopPage.waitForTimeout(200);
      continue;
    }
    if (await playCardByTarget(desktopPage, 'hand-character')) {
      await desktopPage.waitForTimeout(250);
      continue;
    }
    const endTurn = desktopPage.locator('[data-tutorial-target="end-turn"]');
    if (await endTurn.isEnabled().catch(() => false)) {
      await endTurn.click();
      await desktopPage.waitForTimeout(500);
    } else {
      await desktopPage.waitForTimeout(250);
    }
  }
  await desktopPage.screenshot({ path: `${DIR}/16c-resonance-1440x900.png` });
  if ((await desktopPage.getByRole('dialog').count()) > 0) {
    await desktopPage.screenshot({ path: `${DIR}/17-result-1440x900.png` });
  }
  await desktopCtx.close();

  expect(true).toBe(true);
});
