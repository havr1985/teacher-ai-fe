import { type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn.ts';

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-chalk-card border border-chalk-border rounded-[10px]',
        'shadow-[0_4px_24px_rgba(42,36,32,0.06)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
