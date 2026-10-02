import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const TextInput = forwardRef<HTMLInputElement, Props>(
  ({ label, error, hint, className, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-zinc-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'input',
            error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20',
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p className="mt-1.5 text-sm text-slate-500 dark:text-zinc-500">{hint}</p>
        )}
        {error && <p className="mt-1.5 text-sm text-danger-600 dark:text-danger-400">{error}</p>}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';