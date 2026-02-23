import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { format } from 'date-fns';
import { az } from 'date-fns/locale';

export function formatDate(date: string) {
  try {
    return format(new Date(date), 'dd MMMM yyyy', { locale: az });
  } catch (e) {
    return date;
  }
}

export function formatRelativeTime(date: string) {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'indi';
  if (diffMin < 60) return `${diffMin} dəq əvvəl`;
  if (diffHour < 24) return `${diffHour} saat əvvəl`;
  if (diffDay < 7) return `${diffDay} gün əvvəl`;
  return formatDate(date);
}

export function truncate(str: string, length: number) {
  return str.length > length ? str.slice(0, length) + '...' : str;
}
