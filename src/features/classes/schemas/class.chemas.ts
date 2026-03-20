import { z } from 'zod';

export const classFormSchema = z.object({
  name: z.string().min(1, 'Введіть назву класу'),
  grade: z.string().min(1, 'Оберіть клас'),
  subjectId: z.string().min(1, 'Оберіть предмет'),
  academicYear: z
    .string()
    .min(1, 'Введіть навчальний рік')
    .regex(/^\d{4}-\d{4}$/, 'Формат: 2025-2026'),
  level: z.enum(['standard', 'advanced', 'support']),
  teacherNotes: z.string().optional().or(z.literal('')),
});

export type ClassFormValues = z.infer<typeof classFormSchema>;
