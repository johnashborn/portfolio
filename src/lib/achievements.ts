/** True when there is anything at all to show in the Achievements section. */
export function hasAchievements(a: { stats: unknown[]; certifications: unknown[]; awards: unknown[] }): boolean {
  return a.stats.length + a.certifications.length + a.awards.length > 0;
}

/** Split "3+" into { num: 3, prefix: '', suffix: '+' } so it can count up; null if not numeric. */
export function parseStat(value: string): { num: number; prefix: string; suffix: string } | null {
  const match = value.trim().match(/^(\D*?)(\d+(?:\.\d+)?)(\D*)$/);
  if (!match) return null;
  return { prefix: match[1], num: Number(match[2]), suffix: match[3] };
}
