import api from '../../../shared/api/axios';
import type { ApiResponse } from '../../../shared/types';

export type SurveyTrigger = 'half_balance' | 'empty_balance';

export interface SubmitSurveyPayload {
  trigger: SurveyTrigger;
  frequency?: string;
  favoriteFeature?: string;
  feedback?: string;
}

export const surveysApi = {
  submit: (payload: SubmitSurveyPayload) =>
    api.post<ApiResponse<{ success: boolean }>>('/surveys/submit', payload),
};
