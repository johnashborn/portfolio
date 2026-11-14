import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadPage } from './helpers';

const IDS = [
  'extrack',
  'lumnia',
  'n8n-ai-customer-inquiry',
  'studybot',
  'closure-cafe-pos',
  'kiligram',
  'lost-and-found',
];

describe('case study routes', () => {
  it('no longer builds the removed Student Management System page', () => {
    expect(existsSync(join(process.cwd(), 'dist', 'projects', 'student-management-system', 'index.html'))).toBe(false);
  });

  it('builds a page for every project', () => {
    for (const id of IDS) {
      expect(existsSync(join(process.cwd(), 'dist', 'projects', id, 'index.html'))).toBe(true);
    }
  });
});

describe('/projects/extrack/ (featured, no live link)', () => {
  const $ = loadPage('/projects/extrack/');

  it('uses the project title as the only h1', () => {
    expect($('h1').length).toBe(1);
    expect($('h1').text().trim()).toBe('EXTRACK');
  });

  it('shows Role, Type and Stack and omits the missing Timeline', () => {
    const labels = $('[data-meta] dt').map((_, d) => $(d).text().trim()).get();
    expect(labels).toEqual(['Role', 'Type', 'Stack']);
    expect($('[data-meta]').text()).toContain('Solo · full-stack');
  });

  it('shows the source button and omits the live button', () => {
    expect($('a[data-repo]').attr('href')).toBe('https://github.com/johnashborn/EXTRAK');
    expect($('a[data-live]').length).toBe(0);
  });

  it('builds the outline from the ## headings, in order', () => {
    const toc = $('[data-toc] a').map((_, a) => [[$(a).text().trim(), $(a).attr('href')]]).get();
    expect(toc).toEqual([
      ['Overview', '#overview'],
      ['What I built', '#what-i-built'],
      ['How it works', '#how-it-works'],
      ['What I’d improve', '#what-id-improve'], // Markdown smart quotes turn ' into ’
      ['What I learned', '#what-i-learned'],
    ]);
    for (const [, href] of toc as unknown as [string, string][]) {
      expect($(href).length).toBe(1);
    }
  });

  it('links previous and next projects with wrap-around', () => {
    expect($('a[data-prev]').attr('href')).toBe('/projects/lost-and-found/');
    expect($('a[data-next]').attr('href')).toBe('/projects/lumnia/');
  });

  it('links back to the projects section', () => {
    expect($('a[data-back]').attr('href')).toBe('/#projects');
  });

  it('uses the landing-page screenshot as the cover and social image', () => {
    expect($('[data-cover] img').length).toBe(1);
    expect($('meta[property="og:image"]').attr('content')).toMatch(/extrack-landing.*\.png$/);
  });

  it('shows the in-article screenshots with alt text', () => {
    const imgs = $('.prose-case img');
    expect(imgs.length).toBe(2);
    imgs.each((_, img) => expect($(img).attr('alt')?.trim().length).toBeGreaterThan(0));
  });
});

describe('/projects/lumnia/ (startup prototype)', () => {
  const $ = loadPage('/projects/lumnia/');

  it('shows the team role and the Startup type', () => {
    const text = $('[data-meta]').text();
    expect(text).toContain('Team lead & pitcher · team of 3');
    expect(text).toContain('Startup');
  });

  it('has no live or source buttons, since it is a Figma design', () => {
    expect($('a[data-live]').length).toBe(0);
    expect($('a[data-repo]').length).toBe(0);
  });

  it('uses the three-screen prototype image as the cover', () => {
    expect($('[data-cover] img').attr('alt')).toContain('Lumnia');
  });
});

describe('/projects/studybot/ (no cover)', () => {
  it('shows the cover placeholder', () => {
    const $ = loadPage('/projects/studybot/');
    expect($('[data-cover-placeholder]').length).toBe(1);
  });
});

describe('/projects/n8n-ai-customer-inquiry/ (with cover)', () => {
  const $ = loadPage('/projects/n8n-ai-customer-inquiry/');

  it('uses the cover screenshot as the social image', () => {
    expect($('meta[property="og:image"]').attr('content')).toMatch(/n8n-classifier-api.*\.png$/);
  });

  it('highlights code blocks', () => {
    expect($('pre.astro-code').length).toBeGreaterThan(0);
  });
});

describe('/projects/kiligram/ (live site)', () => {
  it('links the live site and the source', () => {
    const $ = loadPage('/projects/kiligram/');
    expect($('a[data-live]').attr('href')).toBe('https://johnashborn.github.io/Kiligram/');
    expect($('a[data-repo]').attr('href')).toBe('https://github.com/johnashborn/Kiligram');
  });

  it('uses the login-screen screenshot as the cover', () => {
    const $ = loadPage('/projects/kiligram/');
    expect($('[data-cover] img').length).toBe(1);
  });
});

describe('/404', () => {
  it('links home', () => {
    const $ = loadPage('/404');
    expect($('main a[href="/"]').length).toBeGreaterThan(0);
  });
});
