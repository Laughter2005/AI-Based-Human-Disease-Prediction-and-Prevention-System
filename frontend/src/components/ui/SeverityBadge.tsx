import { AlertCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Badge } from './Badge';

type Severity = 'low' | 'moderate' | 'high';

interface SeverityBadgeProps {
  severity: Severity;
  label?: string;
}

const config: Record<Severity, { variant: 'info' | 'warning' | 'danger'; Icon: any }> = {
  low: { variant: 'info', Icon: ShieldCheck },
  moderate: { variant: 'warning', Icon: AlertCircle },
  high: { variant: 'danger', Icon: AlertTriangle },
};

export function SeverityBadge({ severity, label }: SeverityBadgeProps) {
  const { variant, Icon } = config[severity];
  return (
    <Badge variant={variant}>
      <Icon className="h-3.5 w-3.5" />
      <span>{label ?? severity.toUpperCase()}</span>
    </Badge>
  );
}