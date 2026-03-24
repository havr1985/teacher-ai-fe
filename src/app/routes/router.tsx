import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy } from 'react';
import { AppLayout } from '../../shared/components/layout/AppLayout';
import { AuthLayout } from '../../features/auth/components/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { GuestRoute } from './GuestRoute';
import { SuspenseWrap } from './SuspenseWrap';

// ─── Lazy imports ──────────────────────────────────────────────────────────────
/* eslint-disable react-refresh/only-export-components */
const LoginPage = lazy(() => import('../../features/auth/pages/LoginPage'));
const RegisterPage = lazy(
  () => import('../../features/auth/pages/RegisterPage'),
);
const VerifyEmailPage = lazy(
  () => import('../../features/auth/pages/VerifyEmailPage'),
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
const CompetencyWorksPage = lazy(
  () => import('../../features/competency-works/pages/CompetencyWorksPage'),
);
const GenerateCompetencyWorkPage = lazy(
  () =>
    import('../../features/competency-works/pages/GenerateCompetencyWorkPage'),
);
const CompetencyWorkDetailPage = lazy(
  () =>
    import('../../features/competency-works/pages/CompetencyWorkDetailPage'),
);

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
  {
    path: '/verify-email',
    element: (
      <SuspenseWrap>
        <VerifyEmailPage />
      </SuspenseWrap>
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
      // Lesson Plans — generate BEFORE :id
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
      // Competency Works — generate BEFORE :id
      {
        path: 'competency-works',
        element: (
          <SuspenseWrap>
            <CompetencyWorksPage />
          </SuspenseWrap>
        ),
      },
      {
        path: 'competency-works/generate',
        element: (
          <SuspenseWrap>
            <GenerateCompetencyWorkPage />
          </SuspenseWrap>
        ),
      },
      {
        path: 'competency-works/:id',
        element: (
          <SuspenseWrap>
            <CompetencyWorkDetailPage />
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
