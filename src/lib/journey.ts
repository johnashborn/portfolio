/** Oldest `start` first, so the timeline reads in the order things happened. Same-month entries go by id. */
export function sortJourney<T extends { id: string; data: { start: Date } }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.data.start.getTime() - b.data.start.getTime() || a.id.localeCompare(b.id));
}

const monthYear = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });

/** "Apr 2024" — for single moments such as milestones. */
export function formatMonth(date: Date): string {
  return monthYear.format(date);
}

/** "Jun 2024 — Present" or "Aug 2022 — May 2026". */
export function formatRange(start: Date, end?: Date): string {
  return `${formatMonth(start)} — ${end ? formatMonth(end) : 'Present'}`;
}
