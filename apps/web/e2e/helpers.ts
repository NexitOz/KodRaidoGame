import type { Page } from '@playwright/test';

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
