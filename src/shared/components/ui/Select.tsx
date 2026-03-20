import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'w-full h-10 px-3 rounded-[8px] appearance-none',
        'bg-chalk-input-bg border-[1.5px] border-chalk-border',
        'text-[15px] text-chalk-text',
        'outline-none transition-all duration-150',
        'focus:border-chalk-accent focus:shadow-[0_0_0_3px_rgba(200,169,110,0.15)]',
        'bg-[url("data:image/svg+xml,%3Csvg%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M1%201.5L6%206.5L11%201.5%22%20stroke%3D%22%238A7F72%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E")]',
        'bg-[length:12px_8px] bg-[position:right_12px_center] bg-no-repeat pr-9',
        error &&
          'border-chalk-error focus:border-chalk-error focus:shadow-[0_0_0_3px_rgba(217,79,61,0.12)]',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);

Select.displayName = 'Select';
