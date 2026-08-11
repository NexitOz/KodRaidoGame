import { expect, test } from '@playwright/test';
import { registerFreshUser } from './helpers';

/**
 * Navigation/layout regression coverage from the Visual Polish 1.0 closure pass: BottomNav's
 * logged-out gating, and horizontal-overflow safety at the narrowest supported viewport (360px).
 * The second test caught a real bug (TopBar overflowed at 360px for logged-out users) - kept
 * here permanently rather than as a one-off script.
 */
test('logged-out mobile Home has no BottomNav, logged-in does', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('nav')).toHaveCount(0);
  await expect(page.getByRole('main').getByRole('link', { name: 'Играть' })).toBeVisible();

  await registerFreshUser(page, 'qa-nav');
  await page.waitForTimeout(400);
  await expect(page.locator('nav')).toHaveCount(1);
  await expect(page.locator('nav').getByRole('link', { name: 'Играть' })).toBeVisible();
});

test('no horizontal overflow on Home/Collection/Decks at 360x800', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 360, height: 800 } });
  const page = await context.newPage();
  for (const path of ['/', '/collection', '/decks']) {
    await page.goto(path);
    await page.waitForTimeout(300);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth, `${path} should not overflow horizontally`).toBeLessThanOrEqual(clientWidth);
  }
  await context.close();
});
