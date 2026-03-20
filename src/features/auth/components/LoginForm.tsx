import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';

import { authApi } from '../api/authApi';
import { useAuthLogin } from '../store/auth.selectors.ts';
import { type LoginFormValues, loginSchema } from '../schemas/auth.schemas.ts';
import { FormField } from '../../../shared/components/ui/FormField.tsx';
import { Input } from '../../../shared/components/ui/Input.tsx';
import { Alert } from '../../../shared/components/ui/Alert.tsx';
import { Button } from '../../../shared/components/ui/Button.tsx';

export function LoginForm() {
  const navigate = useNavigate();
  const login = useAuthLogin();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    try {
      const res = await authApi.login(data);
      const { accessToken, user } = res.data.data;
      login(accessToken, user);
      navigate('/');
    } catch (err) {
      const msg = (err as AxiosError<{ message: string | string[] }>).response
        ?.data?.message;
      setServerError(
        Array.isArray(msg) ? msg[0] : (msg ?? 'Невірний email або пароль'),
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      <FormField id="email" label="Email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="vasyl@school.ua"
          error={!!errors.email}
          {...register('email')}
        />
      </FormField>

      <FormField id="password" label="Пароль" error={errors.password?.message}>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={!!errors.password}
          {...register('password')}
        />
      </FormField>

      {serverError && <Alert variant="error">{serverError}</Alert>}

      <Button type="submit" fullWidth loading={isSubmitting} className="mt-2">
        Увійти
      </Button>

      <p className="text-center text-sm text-chalk-muted">
        Ще немає акаунту?{' '}
        <Link
          to="/register"
          className="text-chalk-accent font-medium no-underline hover:underline"
        >
          Зареєструватись
        </Link>
      </p>
    </form>
  );
}
