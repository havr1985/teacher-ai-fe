import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../../shared/components/layout/AppLayout';
import { Suspense, lazy } from 'react';
import { Spinner } from '../../shared/components/ui/Spinner';
import { AuthLayout } from '../../features/auth/components/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { GuestRoute } from './GuestRoute';

// ─── Lazy imports ──────────────────────────────────────────────────────────────
const LoginPage = lazy(() => import('../../features/auth/pages/LoginPage'));
const RegisterPage = lazy(
  () => import('../../features/auth/pages/RegisterPage'),
);
const DashboardPage = lazy(
  () => import('../../features/dashboard/pages/DashboardPage'),
);
const ClassesPage = lazy(
  () => import('../../features/classes/pages/ClassesPage'),
);
const ClassTopicsPage = lazy(
  () => import('../../features/classes/pages/ClassTopicsPage'),
);
const LessonPlansPage = lazy(
  () => import('../../features/lesson-plans/pages/LessonPlansPage'),
);
const GenerateLessonPlanPage = lazy(
  () => import('../../features/lesson-plans/pages/GenerateLessonPlanPage'),
);
const LessonPlanDetailPage = lazy(
  () => import('../../features/lesson-plans/pages/LessonPlanDetailPage'),
);

function SuspenseWrap({ children }: { children: React.ReactNode }) {
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

export const router = createBrowserRouter([
  // ─── Auth (guest only) ───────────────────────────────────────────────
  {
    path: '/register',
    element: (
      <GuestRoute>
        <AuthLayout
          title="Реєстрація"
          subtitle="10 безкоштовних генерацій після реєстрації"
        >
          <SuspenseWrap>
            <RegisterPage />
          </SuspenseWrap>
        </AuthLayout>
      </GuestRoute>
    ),
  },
  {
    path: '/login',
    element: (
      <GuestRoute>
        <AuthLayout title="Вхід до Кабінету">
          <SuspenseWrap>
            <LoginPage />
          </SuspenseWrap>
        </AuthLayout>
      </GuestRoute>
    ),
  },

  // ─── App (protected) ────────────────────────────────────────────────
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
          <SuspenseWrap>
            <DashboardPage />
          </SuspenseWrap>
        ),
      },
      // Classes
      {
        path: 'classes',
        element: (
          <SuspenseWrap>
            <ClassesPage />
          </SuspenseWrap>
        ),
      },
      {
        path: 'classes/:classId/topics',
        element: (
          <SuspenseWrap>
            <ClassTopicsPage />
          </SuspenseWrap>
        ),
      },
      // Lesson Plans
      {
        path: 'lesson-plans',
        element: (
          <SuspenseWrap>
            <LessonPlansPage />
          </SuspenseWrap>
        ),
      },
      {
        path: 'lesson-plans/generate',
        element: (
          <SuspenseWrap>
            <GenerateLessonPlanPage />
          </SuspenseWrap>
        ),
      },
      {
        path: 'lesson-plans/:id',
        element: (
          <SuspenseWrap>
            <LessonPlanDetailPage />
          </SuspenseWrap>
        ),
      },
    ],
  },

  // ─── Fallback ────────────────────────────────────────────────────────
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
