import { z } from 'zod';

export const generateLessonPlanSchema = z.object({
  classId: z.string().min(1, 'Оберіть клас'),
  topic: z.string().min(1, 'Введіть тему уроку'),
  durationMinutes: z.string().min(1, 'Оберіть тривалість'),
});

export type GenerateLessonPlanFormValues = z.infer<
  typeof generateLessonPlanSchema
>;
