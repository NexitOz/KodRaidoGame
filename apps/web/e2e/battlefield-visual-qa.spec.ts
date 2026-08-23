import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { test, expect, type Page } from '@playwright/test';
import { registerFreshUser, startPracticePveMatch, advanceHandToSize } from './helpers';

/**
 * Battlefield Visual QA screenshot matrix. Requires the same running local stack as every other
 * spec in this directory (see playwright.config.ts header) - not part of `npm test` / CI's
 * default suite; run manually with `npm run test:e2e -w apps/web` or via the dedicated
 * `.github/workflows/battlefield-visual-qa.yml` workflow_dispatch job.
 *
 * Produces real, non-mocked screenshots of the live app (PRACTICE-bot PvE for the
 * deterministic single-player states, a genuine 2-client PvP match for the opponent-turn state)
 * into artifacts/battlefield-visual-qa/, plus a manifest.json recording each screenshot's
 * viewport and scrollWidth/clientWidth/scrollHeight/clientHeight overflow metrics so a reviewer
 * can check for overflow without opening every PNG by hand. This is a compact-but-sufficient
 * matrix (12 shots), not a full state x viewport cross product - see docs comment above each
 * capture block for why each viewport only covers the states most likely to expose it.
 */

const OUT_DIR = path.join(__dirname, '..', '..', '..', 'artifacts', 'battlefield-visual-qa');

const V390 = { width: 390, height: 844 };
const V412 = { width: 412, height: 915 };
const V360 = { width: 360, height: 800 };
const V1440 = { width: 1440, height: 900 };

interface ShotRecord {
  filename: string;
  state: string;
  viewport: { width: number; height: number };
  scrollWidth: number;
  clientWidth: number;
  scrollHeight: number;
  clientHeight: number;
  hOverflow: boolean;
  vOverflow: boolean;
}

const records: ShotRecord[] = [];

async function captureAndRecord(
  page: Page,
  filename: string,
  state: string,
  viewport: { width: number; height: number },
): Promise<void> {
  await page.waitForTimeout(300);
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    scrollHeight: document.documentElement.scrollHeight,
    clientHeight: document.documentElement.clientHeight,
  }));
  await page.screenshot({ path: path.join(OUT_DIR, filename) });
  records.push({
    filename,
    state,
    viewport,
    ...metrics,
    hOverflow: metrics.scrollWidth > metrics.clientWidth,
    vOverflow: metrics.scrollHeight > metrics.clientHeight,
  });
}

test.beforeAll(() => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
});

/** Reads a workflow-provided value, treating empty string (an unset `${{ }}` expression) as absent. */
function envOrNull(name: string): string | null {
  const value = process.env[name];
  return value && value.trim() ? value.trim() : null;
}

function localGit(args: string[]): string | null {
  try {
    return execSync(`git ${args.join(' ')}`, { cwd: __dirname }).toString().trim() || null;
  } catch {
    return null;
  }
}

test.afterAll(() => {
  // Runs even if the test above threw partway through, so a broken run still leaves a manifest
  // describing whatever screenshots it did manage to capture instead of nothing at all.
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Commit identity is passed in explicitly by the workflow rather than read from GITHUB_SHA,
  // because on a `pull_request` event GITHUB_SHA is the ephemeral refs/pull/N/merge commit - it
  // is genuinely what got checked out and tested, but it is NOT the PR head a reviewer sees, and
  // reporting it alone as "commit" made the manifest look like it tested something unrelated.
  // Recording all three separately (what ran, what the PR points at, what it merges into) removes
  // that ambiguity. On workflow_dispatch there is no PR context, so prHeadSha/baseSha are null and
  // testedSha/branch come straight from the dispatched ref; running locally, all of it falls back
  // to the working copy's own git state.
  const manifest = {
    testedSha: envOrNull('VQA_TESTED_SHA') ?? localGit(['rev-parse', 'HEAD']),
    prHeadSha: envOrNull('VQA_PR_HEAD_SHA'),
    baseSha: envOrNull('VQA_BASE_SHA'),
    branch: envOrNull('VQA_BRANCH') ?? localGit(['rev-parse', '--abbrev-ref', 'HEAD']),
    runId: envOrNull('VQA_RUN_ID'),
    eventName: envOrNull('VQA_EVENT_NAME') ?? 'local',
    timestamp: new Date().toISOString(),
    screenshots: records,
  };
  fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));

  const overflowing = records.filter((r) => r.hOverflow || r.vOverflow);
  const lines = [
    `Battlefield Visual QA - ${records.length} screenshot(s)`,
    `Tested SHA: ${manifest.testedSha ?? 'unknown'}`,
    `PR head SHA: ${manifest.prHeadSha ?? 'n/a'}`,
    `Base SHA: ${manifest.baseSha ?? 'n/a'}`,
    `Branch: ${manifest.branch ?? 'unknown'}`,
    `Event: ${manifest.eventName}${manifest.runId ? ` (run ${manifest.runId})` : ''}`,
    `Generated: ${manifest.timestamp}`,
    '',
    ...records.map(
      (r) =>
        `${r.filename} - ${r.state} @ ${r.viewport.width}x${r.viewport.height}` +
        (r.hOverflow || r.vOverflow ? '  [OVERFLOW]' : ''),
    ),
    '',
    overflowing.length > 0 ? `OVERFLOW DETECTED in ${overflowing.length} screenshot(s).` : 'No overflow detected.',
  ];
  fs.writeFileSync(path.join(OUT_DIR, 'summary.md'), lines.join('\n'));
});

test('battlefield visual QA screenshot matrix', async ({ page, browser }) => {
  test.setTimeout(300_000);

  // --- 390x844 (this project's own viewport): the full single-player state sequence, driven
  // through one continuous PRACTICE-bot match so "midgame" -> "dense hand" -> "end turn" states
  // are all genuinely reached in order, not synthesized. ---
  await registerFreshUser(page, 'vqa');
  await startPracticePveMatch(page);
  await page.waitForTimeout(800);
  await captureAndRecord(page, '390x844-opening-player.png', 'opening-player', V390);

  await advanceHandToSize(page, 6);
  await captureAndRecord(page, '390x844-midgame.png', 'midgame', V390);

  await advanceHandToSize(page, 8);
  await captureAndRecord(page, '390x844-dense-hand-8.png', 'dense-hand-8', V390);

  await advanceHandToSize(page, 10);
  await captureAndRecord(page, '390x844-dense-hand-10.png', 'dense-hand-10', V390);

  const firstCard = page.locator('[role="listitem"][aria-label*="нажмите"]').first();
  await firstCard.click({ force: true });
  await page.waitForTimeout(500);
  await captureAndRecord(page, '390x844-card-modal.png', 'card-modal', V390);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  const endTurnBtn = page.locator('[data-tutorial-target="end-turn"]');
  await expect(endTurnBtn).toBeEnabled();
  await captureAndRecord(page, '390x844-endturn-ready.png', 'endturn-ready', V390);

  // Delay the underlying action request so the button's real "pending" visual (aria-label
  // "Обработка...", see EndTurnArtifact.tsx) is genuinely on screen when captured, rather than
  // faked with CSS.
  await page.route('**/matches/*/actions', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await route.continue();
  });
  const actionResponse = page.waitForResponse((resp) => resp.url().includes('/actions'));
  await endTurnBtn.click();
  await page.waitForTimeout(300);
  await captureAndRecord(page, '390x844-endturn-pending.png', 'endturn-pending', V390);
  // Wait for the delayed response to actually land before removing the route handler - unrouting
  // while our handler's setTimeout is still pending races its eventual route.continue() call.
  await actionResponse;
  await page.unroute('**/matches/*/actions');
  await page.waitForTimeout(500);

  // --- 412x915 and 360x800: reuse the same authenticated session/match (via storageState) at
  // the two viewport sizes most likely to expose density/overflow regressions - a fresh dense
  // hand at each, rather than every state at every size. ---
  const storageState = await page.context().storageState();
  const matchUrl = page.url();

  const ctx412 = await browser.newContext({ viewport: V412, storageState });
  const page412 = await ctx412.newPage();
  await page412.goto(matchUrl);
  await page412.waitForTimeout(800);
  await captureAndRecord(page412, '412x915-midgame.png', 'midgame', V412);
  await advanceHandToSize(page412, 10);
  await captureAndRecord(page412, '412x915-dense-hand-10.png', 'dense-hand-10', V412);
  const denseUrl = page412.url();
  await ctx412.close();

  const ctx360 = await browser.newContext({ viewport: V360, storageState });
  const page360 = await ctx360.newPage();
  await page360.goto(denseUrl);
  await page360.waitForTimeout(800);
  await captureAndRecord(page360, '360x800-overflow-check.png', 'overflow-check', V360);
  await ctx360.close();

  const ctxDesktop = await browser.newContext({ viewport: V1440, storageState });
  const pageDesktop = await ctxDesktop.newPage();
  await pageDesktop.goto(denseUrl);
  await pageDesktop.waitForTimeout(800);
  await captureAndRecord(pageDesktop, '1440x900-desktop-regression.png', 'desktop-regression', V1440);
  await ctxDesktop.close();

  // --- opponent-turn: only reachable via a genuine two-client PvP match, not a PvE state, since
  // the PRACTICE bot never ends its own turn. ---
  const p1Context = await browser.newContext({ viewport: V390 });
  const p1Page = await p1Context.newPage();
  await registerFreshUser(p1Page, 'vqa-pvp1');

  const p2Context = await browser.newContext({ viewport: V390 });
  const p2Page = await p2Context.newPage();
  await registerFreshUser(p2Page, 'vqa-pvp2');

  await p1Page.goto('/pvp');
  await p1Page.getByRole('button', { name: 'Найти матч' }).click();
  await p2Page.goto('/pvp');
  await p2Page.getByRole('button', { name: 'Найти матч' }).click();

  await p1Page.waitForURL(/\/pvp\/[^/]+$/, { timeout: 30_000 });
  await p2Page.waitForURL(/\/pvp\/[^/]+$/, { timeout: 30_000 });
  await p1Page.waitForTimeout(1200);

  const p1Waiting = (await p1Page.getByText('Ход соперника').count()) > 0;
  const waitingPage = p1Waiting ? p1Page : p2Page;
  await expect(waitingPage.getByText('Ход соперника')).toBeVisible({ timeout: 10_000 });
  await captureAndRecord(waitingPage, '390x844-opponent-turn.png', 'opponent-turn', V390);

  await p1Context.close();
  await p2Context.close();
});
