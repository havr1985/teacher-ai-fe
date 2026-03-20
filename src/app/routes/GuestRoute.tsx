import { Navigate } from 'react-router-dom';
import { useIsAuthenticated } from '../../features/auth/store/auth.selectors';
import type { ReactNode } from 'react';

interface GuestRouteProps {
  children: ReactNode;
}

export const GuestRoute = ({ children }: GuestRouteProps) => {
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
