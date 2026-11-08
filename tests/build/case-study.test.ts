import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadPage } from './helpers';

describe('case study routes', () => {
  it('builds a page for every project', () => {
    for (const id of ['project-one', 'project-two', 'project-three']) {
      expect(existsSync(join(process.cwd(), 'dist', 'projects', id, 'index.html'))).toBe(true);
    }
  });
});

describe('/projects/project-one/', () => {
  const $ = loadPage('/projects/project-one/');

  it('uses the project title as the only h1', () => {
    expect($('h1').length).toBe(1);
    expect($('h1').text().trim()).toBe('Project One');
  });

  it('shows the Role, Timeline, Type and Stack meta row', () => {
    const labels = $('[data-meta] dt').map((_, d) => $(d).text().trim()).get();
    expect(labels).toEqual(['Role', 'Timeline', 'Type', 'Stack']);
    expect($('[data-meta]').text()).toContain('Solo · full-stack');
  });

  it('shows live and source buttons', () => {
    expect($('a[data-live]').attr('href')).toBe('https://example.com');
    expect($('a[data-repo]').attr('href')).toBe('https://github.com/your-username/project-one');
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
    expect($('a[data-prev]').attr('href')).toBe('/projects/project-three/');
    expect($('a[data-next]').attr('href')).toBe('/projects/project-two/');
  });

  it('links back to the projects section', () => {
    expect($('a[data-back]').attr('href')).toBe('/#projects');
  });

  it('uses the cover as the social image', () => {
    expect($('meta[property="og:image"]').attr('content')).toMatch(/project-one.*\.svg$/);
  });

  it('highlights code blocks', () => {
    expect($('pre.astro-code').length).toBeGreaterThan(0);
  });
});

describe('/projects/project-three/ (sparse project)', () => {
  const $ = loadPage('/projects/project-three/');

  it('omits link buttons that have no URL', () => {
    expect($('a[data-live]').length).toBe(0);
    expect($('a[data-repo]').length).toBe(0);
  });

  it('omits empty meta cells', () => {
    const labels = $('[data-meta] dt').map((_, d) => $(d).text().trim()).get();
    expect(labels).toEqual(['Type', 'Stack']);
  });

  it('shows the cover placeholder', () => {
    expect($('[data-cover-placeholder]').length).toBe(1);
  });
});

describe('/404', () => {
  it('links home', () => {
    const $ = loadPage('/404');
    expect($('main a[href="/"]').length).toBeGreaterThan(0);
  });
});
