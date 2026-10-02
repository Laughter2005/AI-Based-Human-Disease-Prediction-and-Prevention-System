import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, Props>(
  ({ label, error, className, ...props }, ref) => {
    const [show, setShow] = useState(false);

    return (
      <div>
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-zinc-300">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={show ? 'text' : 'password'}
            className={cn(
              'input pr-11',
              error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20',
              className
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
            aria-label={show ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {error && <p className="mt-1.5 text-sm text-danger-600 dark:text-danger-400">{error}</p>}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';