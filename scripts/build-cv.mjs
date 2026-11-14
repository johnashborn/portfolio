// Renders cv/cv.html to public/cv.pdf with Playwright's Chromium. Run: npm run cv
import { chromium } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const source = pathToFileURL(resolve('cv/cv.html')).href;
const output = resolve('public/cv.pdf');

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(source, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: output, preferCSSPageSize: true, printBackground: true, tagged: true });
await browser.close();
console.log(`Saved ${output}`);
