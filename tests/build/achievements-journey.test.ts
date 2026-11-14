import { describe, it, expect } from 'vitest';
import { loadPage } from './helpers';

const $ = loadPage('/');

describe('Achievements section', () => {
  const section = $('section#achievements');

  it('exists with its numbered label', () => {
    expect(section.length).toBe(1);
    expect(section.find('.label-mono').first().text().trim()).toBe('02 / Track record');
  });

  it('renders each stat with its final value in the HTML and an accessible label', () => {
    const stats = section.find('[data-stat]');
    const values = stats.map((_, s) => $(s).find('[data-count-target]').text().trim()).get();
    expect(values).toEqual(['7', 'Top 25', '1st']);
    expect(stats.eq(1).attr('aria-label')).toBe('Top 25 of 253 entries, Philippine Startup Challenge');
  });

  it('labels the first panel as certifications and training', () => {
    expect(section.find('h3.label-mono').first().text().trim()).toBe('Certifications & training');
  });

  it('lists training without Verify links when there is no link', () => {
    const items = section.find('[data-certifications] li');
    expect(items.length).toBe(3);
    expect(section.find('[data-certifications] a').length).toBe(0);
  });

  it('omits the issuer separator when an entry has no issuer', () => {
    const leadership = section.find('[data-certifications] li').filter((_, li) => $(li).text().includes('Leadership training'));
    expect(leadership.find('p').last().text().trim()).toBe('2025');
  });

  it('lists awards, with a period instead of a single year where needed', () => {
    const awards = section.find('[data-awards] li');
    expect(awards.length).toBe(3);
    const deans = awards.filter((_, li) => $(li).text().includes("Dean's Lister"));
    expect(deans.find('span').last().text().trim()).toBe('Since 2024');
  });
});

describe('Journey section', () => {
  const section = $('section#journey');
  const items = section.find('[data-journey-item]');

  it('exists with its numbered label', () => {
    expect(section.find('.label-mono').first().text().trim()).toBe('03 / Journey');
  });

  it('lists entries oldest first, starting with the degree', () => {
    const titles = items.map((_, i) => $(i).find('[data-title]').text().trim()).get();
    expect(titles).toEqual([
      'BS Information Technology',
      'Built my first website',
      'Public Relations Officer',
      'Ran an AI model offline on a phone',
      'Senator',
      'President',
      'Lumnia made the Top 25 of the Philippine Startup Challenge',
      'Built my first AI automation',
    ]);
  });

  it('shows Present for entries without an end date', () => {
    const edu = items.filter((_, i) => $(i).find('h3').text().includes('BS Information Technology'));
    expect(edu.find('time, [data-range]').text()).toContain('— Present');
  });

  it('shows milestones as a single date, not a range', () => {
    const ms = items.filter((_, i) => $(i).find('[data-type-label]').text().trim() === 'Milestone');
    expect(ms.first().find('[data-range]').text().trim()).toBe('Nov 2024');
  });

  it('describes the President role with the tabulation system and the photobooth', () => {
    const pres = items.filter((_, i) => $(i).find('[data-title]').text().trim() === 'President');
    expect(pres.text()).toContain('tabulation system');
    expect(pres.text()).toContain('photobooth');
  });

  it('dates the Startup Challenge to October 2026', () => {
    const psc = items.filter((_, i) => $(i).find('[data-title]').text().includes('Startup Challenge'));
    expect(psc.find('[data-range]').text().trim()).toBe('Oct 2026');
  });

  it('labels each entry with its type', () => {
    const labels = items.map((_, i) => $(i).find('[data-type-label]').text().trim()).get();
    expect([...new Set(labels)].sort()).toEqual(['Education', 'Milestone', 'Org & leadership']);
  });
});
