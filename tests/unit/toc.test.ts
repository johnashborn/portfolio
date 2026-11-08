import { describe, it, expect } from 'vitest';
import { tocFromHeadings } from '../../src/lib/toc';

describe('tocFromHeadings', () => {
  it('keeps only level-2 headings, in order', () => {
    const out = tocFromHeadings([
      { depth: 2, slug: 'overview', text: 'Overview' },
      { depth: 3, slug: 'detail', text: 'Detail' },
      { depth: 2, slug: 'what-i-learned', text: 'What I learned' },
      { depth: 1, slug: 'title', text: 'Title' },
    ]);
    expect(out).toEqual([
      { slug: 'overview', text: 'Overview' },
      { slug: 'what-i-learned', text: 'What I learned' },
    ]);
  });
});
