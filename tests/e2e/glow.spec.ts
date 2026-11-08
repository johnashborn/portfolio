import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 900 } });

test('card glow follows the pointer', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('[data-project="project-two"]');
  await card.scrollIntoViewIfNeeded();
  const box = (await card.boundingBox())!;
  await page.mouse.move(box.x + 120, box.y + 80);
  await expect
    .poll(async () => card.evaluate((el) => parseFloat((el as HTMLElement).style.getPropertyValue('--x'))))
    .toBeCloseTo(120, -1);
  const y = await card.evaluate((el) => parseFloat((el as HTMLElement).style.getPropertyValue('--y')));
  expect(y).toBeCloseTo(80, -1);
});
