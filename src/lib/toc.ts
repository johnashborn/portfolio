/** Case-study outline: only the `##` headings, in document order. */
export function tocFromHeadings(headings: { depth: number; slug: string; text: string }[]): { slug: string; text: string }[] {
  return headings.filter((h) => h.depth === 2).map(({ slug, text }) => ({ slug, text }));
}
