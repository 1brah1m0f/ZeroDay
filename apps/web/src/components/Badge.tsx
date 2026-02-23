import { cn } from '@/lib/utils';

type BadgeVariant = 'primary' | 'accent' | 'neutral' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  primary: 'bg-primary-50 text-primary-700 ring-primary-200/50',
  accent: 'bg-accent-50 text-accent-700 ring-accent-200/50',
  neutral: 'bg-stone-100 text-stone-600 ring-stone-200/50',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200/50',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200/50',
  error: 'bg-red-50 text-red-700 ring-red-200/50',
  info: 'bg-sky-50 text-sky-700 ring-sky-200/50',
};

const dotColors: Record<BadgeVariant, string> = {
  primary: 'bg-primary-500',
  accent: 'bg-accent-500',
  neutral: 'bg-stone-400',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  info: 'bg-sky-500',
};

export function Badge({ children, variant = 'neutral', size = 'sm', dot, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ring-inset',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        variants[variant],
        className,
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  );
}

export default Badge;
