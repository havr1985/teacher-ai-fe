import { Suspense, type ReactNode } from 'react';
import { Spinner } from '../../shared/components/ui/Spinner';

export function SuspenseWrap({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Spinner size={28} />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
