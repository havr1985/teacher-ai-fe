import api from '../../../shared/api/axios';
import type { ApiResponse } from '../../../shared/types';

export interface MyStats {
  lessonsCount: number;
  competencyWorksCount: number;
  generationsBalance: number;
}

export const statsApi = {
  getMyStats: () => api.get<ApiResponse<MyStats>>('/stats/me'),
};
