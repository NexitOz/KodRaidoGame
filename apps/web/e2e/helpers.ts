import { expect, type Page } from '@playwright/test';

/**
 * Maps the tutorial overlay's exact Russian step title (rendered by TutorialOverlay's <h2>) back
 * to the TutorialStepId it represents, so the driver below can react to "whichever step is
 * showing" without duplicating tutorial-objectives.ts's content here.
 */
const STEP_TITLE: Record<string, string> = {
  'Твой Проводник': 'CONDUCTOR',
  'Энергия': 'ENERGY',
  'Персонаж': 'PLAY_CHARACTER',
  'Новобранцы устают с дороги': 'END_TURN',
  'Атака': 'ATTACK',
  'Руна': 'PLAY_RUNE',
  'Трек': 'PLAY_TRACK',
  'Событие': 'PLAY_EVENT',
  'Резонанс': 'RESONANCE',
};

export async function registerFreshUser(page: Page, tag: string) {
  // The uniqueness-bearing suffix must survive to the final username untruncated - slicing a
  // long tag+timestamp string to 20 chars *before* stripping non-alphanumerics (the old code)
  // chopped off the low-order, most-rapidly-changing digits of the timestamp for any tag longer
  // than a few characters, so two runs close together in time could collide on the same
  // truncated username. Building the suffix from base36 time + random up front and never
  // truncating it avoids that regardless of tag length.
  const suffix = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  const email = `e2e-${tag}-${suffix}@test.local`;
  const username = `u${suffix}`.slice(0, 20);
  await page.goto('/register');
  await page.locator('input[type=email]').fill(email);
  await page.locator('input[type=text]').fill(username);
  await page.locator('input[type=password]').fill('testpass123');
  await page.getByRole('button', { name: 'Создать аккаунт' }).click();
  await page.waitForURL('**/collection', { timeout: 15_000 });
  return { email, username };
}

/**
 * Builds and saves a real 30-card deck via the /decks UI, clicking picker cards until the
 * DECK_SIZE (30) total is reached, then saves. Each picker card is clicked twice (COMMON/RARE/
 * EPIC cap at 2 copies, LEGENDARY/RAIDO at 1 - the UI silently clamps a card past its own cap, so
 * clicking is safe even for 1-copy cards) and the loop moves to the next card once the running
 * total stops increasing. Used by closure-verification screenshots that need a genuinely ready
 * deck, not the manual builder flow itself.
 */
export async function buildReadyDeck(page: Page, deckName: string): Promise<void> {
  await page.goto('/decks');
  await page.getByRole('button', { name: '+ Новая колода' }).click();
  await page.waitForTimeout(200);

  // The deck-name field has no explicit `type` attribute (defaults to text implicitly) - target
  // it by DOM order instead of `input[type=text]`, which only matches an explicit attribute.
  const nameInput = page.locator('input').first();
  await nameInput.fill(deckName);

  const pickerCards = page.locator('div.grid.max-h-\\[70dvh\\] button');
  const count = await pickerCards.count();
  for (let i = 0; i < count; i++) {
    const status = page.getByText(/\d+\/30 карт/);
    const before = (await status.textContent()) ?? '0/30';
    if (parseInt(before, 10) >= 30) break;
    await pickerCards.nth(i).click();
    await pickerCards.nth(i).click();
    await page.waitForTimeout(30);
  }

  await page.getByRole('button', { name: 'Сохранить колоду' }).click();
  await page.waitForTimeout(500);
}

export async function currentTutorialStep(page: Page): Promise<string | null> {
  const h2 = page.locator('[role="status"][aria-live="polite"] h2');
  if ((await h2.count()) === 0) return null;
  const text = (await h2.first().textContent())?.trim();
  return text ? (STEP_TITLE[text] ?? `UNKNOWN(${text})`) : null;
}

/**
 * Dismisses the CONDUCTOR/ENERGY tap-driven intro steps by polling for the current step rather
 * than blindly clicking "Понятно" a fixed number of times - the page can still be resolving
 * resolveResumeStep() when the caller starts, so a fixed-count loop can race and leave one step
 * undismissed.
 */
export async function dismissIntroSteps(page: Page, maxIterations = 15): Promise<void> {
  for (let i = 0; i < maxIterations; i++) {
    const step = await currentTutorialStep(page);
    // null means the page hasn't resolved its initial step yet (view+progress still loading),
    // not that it's already past CONDUCTOR/ENERGY - keep waiting rather than returning early.
    if (step === null) {
      await page.waitForTimeout(300);
      continue;
    }
    if (step !== 'CONDUCTOR' && step !== 'ENERGY') return;
    await page.getByRole('button', { name: 'Понятно' }).click();
    await page.waitForTimeout(300);
  }
}

async function hasVisibleAlert(page: Page): Promise<boolean> {
  return (await page.locator('p[role="alert"]').count()) > 0;
}

async function tryConfirmPlayNoTarget(page: Page): Promise<boolean> {
  const btn = page.getByRole('button', { name: 'Сыграть без цели' });
  if ((await btn.count()) === 0) return false;
  await btn.click();
  await page.waitForTimeout(600);
  return !(await hasVisibleAlert(page));
}

async function playTargetFallback(page: Page): Promise<boolean> {
  const enemyConductor = page.locator('button[aria-label*="здоровья"]').first();
  await enemyConductor.click({ timeout: 1000 }).catch(() => {});
  await page.waitForTimeout(400);
  if (!(await hasVisibleAlert(page))) return true;
  const ownConductor = page.locator('button[aria-label*="здоровья"]').last();
  await ownConductor.click({ timeout: 1000 }).catch(() => {});
  await page.waitForTimeout(400);
  return !(await hasVisibleAlert(page));
}

/** Selects the hand card carrying data-tutorial-target={targetKey} and plays it. */
export async function playCardByTarget(page: Page, targetKey: string): Promise<boolean> {
  const card = page.locator(`[data-tutorial-target="${targetKey}"]`).first();
  if ((await card.count()) === 0) return false;
  await card.click();
  await page.waitForTimeout(300);
  const ok = await tryConfirmPlayNoTarget(page);
  return ok ? true : playTargetFallback(page);
}

/**
 * Starts a PRACTICE-difficulty PvE match through the real `/play` UI flow (pick the first ready
 * deck, the "Тест" difficulty, "Начать бой") - the same deterministic no-op-bot setup
 * player-progression.spec.ts already relies on for reproducible reward-pipeline tests. A bot that
 * never plays a card or attacks (see pve-bot.ts) is what makes hand-size/turn-state screenshots
 * reproducible run to run - "Тест" is only ever rendered for `NODE_ENV !== 'production'` (see
 * PlayPage's own `DIFFICULTIES` gate) and rejected server-side in production regardless
 * (MatchesService.createPveMatch), so this never becomes a path a real player can reach.
 */
export async function startPracticePveMatch(page: Page): Promise<void> {
  await page.goto('/play');
  await expect(page.getByText('У тебя нет готовой колоды')).toHaveCount(0);
  const deckButtons = page.locator('section', { hasText: 'Колода' }).first().getByRole('button');
  await expect(deckButtons.first()).toBeVisible({ timeout: 10_000 });
  await deckButtons.first().click();
  await page.getByRole('button', { name: 'Тест' }).click();
  await page.getByRole('button', { name: 'Начать бой' }).click();
  await page.waitForURL(/\/play\/[^/]+$/, { timeout: 20_000 });
}

/**
 * Reads the live hand size straight from `HandFan`'s own `aria-label` ("Рука, N карт") rather
 * than counting DOM cards directly - the same list container also becomes a drop target and
 * (once runes are in play) sits alongside `RuneZone`'s own `role="listitem"` badges, so counting
 * children is more selector-fragile than trusting the label the component already computes from
 * `cards.length`.
 */
export async function getHandSize(page: Page): Promise<number> {
  const label = await page.locator('[role="list"][aria-label^="Рука"]').first().getAttribute('aria-label');
  const match = label?.match(/Рука, (\d+) карт/);
  return match ? Number(match[1]) : 0;
}

/**
 * Ends turns (via the real End Turn control, not an API shortcut) until the viewer's hand reaches
 * at least `target` cards or `maxTurns` is hit. Against the PRACTICE bot this is fully
 * deterministic: it never plays a card or attacks, so the hand only ever grows via the normal
 * per-turn draw, one card closer to `target` every iteration.
 */
export async function advanceHandToSize(page: Page, target: number, maxTurns = 20): Promise<void> {
  for (let i = 0; i < maxTurns; i += 1) {
    if ((await getHandSize(page)) >= target) return;
    const endTurn = page.locator('[data-tutorial-target="end-turn"]');
    if (await endTurn.isEnabled().catch(() => false)) {
      await endTurn.click();
      await page.waitForTimeout(600);
    } else {
      await page.waitForTimeout(300);
    }
  }
}

export async function attackWithReadyUnit(page: Page): Promise<boolean> {
  const attacker = page.locator('[data-tutorial-target="own-board"]').first();
  if ((await attacker.count()) === 0) return false;
  await attacker.click();
  await page.waitForTimeout(300);
  const enemyConductor = page.locator('button[aria-label*="здоровья"]').first();
  await enemyConductor.click({ timeout: 1000 }).catch(() => {});
  await page.waitForTimeout(400);
  if (!(await hasVisibleAlert(page))) return true;
  const enemyUnit = page.locator('button[aria-label*="атака"]').first();
  if ((await enemyUnit.count()) > 0) {
    await enemyUnit.click({ timeout: 1000 }).catch(() => {});
    await page.waitForTimeout(400);
    return !(await hasVisibleAlert(page));
  }
  return false;
}

async function progressGenerically(page: Page): Promise<void> {
  if (await attackWithReadyUnit(page)) return;
  const endTurn = page.locator('[data-tutorial-target="end-turn"]');
  if (await endTurn.isEnabled().catch(() => false)) {
    await endTurn.click();
    await page.waitForTimeout(600);
  }
}

/**
 * Drives a full tutorial match to completion using only generic, type-driven actions - the same
 * approach a real player following the on-screen prompts would take. Stops once the page
 * navigates to /tutorial/victory, or throws if it stalls too long on one step.
 */
export async function driveTutorialToVictory(page: Page, opts: { maxIterations?: number } = {}) {
  const maxIterations = opts.maxIterations ?? 150;
  let lastStep: string | null = 'INIT';
  let stalls = 0;
  const seenSteps: string[] = [];

  for (let i = 0; i < maxIterations; i++) {
    if (page.url().includes('/tutorial/victory')) return { won: true, seenSteps };
    if ((await page.getByText('Учебный бой не удался').count()) > 0) {
      return { won: false, seenSteps };
    }

    const step = await currentTutorialStep(page);
    if (step !== lastStep) {
      lastStep = step;
      stalls = 0;
      if (step) seenSteps.push(step);
    } else if (step !== null) {
      stalls++;
    }
    if (stalls > 25) throw new Error(`Tutorial driver stalled on step ${step}`);

    if (step === 'CONDUCTOR' || step === 'ENERGY') {
      await page.getByRole('button', { name: 'Понятно' }).click();
      await page.waitForTimeout(300);
      continue;
    }
    if (step === 'PLAY_CHARACTER') {
      // The affordable character in hand can vary run to run; if the current one can't be
      // played (e.g. not enough energy yet), end the turn to gain more rather than retrying the
      // same unaffordable card forever - the same fallback the other card-driven steps already
      // use below.
      if (!(await playCardByTarget(page, 'hand-character'))) await progressGenerically(page);
      await page.waitForTimeout(400);
      continue;
    }
    if (step === 'END_TURN') {
      const btn = page.locator('[data-tutorial-target="end-turn"]');
      if (await btn.isEnabled().catch(() => false)) {
        await btn.click();
        await page.waitForTimeout(600);
      } else {
        await page.waitForTimeout(500);
      }
      continue;
    }
    if (step === 'ATTACK') {
      await attackWithReadyUnit(page);
      await page.waitForTimeout(300);
      continue;
    }
    if (step === 'PLAY_RUNE') {
      if (!(await playCardByTarget(page, 'hand-rune'))) await progressGenerically(page);
      await page.waitForTimeout(400);
      continue;
    }
    if (step === 'PLAY_TRACK') {
      if (!(await playCardByTarget(page, 'hand-track'))) await progressGenerically(page);
      await page.waitForTimeout(400);
      continue;
    }
    if (step === 'PLAY_EVENT') {
      if (!(await playCardByTarget(page, 'hand-event'))) await progressGenerically(page);
      await page.waitForTimeout(400);
      continue;
    }
    if (step === 'RESONANCE') {
      const runePlayed = await playCardByTarget(page, 'hand-rune');
      const charPlayed = runePlayed ? false : await playCardByTarget(page, 'hand-character');
      if (!runePlayed && !charPlayed) await progressGenerically(page);
      await page.waitForTimeout(400);
      continue;
    }
    // step === null: DONE - all 9 objectives met, keep playing generically until an actual win.
    if (await attackWithReadyUnit(page)) {
      await page.waitForTimeout(300);
      continue;
    }
    if (await playCardByTarget(page, 'hand-character')) {
      await page.waitForTimeout(400);
      continue;
    }
    await progressGenerically(page);
    await page.waitForTimeout(400);
  }

  throw new Error('Tutorial driver exceeded max iterations without reaching victory or defeat');
}
