'use client';

import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export function Card({ children, className, interactive, padding = 'md', onClick }: CardProps) {
  const Comp = onClick ? 'button' : 'div';
  return (
    <Comp
      onClick={onClick}
      className={cn(
        'rounded-2xl border border-stone-200/60 bg-white shadow-card',
        paddings[padding],
        interactive &&
          'cursor-pointer transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 active:translate-y-0 active:shadow-card',
        onClick && 'w-full text-left',
        className,
      )}
    >
      {children}
    </Comp>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn('text-lg font-semibold text-stone-800', className)}>{children}</h3>;
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('mt-1 text-sm text-stone-500', className)}>{children}</p>;
}

export default Card;
