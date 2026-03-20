import type {
  ApiResponse,
  AuthResponse,
  LoginDto,
  RegisterDto,
  User,
} from '../../../shared/types';
import api from '../../../shared/api/axios';

export const authApi = {
  register: (dto: RegisterDto) =>
    api.post<ApiResponse<AuthResponse>>('/auth/register', dto),
  login: (dto: LoginDto) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', dto),
  logout: () => api.post<ApiResponse<null>>('/auth/logout'),
  refresh: () => api.post<ApiResponse<AuthResponse>>('/auth/refresh'),
  me: () => api.get<ApiResponse<User>>('/users/me'),
};
