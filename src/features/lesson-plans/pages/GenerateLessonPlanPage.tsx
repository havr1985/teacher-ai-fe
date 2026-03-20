import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';

import { lessonPlansApi } from '../api/lessonPlansApi';
import { classesApi } from '../../classes/api/classesApi';
import {
  generateLessonPlanSchema,
  type GenerateLessonPlanFormValues,
} from '../schemas/lesson-plan.schemas';
import { useAuthUpdateUser } from '../../auth/store/auth.selectors';
import { authApi } from '../../auth/api/authApi';

import { Card } from '../../../shared/components/ui/Card';
import { FormField } from '../../../shared/components/ui/FormField';
import { Input } from '../../../shared/components/ui/Input';
import { Select } from '../../../shared/components/ui/Select';
import { Button } from '../../../shared/components/ui/Button';
import { Alert } from '../../../shared/components/ui/Alert';
import { Spinner } from '../../../shared/components/ui/Spinner';
import type { ClassEntity } from '../../../shared/types';

export default function GenerateLessonPlanPage() {
  const navigate = useNavigate();
  const updateUser = useAuthUpdateUser();

  const [classes, setClasses] = useState<ClassEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<GenerateLessonPlanFormValues>({
    resolver: zodResolver(generateLessonPlanSchema),
    defaultValues: {
      classId: '',
      topic: '',
      durationMinutes: '45',
    },
  });

  useEffect(() => {
    classesApi
      .getAll()
      .then((res) => setClasses(res.data.data))
      .catch(() => setServerError('Не вдалося завантажити класи'))
      .finally(() => setLoading(false));
  }, []);

  const selectedClassId = watch('classId');
  const selectedClass = classes.find((c) => c.id === selectedClassId);

  const onSubmit = async (data: GenerateLessonPlanFormValues) => {
    if (!selectedClass) {
      setServerError('Оберіть клас');
      return;
    }

    setServerError(null);
    try {
      const res = await lessonPlansApi.generate({
        classId: data.classId,
        topic: data.topic,
        durationMinutes: Number(data.durationMinutes),
        subjectId: selectedClass.subject.id,
      });
      const plan = res.data.data;

      // Refresh balance
      try {
        const meRes = await authApi.me();
        updateUser(meRes.data.data);
      } catch {
        /* non-critical */
      }

      navigate(`/lesson-plans/${plan.id}`, { state: { plan } });
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string | string[] }>;
      const msg = axiosErr.response?.data?.message;
      if (axiosErr.response?.status === 403) {
        setServerError('Недостатньо генерацій. Поповніть баланс.');
      } else {
        setServerError(
          Array.isArray(msg) ? msg[0] : (msg ?? 'Помилка генерації'),
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size={28} />
      </div>
    );
  }

  return (
    <div className="animate-fade-up max-w-[560px] mx-auto">
      <Link
        to="/lesson-plans"
        className="inline-flex items-center gap-1.5 text-sm text-chalk-muted no-underline hover:text-chalk-accent mb-4"
      >
        ← Плани уроків
      </Link>

      <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] font-semibold text-chalk-header tracking-tight mb-6">
        Новий план уроку
      </h1>

      {classes.length === 0 ? (
        <Alert variant="warning">
          Спочатку{' '}
          <Link to="/classes" className="text-chalk-accent underline">
            створіть клас
          </Link>
          , щоб генерувати плани уроків.
        </Alert>
      ) : (
        <Card className="p-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              id="classId"
              label="Клас"
              error={errors.classId?.message}
            >
              <Select
                id="classId"
                error={!!errors.classId}
                {...register('classId')}
              >
                <option value="">Оберіть клас</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.subject.name} ({c.grade} кл.)
                  </option>
                ))}
              </Select>
            </FormField>

            {selectedClass && (
              <p className="text-[13px] text-chalk-muted -mt-2">
                Предмет: {selectedClass.subject.name}
              </p>
            )}

            <FormField
              id="topic"
              label="Тема уроку"
              error={errors.topic?.message}
            >
              <Input
                id="topic"
                placeholder="Наприклад: Будова крові"
                error={!!errors.topic}
                {...register('topic')}
              />
            </FormField>

            <FormField
              id="durationMinutes"
              label="Тривалість (хвилин)"
              error={errors.durationMinutes?.message}
            >
              <Select
                id="durationMinutes"
                error={!!errors.durationMinutes}
                {...register('durationMinutes')}
              >
                <option value="30">30 хв</option>
                <option value="45">45 хв</option>
                <option value="60">60 хв</option>
                <option value="90">90 хв (пара)</option>
              </Select>
            </FormField>

            {serverError && <Alert>{serverError}</Alert>}

            <Button
              type="submit"
              fullWidth
              loading={isSubmitting}
              className="mt-2"
            >
              {isSubmitting ? 'Генерація...' : 'Згенерувати план'}
            </Button>

            {isSubmitting && (
              <p className="text-center text-[13px] text-chalk-muted">
                Зазвичай займає 10–20 секунд
              </p>
            )}
          </form>
        </Card>
      )}
    </div>
  );
}
