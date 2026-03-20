import api from '../../../shared/api/axios';
import type { ApiResponse, Subject } from '../../../shared/types';

export const subjectsApi = {
  getAll: () => api.get<ApiResponse<Subject[]>>('/subjects'),
};
