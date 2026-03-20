import { type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';

type AlertVariant = 'error' | 'info' | 'warning';

interface AlertProps {
  variant?: AlertVariant;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<AlertVariant, string> = {
  error:
    'bg-[rgba(217,79,61,0.07)] border-[rgba(217,79,61,0.2)] text-chalk-error',
  info: 'bg-[rgba(200,169,110,0.07)] border-[rgba(200,169,110,0.2)] text-chalk-muted',
  warning: 'bg-[rgba(200,169,110,0.1)] border-chalk-accent text-chalk-text',
};

export function Alert({ variant = 'error', children, className }: AlertProps) {
  return (
    <div
      className={cn(
        'px-3.5 py-2.5 rounded-[6px] border text-sm',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </div>
  );
}
