import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

type Variant = 'primary' | 'gradient' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClass =
      variant === 'gradient'
        ? 'btn-gradient'
        : variant === 'secondary'
        ? 'btn-secondary'
        : variant === 'ghost'
        ? 'btn-ghost'
        : variant === 'danger'
        ? 'inline-flex items-center justify-center gap-2 rounded px-5 py-3 text-base font-semibold text-white bg-danger-500 hover:bg-danger-600 shadow-soft hover:shadow-lifted transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
        : 'btn-primary';

    const sizeClass =
      size === 'sm'
        ? 'text-sm px-3.5 py-2'
        : size === 'lg'
        ? 'text-lg px-6 py-4'
        : '';

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(baseClass, sizeClass, className)}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';