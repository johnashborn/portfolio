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
  // Wait for the reveal script or, on a machine too busy to start it within 3s, the failsafe that shows everything.
  const html = page.locator('html');
  await expect(html).toHaveClass(/reveal-ready|reveal-failed/);
  if (/reveal-failed/.test((await html.getAttribute('class')) ?? '')) {
    expect(await target.evaluate((el) => Number(getComputedStyle(el).opacity))).toBe(1);
    return;
  }
  expect(await target.evaluate((el) => Number(getComputedStyle(el).opacity))).toBe(0);
  await target.scrollIntoViewIfNeeded();
  await expect.poll(() => target.evaluate((el) => Number(getComputedStyle(el).opacity))).toBe(1);
});

for (const path of ['/', '/projects/extrack/']) {
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
  await page.locator('[data-project="extrack"] .card-link').click();
  await expect(page).toHaveURL(/extrack/);
  await page.locator('a[data-back]').click();
  await expect(page).toHaveURL(/\/#projects$/);
  // The reveal script re-attaches on astro:page-load. Scroll only once it has revealed what is on screen,
  // otherwise a slow machine scrolls past the hero before the script is watching it.
  await page.waitForFunction(() => document.querySelector('#projects [data-reveal][data-revealed]'));
  await scrollThrough(page);
  // Wait for the reveal to finish rather than a fixed time: a batch can take up to 360ms of stagger + 550ms of fade.
  await expect.poll(async () => (await opacities(page)).every((o) => o === 1)).toBe(true);
  await expect(page.locator('#achievements [data-count-target]').first()).toHaveText('7');
});

for (const path of ['/', '/projects/n8n-ai-customer-inquiry/', '/projects/lost-and-found/', '/thanks/']) {
  test(`no horizontal scroll at 320px on ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto(path);
    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(width).toBeLessThanOrEqual(320);
  });
}

for (const path of ['/', '/projects/extrack/']) {
  test(`no console errors on ${path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(path);
    await scrollThrough(page);
    expect(errors).toEqual([]);
  });
}
