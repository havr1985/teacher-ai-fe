import api from '../../../shared/api/axios';
import type {
  ApiResponse,
  GenerateLessonPlanDto,
  LessonPlan,
} from '../../../shared/types';

interface LessonPlansListResponse {
  plans: LessonPlan[];
  total: number;
}

export const lessonPlansApi = {
  generate: (dto: GenerateLessonPlanDto) =>
    api.post<ApiResponse<LessonPlan>>('/lesson-plans/generate', dto),

  getAll: (params?: { classId?: string; page?: number; limit?: number }) =>
    api.get<ApiResponse<LessonPlansListResponse>>('/lesson-plans', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<LessonPlan>>(`/lesson-plans/${id}`),

  delete: (id: string) => api.delete<ApiResponse<null>>(`/lesson-plans/${id}`),

  exportDocx: (id: string) =>
    api.get(`/lesson-plans/${id}/export`, {
      params: { format: 'docx' },
      responseType: 'blob',
    }),
};
