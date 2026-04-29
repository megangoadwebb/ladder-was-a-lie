export function todayISO(d: Date = new Date()): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function isoFor(year: number, monthIdx: number, day: number): string {
  return `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function daysInMonth(d: Date = new Date()): number {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

export function currentDay(d: Date = new Date()): number {
  return d.getDate();
}

export function monthLabel(d: Date = new Date()): string {
  return d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

export function fullDateLabel(d: Date = new Date()): string {
  return d
    .toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    .toUpperCase();
}

export function monthShort(d: Date = new Date()): string {
  return d.toLocaleString('en-US', { month: 'short' });
}

export function monthKey(d: Date = new Date()): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${yyyy}-${mm}`;
}

export function lastSixMonthLabels(d: Date = new Date()): string[] {
  const out: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const dd = new Date(d.getFullYear(), d.getMonth() - i, 1);
    out.push(dd.toLocaleString('en-US', { month: 'short' }).toUpperCase());
  }
  return out;
}
