import { test, expect, type Page } from '@playwright/test';

const opacities = (page: Page) =>
  page.$$eval('[data-reveal]', (els) => els.map((el) => Number(getComputedStyle(el).opacity)));

async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += 400) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  await page.waitForTimeout(900);
}

test('reveals content that starts below the fold as it scrolls in', async ({ page }) => {
  await page.goto('/');
  const target = page.locator('#journey [data-reveal]').first();
  expect(await target.evaluate((el) => Number(getComputedStyle(el).opacity))).toBe(0);
  await target.scrollIntoViewIfNeeded();
  await expect.poll(() => target.evaluate((el) => Number(getComputedStyle(el).opacity))).toBe(1);
});

for (const path of ['/', '/projects/project-one/']) {
  test(`everything is visible without JavaScript on ${path} @nojs`, async ({ page }) => {
    await page.goto(path);
    expect((await opacities(page)).every((o) => o === 1)).toBe(true);
  });
}

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('shows everything immediately without scrolling', async ({ page }) => {
    await page.goto('/');
    expect((await opacities(page)).every((o) => o === 1)).toBe(true);
  });
});

test('scripts re-initialise after client-side navigation', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-project="project-one"] .card-link').click();
  await expect(page).toHaveURL(/project-one/);
  await page.locator('a[data-back]').click();
  await expect(page).toHaveURL(/\/#projects$/);
  await scrollThrough(page);
  expect((await opacities(page)).every((o) => o === 1)).toBe(true);
  await expect(page.locator('#achievements [data-count-target]').first()).toHaveText('8');
});

for (const path of ['/', '/projects/project-three/', '/thanks/']) {
  test(`no horizontal scroll at 320px on ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto(path);
    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(width).toBeLessThanOrEqual(320);
  });
}

for (const path of ['/', '/projects/project-one/']) {
  test(`no console errors on ${path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(path);
    await scrollThrough(page);
    expect(errors).toEqual([]);
  });
}
