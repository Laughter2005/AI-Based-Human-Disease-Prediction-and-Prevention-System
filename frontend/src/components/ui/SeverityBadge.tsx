import { AlertCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { cn } from '../../utils/cn';

type Severity = 'low' | 'moderate' | 'high';

interface SeverityBadgeProps {
  severity: Severity;
  label?: string;
  size?: 'sm' | 'md';
}

const config: Record<
  Severity,
  { Icon: any; bg: string; border: string; text: string }
> = {
  low: {
    Icon: ShieldCheck,
    bg: 'bg-info-50 dark:bg-info-500/10',
    border: 'border-info-200 dark:border-info-500/30',
    text: 'text-info-700 dark:text-info-400',
  },
  moderate: {
    Icon: AlertCircle,
    bg: 'bg-warning-50 dark:bg-warning-500/10',
    border: 'border-warning-200 dark:border-warning-500/30',
    text: 'text-warning-700 dark:text-warning-400',
  },
  high: {
    Icon: AlertTriangle,
    bg: 'bg-danger-50 dark:bg-danger-500/10',
    border: 'border-danger-200 dark:border-danger-500/30',
    text: 'text-danger-700 dark:text-danger-400',
  },
};

export function SeverityBadge({ severity, label, size = 'md' }: SeverityBadgeProps) {
  const { Icon, bg, border, text } = config[severity];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border font-bold uppercase tracking-wider',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        bg,
        border,
        text
      )}
    >
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      <span>{label ?? severity}</span>
    </span>
  );
}