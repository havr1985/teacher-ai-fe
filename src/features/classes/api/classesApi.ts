import api from '../../../shared/api/axios';
import type {
  ApiResponse,
  ClassEntity,
  CoveredTopic,
  CreateClassDto,
  CreateTopicDto,
  UpdateClassDto,
} from '../../../shared/types';

export const classesApi = {
  getAll: () => api.get<ApiResponse<ClassEntity[]>>('/classes'),

  create: (dto: CreateClassDto) =>
    api.post<ApiResponse<ClassEntity>>('/classes', dto),

  update: (id: string, dto: UpdateClassDto) =>
    api.patch<ApiResponse<ClassEntity>>(`/classes/${id}`, dto),

  delete: (id: string) => api.delete<ApiResponse<null>>(`/classes/${id}`),

  // ─── Covered Topics ──────────────────────────────────────────────────
  getTopics: (classId: string) =>
    api.get<ApiResponse<CoveredTopic[]>>(`/classes/${classId}/topics`),

  addTopic: (classId: string, dto: CreateTopicDto) =>
    api.post<ApiResponse<CoveredTopic>>(`/classes/${classId}/topics`, dto),

  deleteTopic: (classId: string, topicId: string) =>
    api.delete<ApiResponse<null>>(`/classes/${classId}/topics/${topicId}`),
};
