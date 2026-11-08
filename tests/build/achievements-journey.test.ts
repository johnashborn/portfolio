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
    expect(stats.length).toBe(3);
    const values = stats.map((_, s) => $(s).find('[data-count-target]').text().trim()).get();
    expect(values).toEqual(['8', '2', '1']);
    stats.each((_, s) => expect($(s).attr('aria-label')).toMatch(/^\d+ .+/));
  });

  it('links certifications to their verify pages in a new tab', () => {
    const verify = section.find('[data-certifications] a');
    expect(verify.length).toBe(2);
    verify.each((_, a) => {
      expect($(a).text()).toContain('Verify');
      expect($(a).attr('target')).toBe('_blank');
    });
  });

  it('lists awards', () => {
    expect(section.find('[data-awards] li').length).toBe(1);
  });
});

describe('Journey section', () => {
  const section = $('section#journey');
  const items = section.find('[data-journey-item]');

  it('exists with its numbered label', () => {
    expect(section.find('.label-mono').first().text().trim()).toBe('03 / Journey');
  });

  it('lists entries newest first', () => {
    const titles = items.map((_, i) => $(i).find('[data-title]').text().trim()).get();
    expect(titles).toEqual([
      'Website for a local business',
      'Web Development Lead',
      'Deployed my first full-stack app',
      'BS Information Technology',
    ]);
  });

  it('shows Present for entries without an end date', () => {
    const edu = items.filter((_, i) => $(i).find('h3').text().includes('BS Information Technology'));
    expect(edu.find('time, [data-range]').text()).toContain('— Present');
  });

  it('shows milestones as a single date, not a range', () => {
    const ms = items.filter((_, i) => $(i).find('[data-type-label]').text().trim() === 'Milestone');
    expect(ms.find('[data-range]').text().trim()).toBe('Apr 2024');
  });

  it('labels each entry with its type', () => {
    const labels = items.map((_, i) => $(i).find('[data-type-label]').text().trim()).get();
    expect(labels.sort()).toEqual(['Education', 'Freelance', 'Milestone', 'Org & leadership']);
  });
});
