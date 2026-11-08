import { test, expect, type Page } from '@playwright/test';
import { site } from '../../src/site';

async function fill(page: Page, email = 'recruiter@example.com') {
  await page.goto('/#contact');
  await page.getByLabel('Name').fill('Ada Recruiter');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Message').fill('We would like to talk about an internship.');
}

test('submits via fetch with form-name and shows inline success', async ({ page }) => {
  let body = '';
  await page.route('**/', async (route) => {
    if (route.request().method() !== 'POST') return route.fallback();
    body = route.request().postData() ?? '';
    await new Promise((r) => setTimeout(r, 300));
    await route.fulfill({ status: 200, body: 'ok' });
  });
  await fill(page);
  const button = page.getByRole('button', { name: /send/i });
  await button.click();
  await expect(button).toHaveText(/Sending…/);
  const success = page.locator('[data-form-success]');
  await expect(success).toBeVisible();
  await expect(success).toBeFocused();
  expect(body).toContain('form-name=contact');
  expect(body).toContain('recruiter%40example.com');
  expect(new URL(page.url()).pathname).toBe('/');
});

test('keeps the message and shows the email address when sending fails', async ({ page }) => {
  await page.route('**/', (route) =>
    route.request().method() === 'POST' ? route.fulfill({ status: 500, body: 'nope' }) : route.fallback(),
  );
  await fill(page);
  await page.getByRole('button', { name: /send/i }).click();
  const error = page.locator('[data-form-error]');
  await expect(error).toBeVisible();
  await expect(error).toContainText(site.email);
  await expect(page.getByLabel('Message')).toHaveValue('We would like to talk about an internship.');
});

test('rejects an invalid email without sending', async ({ page }) => {
  let posted = false;
  await page.route('**/', (route) => {
    if (route.request().method() === 'POST') posted = true;
    return route.fallback();
  });
  await fill(page, 'not-an-email');
  await page.getByRole('button', { name: /send/i }).click();
  const email = page.getByLabel('Email');
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  const describedBy = await email.getAttribute('aria-describedby');
  expect(describedBy).toBeTruthy();
  await expect(page.locator(`#${describedBy}`)).not.toBeEmpty();
  expect(posted).toBe(false);
});

test('copy email button copies the address @copy', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/#contact');
  await page.locator('[data-copy-email]').click();
  await expect(page.locator('[data-copy-email]')).toContainText('Copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(site.email);
});

test('posts to /thanks without JavaScript @nojs', async ({ page }) => {
  await page.route('**/thanks', (route) =>
    route.request().method() === 'POST'
      ? route.fulfill({ status: 200, contentType: 'text/html', body: '<h1>Thanks</h1>' })
      : route.fallback(),
  );
  await fill(page);
  await page.getByRole('button', { name: /send/i }).click();
  await expect(page).toHaveURL(/\/thanks$/);
});
