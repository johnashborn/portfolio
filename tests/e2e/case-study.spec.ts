import { test, expect } from '@playwright/test';

test.describe('desktop', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('outline marks the section in view', async ({ page }) => {
    await page.goto('/projects/project-one/');
    // Put the heading 120px below the top of the viewport, as if reading that section.
    await page.evaluate(() => {
      const h = document.getElementById('how-it-works')!;
      window.scrollTo({ top: h.getBoundingClientRect().top + window.scrollY - 120, behavior: 'instant' });
    });
    await expect(page.locator('[data-toc] a[href="#how-it-works"]')).toHaveAttribute('aria-current', 'true');
    await expect(page.locator('[data-toc] a[aria-current="true"]')).toHaveCount(1);
  });

  test('outline marks the last section at the bottom of the page', async ({ page }) => {
    await page.goto('/projects/project-one/');
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
    await expect(page.locator('[data-toc] a[href="#what-i-learned"]')).toHaveAttribute('aria-current', 'true');
  });

  test('clicking a card on the home page opens its case study', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-project="project-one"] .card-link').click();
    await expect(page).toHaveURL(/\/projects\/project-one\/$/);
    await expect(page.locator('h1')).toHaveText('Project One');
    await expect(page.locator('[data-cover] img')).toBeVisible();
  });
});

test.describe('mobile', () => {
  test.use({ viewport: { width: 375, height: 740 } });

  test('an odd number of meta cells leaves no empty box', async ({ page }) => {
    await page.goto('/projects/project-two/');
    const grid = page.locator('[data-meta]');
    await expect(grid.locator('dt')).toHaveCount(3);
    const gridBox = (await grid.boundingBox())!;
    const lastBox = (await grid.locator(':scope > div').last().boundingBox())!;
    // The last cell must stretch across the row instead of leaving a grey gap beside it.
    expect(lastBox.width).toBeGreaterThan(gridBox.width - 4);
  });

  test('hides the outline', async ({ page }) => {
    await page.goto('/projects/project-one/');
    await expect(page.locator('[data-toc]')).toBeHidden();
  });
});
