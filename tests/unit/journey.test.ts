import { describe, it, expect } from 'vitest';
import { sortJourney, formatRange, formatMonth } from '../../src/lib/journey';

describe('formatMonth', () => {
  it('formats a single point in time', () => {
    expect(formatMonth(new Date('2024-04'))).toBe('Apr 2024');
  });
});

const j = (id: string, start: string) => ({ id, data: { start: new Date(start) } });

describe('sortJourney', () => {
  it('puts the newest start first', () => {
    const out = sortJourney([j('old', '2022-08'), j('new', '2025-01'), j('mid', '2024-06')]);
    expect(out.map((x) => x.id)).toEqual(['new', 'mid', 'old']);
  });
});

describe('formatRange', () => {
  it('shows Present when there is no end', () => {
    expect(formatRange(new Date('2024-06'))).toBe('Jun 2024 — Present');
  });

  it('formats a closed range', () => {
    expect(formatRange(new Date('2022-08'), new Date('2026-05'))).toBe('Aug 2022 — May 2026');
  });

  it('uses UTC so the month never shifts with the local timezone', () => {
    expect(formatRange(new Date('2023-01-01T00:00:00Z'))).toBe('Jan 2023 — Present');
  });
});
