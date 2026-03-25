import { useCallback } from 'react';
import type { SurveyTrigger } from '../api/surveyApi';

const STORAGE_KEY = 'surveyShown';

/**
 * Checks if the survey modal should be shown based on the fresh balance
 * received from /users/me after generation.
 *
 * Triggers:
 *  - balance === 5  → half of free tier (10 → 5)
 *  - balance === 0  → empty
 *
 * Shows only once (localStorage flag).
 */
export function useSurveyTrigger() {
  const shouldShowSurvey = useCallback(
    (newBalance: number): SurveyTrigger | null => {
      if (localStorage.getItem(STORAGE_KEY)) return null;
      if (newBalance === 5) return 'half_balance';
      if (newBalance === 0) return 'empty_balance';
      return null;
    },
    [],
  );

  const markShown = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, '1');
  }, []);

  return { shouldShowSurvey, markShown };
}
