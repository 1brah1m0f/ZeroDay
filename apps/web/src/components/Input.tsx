import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-stone-700">{label}</label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 transition-all duration-200',
              'hover:border-stone-300 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100',
              error && 'border-red-300 hover:border-red-400 focus:border-red-400 focus:ring-red-100',
              leftIcon && 'pl-10',
              className,
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs font-medium text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs text-stone-500">{hint}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;
