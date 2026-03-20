import { type ReactNode } from 'react';
import { Card } from '../../../shared/components/ui/Card';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-chalk-bg flex items-center justify-center p-6">
      {/* Subtle radial glow */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 25% 25%, rgba(200,169,110,0.08), transparent 55%), radial-gradient(circle at 75% 75%, rgba(42,36,32,0.04), transparent 55%)',
        }}
      />

      <div className="animate-fade-up w-full max-w-[400px] relative">
        {/* Logo */}
        <div className="text-center mb-10">
          <p className="font-[family-name:var(--font-display)] text-[2rem] font-semibold text-chalk-header tracking-tight leading-none mb-1">
            TeacherAI
          </p>
          <p className="text-sm text-chalk-muted tracking-[0.04em]">
            AI-помічник для вчителя НУШ
          </p>
        </div>

        {/* Card */}
        <Card className="p-8">
          <h1 className="font-[family-name:var(--font-display)] text-[1.375rem] font-semibold text-chalk-header mb-1">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-chalk-muted mb-7">{subtitle}</p>
          )}
          {!subtitle && <div className="mb-7" />}
          {children}
        </Card>
      </div>
    </div>
  );
};
