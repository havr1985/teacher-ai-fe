import { type LabelHTMLAttributes } from 'react';
import { cn } from '../../lib/cn.ts';

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, children, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        'block text-[13px] font-medium text-chalk-muted',
        'uppercase tracking-[0.06em] mb-1.5',
        className,
      )}
      {...props}
    >
      {children}
    </label>
  );
}
