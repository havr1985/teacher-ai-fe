import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'w-full px-3.5 py-2.5 rounded-[8px] resize-y min-h-[80px]',
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

Textarea.displayName = 'Textarea';
