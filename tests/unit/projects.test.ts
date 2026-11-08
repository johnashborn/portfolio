import { describe, it, expect } from 'vitest';
import { orderProjects, splitFeatured, getPrevNext } from '../../src/lib/projects';

const p = (id: string, order: number, featured = false, draft = false) => ({
  id,
  data: { order, featured, draft },
});

describe('orderProjects', () => {
  const items = [p('c', 3), p('a', 1), p('draft', 2, false, true), p('b', 2)];

  it('sorts ascending by order and drops drafts', () => {
    expect(orderProjects(items, { includeDrafts: false }).map((x) => x.id)).toEqual(['a', 'b', 'c']);
  });

  it('keeps drafts when includeDrafts is true', () => {
    expect(orderProjects(items, { includeDrafts: true }).map((x) => x.id)).toContain('draft');
  });

  it('does not mutate the input', () => {
    const copy = [...items];
    orderProjects(items, { includeDrafts: false });
    expect(items).toEqual(copy);
  });
});

describe('splitFeatured', () => {
  it('picks the first featured item and removes it from rest', () => {
    const { featured, rest } = splitFeatured([p('a', 1), p('b', 2, true), p('c', 3)]);
    expect(featured?.id).toBe('b');
    expect(rest.map((x) => x.id)).toEqual(['a', 'c']);
  });

  it('falls back to the first item when nothing is featured', () => {
    const { featured, rest } = splitFeatured([p('a', 1), p('b', 2)]);
    expect(featured?.id).toBe('a');
    expect(rest.map((x) => x.id)).toEqual(['b']);
  });

  it('handles an empty list', () => {
    expect(splitFeatured([])).toEqual({ featured: undefined, rest: [] });
  });
});

describe('getPrevNext', () => {
  const three = [p('a', 1), p('b', 2), p('c', 3)];

  it('wraps around at the start', () => {
    const { prev, next } = getPrevNext(three, 'a');
    expect(prev?.id).toBe('c');
    expect(next?.id).toBe('b');
  });

  it('wraps around at the end', () => {
    const { prev, next } = getPrevNext(three, 'c');
    expect(prev?.id).toBe('b');
    expect(next?.id).toBe('a');
  });

  it('returns nothing for a single project', () => {
    expect(getPrevNext([p('a', 1)], 'a')).toEqual({});
  });

  it('returns nothing for an unknown id', () => {
    expect(getPrevNext(three, 'zzz')).toEqual({});
  });
});
