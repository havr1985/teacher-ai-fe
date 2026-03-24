import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.tsx';
import { Header } from './Header.tsx';
import { VerificationBanner } from '../ui/VerificationBanner.tsx';

export const AppLayout: FC = () => {
  return (
    <div className="flex flex-col h-full bg-chalk-bg">
      <Header />
      <VerificationBanner />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
