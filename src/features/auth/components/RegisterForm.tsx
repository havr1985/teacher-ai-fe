import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';

import { authApi } from '../api/authApi';
import { useAuthLogin } from '../store/auth.selectors.ts';
import {
  type RegisterFormValues,
  registerSchema,
} from '../schemas/auth.schemas.ts';
import { FormField } from '../../../shared/components/ui/FormField.tsx';
import { Input } from '../../../shared/components/ui/Input.tsx';
import { Alert } from '../../../shared/components/ui/Alert.tsx';
import { Button } from '../../../shared/components/ui/Button.tsx';

export function RegisterForm() {
  const navigate = useNavigate();
  const login = useAuthLogin();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError(null);
    try {
      const res = await authApi.register(data);
      const { accessToken, user } = res.data.data;
      login(accessToken, user);
      navigate('/');
    } catch (err) {
      const msg = (err as AxiosError<{ message: string | string[] }>).response
        ?.data?.message;
      setServerError(
        Array.isArray(msg)
          ? msg[0]
          : (msg ?? 'Помилка реєстрації. Спробуйте знову.'),
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <FormField
          id="firstName"
          label="Ім'я"
          error={errors.firstName?.message}
        >
          <Input
            id="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="Василь"
            error={!!errors.firstName}
            {...register('firstName')}
          />
        </FormField>

        <FormField
          id="lastName"
          label="Прізвище"
          error={errors.lastName?.message}
        >
          <Input
            id="lastName"
            type="text"
            autoComplete="family-name"
            placeholder="Петренко"
            error={!!errors.lastName}
            {...register('lastName')}
          />
        </FormField>
      </div>

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
          autoComplete="new-password"
          placeholder="Мінімум 8 символів"
          error={!!errors.password}
          {...register('password')}
        />
      </FormField>

      {serverError && <Alert variant="error">{serverError}</Alert>}

      <Button type="submit" fullWidth loading={isSubmitting} className="mt-2">
        Зареєструватись безкоштовно
      </Button>

      <p className="text-center text-sm text-chalk-muted">
        Вже маєте акаунт?{' '}
        <Link
          to="/login"
          className="text-chalk-accent font-medium no-underline hover:underline"
        >
          Увійти
        </Link>
      </p>
    </form>
  );
}
