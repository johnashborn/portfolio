import { describe, it, expect } from 'vitest';
import { hasAchievements, parseStat } from '../../src/lib/achievements';

describe('hasAchievements', () => {
  it('is false only when every list is empty', () => {
    expect(hasAchievements({ stats: [], certifications: [], awards: [] })).toBe(false);
  });

  it.each([
    [{ stats: [1], certifications: [], awards: [] }],
    [{ stats: [], certifications: [1], awards: [] }],
    [{ stats: [], certifications: [], awards: [1] }],
  ])('is true when any list has items (%#)', (a) => {
    expect(hasAchievements(a)).toBe(true);
  });
});

describe('parseStat', () => {
  it('parses a plain number', () => {
    expect(parseStat('8')).toEqual({ num: 8, prefix: '', suffix: '' });
  });

  it('keeps a trailing plus', () => {
    expect(parseStat('3+')).toEqual({ num: 3, prefix: '', suffix: '+' });
  });

  it('keeps a trailing percent', () => {
    expect(parseStat('100%')).toEqual({ num: 100, prefix: '', suffix: '%' });
  });

  it('keeps a leading prefix', () => {
    expect(parseStat('#1')).toEqual({ num: 1, prefix: '#', suffix: '' });
  });

  it('returns null when there is no number', () => {
    expect(parseStat('A+')).toBeNull();
  });
});
