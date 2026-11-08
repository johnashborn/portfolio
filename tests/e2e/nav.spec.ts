import { test, expect } from '@playwright/test';

test.describe('mobile menu', () => {
  test.use({ viewport: { width: 375, height: 740 } });

  test('opens, traps focus, and closes on Escape', async ({ page }) => {
    await page.goto('/');
    const button = page.getByRole('button', { name: /menu/i });
    await expect(button).toHaveAttribute('aria-expanded', 'false');

    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    const sheet = page.locator('#mobile-menu');
    await expect(sheet).toBeVisible();
    await expect(sheet.locator(':focus')).toHaveCount(1);

    // Tab many times — focus must stay inside the sheet or on the toggle button.
    for (let i = 0; i < 12; i++) await page.keyboard.press('Tab');
    const inside = await page.evaluate(() => {
      const el = document.activeElement;
      return !!el && (!!el.closest('#mobile-menu') || el.id === 'menu-button');
    });
    expect(inside).toBe(true);

    await page.keyboard.press('Escape');
    await expect(sheet).toBeHidden();
    await expect(button).toBeFocused();
  });

  test('closes after choosing a link', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /menu/i }).click();
    await page.locator('#mobile-menu a[href$="#contact"]').click();
    await expect(page.locator('#mobile-menu')).toBeHidden();
  });
});

test.describe('desktop nav', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('shows inline links and hides the menu button', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header nav a[href$="#projects"]').first()).toBeVisible();
    await expect(page.getByRole('button', { name: /menu/i })).toBeHidden();
  });
});
