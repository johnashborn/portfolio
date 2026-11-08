/** Minimal shape these helpers need; real items are CollectionEntry<'projects'>. */
export interface Orderable {
  id: string;
  data: { order: number; featured: boolean; draft: boolean };
}

/** Drop drafts (unless asked to keep them) and sort ascending by `order`. */
export function orderProjects<T extends Orderable>(items: T[], opts: { includeDrafts: boolean }): T[] {
  return items
    .filter((item) => opts.includeDrafts || !item.data.draft)
    .sort((a, b) => a.data.order - b.data.order);
}

/** The first featured project (or simply the first project) gets the large card. */
export function splitFeatured<T extends Orderable>(ordered: T[]): { featured: T | undefined; rest: T[] } {
  const featured = ordered.find((item) => item.data.featured) ?? ordered[0];
  return { featured, rest: ordered.filter((item) => item !== featured) };
}

/** Previous/next neighbours with wrap-around; empty when there is nothing to link to. */
export function getPrevNext<T extends { id: string }>(ordered: T[], id: string): { prev?: T; next?: T } {
  const i = ordered.findIndex((item) => item.id === id);
  if (i === -1 || ordered.length < 2) return {};
  const n = ordered.length;
  return { prev: ordered[(i - 1 + n) % n], next: ordered[(i + 1) % n] };
}
