import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// public/cv.pdf is generated from cv/cv.html by `npm run cv`.
const pdf = readFileSync(join(process.cwd(), 'public', 'cv.pdf')).toString('latin1');

describe('public/cv.pdf', () => {
  it('is exactly one page', () => {
    const pages = pdf.match(/\/Type\s*\/Page(?!s)/g) ?? [];
    expect(pages.length).toBe(1);
  });

  it('embeds standard fonts with real text, so ATS software can read it', () => {
    expect(pdf).toMatch(/\/FontFile2|\/FontFile3/);
    expect(pdf).toMatch(/\/ToUnicode/);
    // Type 3 fonts (what Chromium makes from variable fonts) are drawn glyphs that many ATS parsers read poorly.
    expect(pdf).not.toMatch(/\/Subtype\s*\/Type3/);
  });

  it('is the real CV, not the placeholder', () => {
    expect(pdf.length).toBeGreaterThan(10_000);
  });
});
