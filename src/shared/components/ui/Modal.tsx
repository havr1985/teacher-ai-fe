import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, children, className }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Prevent body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Portal renders at document.body — escapes any overflow/stacking context
  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(42,36,32,0.45)] backdrop-blur-[2px]"
      style={{ margin: 0, padding: 0 }}
    >
      <div
        className={cn(
          'bg-chalk-card rounded-[12px] border border-chalk-border',
          'shadow-[0_16px_48px_rgba(42,36,32,0.16)]',
          'w-full max-w-[480px] max-h-[90vh] overflow-y-auto',
          'animate-fade-up mx-4',
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

export function ModalHeader({ title, onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 pt-6 pb-2">
      <h2 className="font-[family-name:var(--font-display)] text-[1.25rem] font-semibold text-chalk-header">
        {title}
      </h2>
      <button
        onClick={onClose}
        className="text-chalk-muted hover:text-chalk-text transition-colors text-xl leading-none p-1"
        aria-label="Закрити"
      >
        ×
      </button>
    </div>
  );
}

interface ModalBodyProps {
  children: ReactNode;
}

export function ModalBody({ children }: ModalBodyProps) {
  return <div className="px-6 py-4">{children}</div>;
}

interface ModalFooterProps {
  children: ReactNode;
}

export function ModalFooter({ children }: ModalFooterProps) {
  return (
    <div className="flex items-center justify-end gap-2.5 px-6 pb-6 pt-2">
      {children}
    </div>
  );
}
