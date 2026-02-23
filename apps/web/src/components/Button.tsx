import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, className, disabled, ...props }, ref) => {
    const variants = {
      primary:
        'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm hover:shadow-md',
      secondary:
        'bg-stone-100 text-stone-700 hover:bg-stone-200 active:bg-stone-300',
      outline:
        'border-2 border-stone-200 text-stone-700 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50',
      ghost:
        'text-stone-600 hover:bg-stone-100 hover:text-stone-900',
      danger:
        'bg-error-500 text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
      accent:
        'bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 shadow-sm hover:shadow-md',
    };

    const sizes = {
      xs: 'px-2.5 py-1 text-xs gap-1 rounded-lg',
      sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
      md: 'px-4 py-2 text-sm gap-2 rounded-xl',
      lg: 'px-5 py-2.5 text-sm gap-2 rounded-xl',
      xl: 'px-6 py-3 text-base gap-2.5 rounded-2xl',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
          variants[variant],
          sizes[size],
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        ) : (
          leftIcon
        )}
        {children}
        {rightIcon}
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
