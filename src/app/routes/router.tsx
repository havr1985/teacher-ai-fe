import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../../shared/components/layout/AppLayout';
import { Suspense } from 'react';
import { Spinner } from '../../shared/components/ui/Spinner';
import DashboardPage from '../../features/dashboard/pages/DashboardPage';
import RegisterPage from '../../features/auth/pages/RegisterPage';
import LoginPage from '../../features/auth/pages/LoginPage';
import { AuthLayout } from '../../features/auth/components/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { GuestRoute } from './GuestRoute';

export const router = createBrowserRouter([
  {
    path: '/register',
    element: (
      <Suspense fallback={<Spinner />}>
        <GuestRoute>
          <AuthLayout
            title="Реєстрація"
            subtitle="10 безкоштовних генерацій після реєстрації"
          >
            <RegisterPage />
          </AuthLayout>
        </GuestRoute>
      </Suspense>
    ),
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<Spinner />}>
        <GuestRoute>
          <AuthLayout title="Вхід до Кабінету">
            <LoginPage />
          </AuthLayout>
        </GuestRoute>
      </Suspense>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Spinner />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      // Тиждень 4: тут додаємо нові роути
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
