import { expect, test } from '@playwright/test';
import { registerFreshUser } from './helpers';

/**
 * Visual Polish 1.0 interaction coverage (section 40 of docs/visual-polish-01.md). Deliberately
 * behavior/layout assertions, not pixel-diff snapshots - a hover-glow color shifting a few RGB
 * values shouldn't break CI, but a card that can't be selected or a layout that overflows should.
 * The tutorial golden-path test already exercises battle entry + Character/Rune/Track plays +
 * attack + the result modal, so this file focuses on the screens that test doesn't touch:
 * Collection filtering/detail and small-viewport layout safety.
 */

test('collection: filtering and opening the cinematic card detail both work', async ({ page }) => {
  await registerFreshUser(page, 'collection-vp');
  await page.waitForURL('**/collection', { timeout: 15_000 });

  const grid = page.locator('div.grid').first();
  await expect(grid).toBeVisible();
  const initialCount = await grid.locator('button').count();
  expect(initialCount).toBeGreaterThan(0);

  // Rarity filter narrows (or at least never grows) the visible grid, proving the filter buttons
  // added in this phase still drive the same underlying `filtered` state.
  await page.getByRole('button', { name: 'Legendary', exact: true }).click();
  await page.waitForTimeout(200);
  const filteredCount = await grid.locator('button').count();
  expect(filteredCount).toBeLessThanOrEqual(initialCount);
  expect(filteredCount).toBeGreaterThan(0);

  // Card Detail cinematic mode: opening a (still Legendary-filtered) card shows its dialog with
  // a close control that actually closes it.
  await grid.locator('button').first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Закрыть' })).toBeVisible();
  await dialog.getByRole('button', { name: 'Закрыть' }).click();
  await expect(dialog).toBeHidden();
});

test('360x800 mobile: collection grid and bottom nav have no horizontal overflow', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 360, height: 800 } });
  const page = await context.newPage();
  await registerFreshUser(page, 'collection-360');
  await page.waitForURL('**/collection', { timeout: 15_000 });
  await page.waitForTimeout(500);

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);

  const bottomNav = page.locator('nav');
  await expect(bottomNav).toBeVisible();
  const navBox = await bottomNav.boundingBox();
  expect(navBox).not.toBeNull();
  if (navBox) expect(navBox.width).toBeLessThanOrEqual(360);

  await context.close();
});

test('home: hero renders with primary CTA and featured cards', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('main').getByRole('link', { name: 'Играть' })).toBeVisible();
  const cards = page.locator('div.grid').last().locator('button');
  await expect(cards.first()).toBeVisible();
});
