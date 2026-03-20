import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn.ts';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full h-10 px-3.5 rounded-[8px]',
        'bg-chalk-input-bg border-[1.5px] border-chalk-border',
        'text-[15px] text-chalk-text placeholder:text-chalk-muted',
        'outline-none transition-all duration-150',
        'focus:border-chalk-accent focus:shadow-[0_0_0_3px_rgba(200,169,110,0.15)]',
        error &&
          'border-chalk-error focus:border-chalk-error focus:shadow-[0_0_0_3px_rgba(217,79,61,0.12)]',
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = 'Input';
