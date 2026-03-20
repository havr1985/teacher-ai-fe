import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Введіть email').email('Невірний формат email'),
  password: z.string().min(1, 'Введіть пароль'),
});

export const registerSchema = z.object({
  firstName: z.string().min(1, "Введіть ім'я").min(2, 'Мінімум 2 символи'),
  lastName: z.string().min(1, 'Введіть прізвище').min(2, 'Мінімум 2 символи'),
  email: z.string().min(1, 'Введіть email').email('Невірний формат email'),
  password: z.string().min(1, 'Введіть пароль').min(8, 'Мінімум 8 символів'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
