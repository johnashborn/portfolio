import { test, expect } from '@playwright/test';

test('stats count up to their final value when scrolled into view', async ({ page }) => {
  await page.goto('/');
  const first = page.locator('#achievements [data-count-target]').first();
  // Before it is visible, the counter has been reset to start from zero.
  await expect(first).toHaveText('0');
  await page.locator('#achievements').scrollIntoViewIfNeeded();
  await expect(first).toHaveText('7', { timeout: 3000 });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('shows final values immediately and never zero', async ({ page }) => {
    await page.goto('/');
    const first = page.locator('#achievements [data-count-target]').first();
    await expect(first).toHaveText('7');
    await page.locator('#achievements').scrollIntoViewIfNeeded();
    await expect(first).toHaveText('7');
  });
});
