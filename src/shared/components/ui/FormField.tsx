import { type ReactNode } from 'react';
import { Label } from './Label';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}

export function FormField({ id, label, error, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-0">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="mt-1.5 text-[13px] text-chalk-error">{error}</p>}
    </div>
  );
}
