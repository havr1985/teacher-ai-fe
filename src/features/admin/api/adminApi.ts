import api from '../../../shared/api/axios';
import type { ApiResponse } from '../../../shared/types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  generationsBalance: number;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: string;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  total: number;
}

export interface StatsOverview {
  totalUsers: number;
  registrationsToday: number;
  generationsToday: number;
  tokensToday: number;
  costTodayUsd: number;
  totalGenerations: number;
}

export interface GenerationsByDay {
  date: string;
  lessonPlans: number;
  competencyWorks: number;
  total: number;
}

export interface StatsGenerations {
  byDay: GenerationsByDay[];
  byGr: { gr: string; count: number }[];
  byType: { type: string; label: string; count: number }[];
}

export interface TokensByDay {
  date: string;
  tokens: number;
  costUsd: number;
}

export interface StatsTokens {
  totalTokens: number;
  totalCostUsd: number;
  byDay: TokensByDay[];
}

export interface SurveyEntry {
  id: string;
  trigger: string;
  frequency: string | null;
  favoriteFeature: string | null;
  feedback: string | null;
  createdAt: string;
  user: { id: string; email: string };
}

export interface SurveysResponse {
  surveys: SurveyEntry[];
  total: number;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const adminApi = {
  // Users
  getUsers: (params: {
    page?: number;
    limit?: number;
    search?: string;
    verified?: 'true' | 'false' | '';
  }) => api.get<ApiResponse<AdminUsersResponse>>('/admin/users', { params }),

  updateBalance: (userId: string, amount: number, note: string) =>
    api.patch<ApiResponse<{ id: string; generationsBalance: number }>>(
      `/admin/users/${userId}/balance`,
      { amount, note },
    ),

  blockUser: (userId: string) =>
    api.patch<ApiResponse<{ id: string; isBlocked: boolean }>>(
      `/admin/users/${userId}/block`,
    ),

  unblockUser: (userId: string) =>
    api.patch<ApiResponse<{ id: string; isBlocked: boolean }>>(
      `/admin/users/${userId}/unblock`,
    ),

  // Stats
  getStatsOverview: () =>
    api.get<ApiResponse<StatsOverview>>('/admin/stats/overview'),

  getStatsGenerations: () =>
    api.get<ApiResponse<StatsGenerations>>('/admin/stats/generations'),

  getStatsTokens: () =>
    api.get<ApiResponse<StatsTokens>>('/admin/stats/tokens'),

  // Surveys
  getSurveys: (params: { page?: number; limit?: number }) =>
    api.get<ApiResponse<SurveysResponse>>('/admin/surveys', { params }),
};
