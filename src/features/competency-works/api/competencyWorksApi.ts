import api from '../../../shared/api/axios';
import type {
  ApiResponse,
  CompetencyWork,
  GenerateCompetencyWorkDto,
  SuggestGrDto,
  SuggestGrResponse,
} from '../../../shared/types';

interface CompetencyWorksListResponse {
  works: CompetencyWork[];
  total: number;
}

export const competencyWorksApi = {
  // Step 1: Claude suggests ГР (no balance deduction)
  suggestGr: (dto: SuggestGrDto) =>
    api.post<ApiResponse<SuggestGrResponse>>(
      '/competency-works/suggest-gr',
      dto,
    ),

  // Step 2: Generate work (deducts balance unless cached)
  generate: (dto: GenerateCompetencyWorkDto) =>
    api.post<ApiResponse<CompetencyWork>>('/competency-works/generate', dto),

  getAll: (params?: {
    classId?: string;
    gr?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get<ApiResponse<CompetencyWorksListResponse>>('/competency-works', {
      params,
    }),

  getById: (id: string) =>
    api.get<ApiResponse<CompetencyWork>>(`/competency-works/${id}`),

  delete: (id: string) => api.delete(`/competency-works/${id}`),

  exportDocx: (id: string) =>
    api.get(`/competency-works/${id}/export`, {
      params: { format: 'docx' },
      responseType: 'blob',
    }),
};
