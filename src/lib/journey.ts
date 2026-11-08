/** Newest `start` first. */
export function sortJourney<T extends { data: { start: Date } }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.data.start.getTime() - a.data.start.getTime());
}

const monthYear = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });

/** "Jun 2024 — Present" or "Aug 2022 — May 2026". */
export function formatRange(start: Date, end?: Date): string {
  return `${monthYear.format(start)} — ${end ? monthYear.format(end) : 'Present'}`;
}
