import { describe, it, expect } from 'vitest';
import { loadPage } from './helpers';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('base layout on /', () => {
  const $ = loadPage('/');

  it('puts a skip link to #main first in the body', () => {
    const first = $('body a[href], body button').first();
    expect(first.attr('href')).toBe('#main');
    expect($('main#main').length).toBe(1);
  });

  it('has SEO and social meta', () => {
    expect($('meta[name="description"]').attr('content')?.length).toBeGreaterThan(20);
    expect($('link[rel="canonical"]').attr('href')).toBe('https://johnreyaranton.netlify.app/');
    expect($('meta[property="og:image"]').attr('content')).toMatch(/^https:\/\/.+\/og\.png$/);
    expect($('meta[name="twitter:card"]').attr('content')).toBe('summary_large_image');
  });

  it('links nav to every section', () => {
    const hrefs = $('header nav a').map((_, a) => $(a).attr('href')).get();
    for (const id of ['#projects', '#achievements', '#journey', '#contact']) {
      expect(hrefs.some((h) => h.endsWith(id))).toBe(true);
    }
  });

  it('offers the CV as a download from the nav', () => {
    const cv = $('header a[href="/cv.pdf"]').first();
    expect(cv.length).toBe(1);
    expect(cv.attr('download')).toBeDefined();
  });

  it('credits the stack in the footer', () => {
    expect($('footer').text()).toContain('Built with Astro');
  });
});

describe('live address', () => {
  it('points robots.txt at the real sitemap', () => {
    const robots = readFileSync(join(process.cwd(), 'public', 'robots.txt'), 'utf8');
    expect(robots).toContain('Sitemap: https://johnreyaranton.netlify.app/sitemap-index.xml');
    expect(robots).not.toContain('yourname');
  });
});
