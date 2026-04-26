import type { State } from '../state/store';

function dateKey(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Streak = consecutive days where the user logged at least one value, ending today (or yesterday).
export function computeStreak(checkIns: State['checkIns'], from: Date = new Date()): number {
  const days = new Set<string>();
  for (const key of Object.keys(checkIns)) {
    for (const iso of Object.keys(checkIns[key as keyof State['checkIns']] ?? {})) {
      if (checkIns[key as keyof State['checkIns']]![iso]) days.add(iso);
    }
  }
  if (days.size === 0) return 0;

  const todayKey = dateKey(from);
  const yesterday = new Date(from);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = dateKey(yesterday);

  let cursor = new Date(from);
  if (!days.has(todayKey)) {
    if (!days.has(yesterdayKey)) return 0;
    cursor = yesterday;
  }

  let streak = 0;
  while (days.has(dateKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
