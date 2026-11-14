import { describe, it, expect } from 'vitest';
import { loadPage } from './helpers';

describe('Projects section', () => {
  const $ = loadPage('/');
  const section = $('section#projects');
  const cards = section.find('[data-project]');

  it('uses the numbered label', () => {
    expect(section.find('.label-mono').first().text().trim()).toBe('01 / Selected work');
  });

  it('renders exactly one large card, for the featured project', () => {
    const large = section.find('[data-size="large"]');
    expect(large.length).toBe(1);
    expect(large.attr('data-project')).toBe('extrack');
  });

  it('orders cards by `order`', () => {
    expect(cards.map((_, c) => $(c).attr('data-project')).get()).toEqual([
      'extrack',
      'lumnia',
      'n8n-ai-customer-inquiry',
      'studybot',
      'closure-cafe-pos',
      'kiligram',
      'lost-and-found',
    ]);
  });

  it('links every card to its case study', () => {
    cards.each((_, c) => {
      const id = $(c).attr('data-project');
      expect($(c).find(`a[href="/projects/${id}/"]`).length).toBeGreaterThan(0);
    });
  });

  it('shows a placeholder instead of an image when a project has no cover', () => {
    const bot = section.find('[data-project="studybot"]');
    expect(bot.find('[data-cover-placeholder]').length).toBe(1);
    expect(bot.find('img').length).toBe(0);
  });

  it('shows a real screenshot on every project except StudyBot', () => {
    cards.each((_, c) => {
      const id = $(c).attr('data-project');
      expect($(c).find('img').length, id).toBe(id === 'studybot' ? 0 : 1);
    });
  });

  it('gives every image alt text', () => {
    section.find('img').each((_, img) => {
      expect($(img).attr('alt')?.trim().length).toBeGreaterThan(0);
    });
  });

  it('shows every stack tag, even long lists', () => {
    expect(section.find('[data-project="extrack"] [data-tags] li').length).toBe(7);
  });
});
