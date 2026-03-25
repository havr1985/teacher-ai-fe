import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import {
  useIsAuthenticated,
  useUser,
} from '../../features/auth/store/auth.selectors';

interface Props {
  children: ReactNode;
}

export function ProtectedAdminRoute({ children }: Props) {
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
