import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  padded?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ interactive, padded = true, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        interactive ? 'card-interactive' : 'card',
        padded && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

Card.displayName = 'Card';

export const CardHeader = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mb-4', className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn('text-xl font-display font-bold text-slate-900 dark:text-zinc-100', className)} {...props}>
    {children}
  </h3>
);

export const CardBody = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('text-slate-700 dark:text-zinc-300', className)} {...props}>
    {children}
  </div>
);