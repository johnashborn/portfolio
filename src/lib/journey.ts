/** Newest `start` first. */
export function sortJourney<T extends { data: { start: Date } }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.data.start.getTime() - a.data.start.getTime());
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
