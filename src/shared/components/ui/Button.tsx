import { type ButtonHTMLAttributes } from 'react';
import { Spinner } from './Spinner';
import { cn } from '../../lib/cn.ts';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-chalk-accent hover:bg-chalk-accent-hover text-white',
  secondary:
    'bg-chalk-sidebar hover:bg-chalk-border text-chalk-text border border-chalk-border',
  ghost:
    'bg-transparent hover:bg-chalk-sidebar text-chalk-muted hover:text-chalk-text',
  danger: 'bg-chalk-error hover:opacity-90 text-white',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8  px-3 text-sm    gap-1.5',
  md: 'h-10 px-4 text-[15px] gap-2',
  lg: 'h-11 px-5 text-[15px] gap-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-[8px]',
        'font-medium tracking-[0.01em] transition-all duration-150',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'active:scale-[0.99]',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {loading && <Spinner size={16} />}
      {children}
    </button>
  );
}
