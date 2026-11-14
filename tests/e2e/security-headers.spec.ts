import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

// `astro preview` doesn't apply netlify.toml headers, so this applies the same Content-Security-Policy
// to every response and checks the site still works under it.
const toml = readFileSync('netlify.toml', 'utf8');
const csp = toml.match(/Content-Security-Policy\s*=\s*"([^"]+)"/)?.[1];

test('netlify.toml sets a Content-Security-Policy and a Permissions-Policy', () => {
  expect(csp).toBeTruthy();
  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).toContain("form-action 'self'");
  expect(toml).toMatch(/Permissions-Policy\s*=/);
});

for (const path of ['/', '/projects/extrack/']) {
  test(`${path} works under the production CSP`, async ({ page }) => {
    test.skip(!csp, 'no CSP configured');
    const violations: string[] = [];
    page.on('console', (m) => /Content Security Policy|Refused to/i.test(m.text()) && violations.push(m.text()));
    await page.route('**/*', async (route) => {
      const response = await route.fetch();
      await route.fulfill({ response, headers: { ...response.headers(), 'content-security-policy': csp! } });
    });
    await page.goto(path);
    // The reveal script ran, so the bundled scripts were allowed.
    await expect(page.locator('html')).toHaveClass(/reveal-ready/);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    expect(violations).toEqual([]);
  });
}

test('the contact form still posts under the production CSP', async ({ page }) => {
  test.skip(!csp, 'no CSP configured');
  await page.route('**/*', async (route) => {
    if (route.request().method() === 'POST') return route.fulfill({ status: 200, body: 'ok' });
    const response = await route.fetch();
    await route.fulfill({ response, headers: { ...response.headers(), 'content-security-policy': csp! } });
  });
  await page.goto('/#contact');
  await page.getByLabel('Name').fill('Ada Recruiter');
  await page.getByLabel('Email').fill('recruiter@example.com');
  await page.getByLabel('Message').fill('We would like to talk about an internship.');
  await page.getByRole('button', { name: /send/i }).click();
  await expect(page.locator('[data-form-success]')).toBeVisible();
});
