import { describe, it, expect } from 'vitest';
import { loadPage } from './helpers';
import { site } from '../../src/site';

describe('Me section', () => {
  const $ = loadPage('/');
  const me = $('section#me');

  it('has exactly one h1 containing the name', () => {
    expect($('h1').length).toBe(1);
    expect(me.find('h1').text()).toContain(site.name);
  });

  it('says Information Technology student', () => {
    expect(me.text()).toContain('Information Technology student');
  });

  it('shows the status pill from config', () => {
    expect(me.find('[data-status]').text().trim()).toBe(site.status);
  });

  it('links the three hero buttons', () => {
    expect(me.find('a[href="#projects"]').length).toBe(1);
    expect(me.find('a[href="/cv.pdf"]').attr('download')).toBeDefined();
    const gh = me.find(`a[href="${site.socials.github}"]`);
    expect(gh.attr('target')).toBe('_blank');
    expect(gh.attr('rel')).toContain('noopener');
  });

  it('falls back to a single-column layout without a photo', () => {
    expect(me.attr('data-layout')).toBe('single');
    expect(me.find('img').length).toBe(0);
  });

  it('lists every stack item with an icon', () => {
    const names = me.find('[data-stack] li').map((_, li) => $(li).text().trim()).get();
    expect(names).toEqual(site.stack.map((s) => s.name));
    expect(me.find('[data-stack] li svg').length).toBe(site.stack.length);
  });

  it('never implies experience the owner does not have', () => {
    const text = $('body').text();
    expect(text).not.toMatch(/Computer Science/i);
    expect(text).not.toMatch(/years of experience/i);
  });
});
