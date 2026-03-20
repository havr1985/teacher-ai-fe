import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { lessonPlansApi } from '../api/lessonPlansApi';
import { LessonPlanCard } from '../components/LessonPlanCard';
import { Button } from '../../../shared/components/ui/Button';
import { Card } from '../../../shared/components/ui/Card';
import { Alert } from '../../../shared/components/ui/Alert';
import { Spinner } from '../../../shared/components/ui/Spinner';
import type { LessonPlan } from '../../../shared/types';

export default function LessonPlansPage() {
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    lessonPlansApi
      .getAll({ limit: 50 })
      .then((res) => setPlans(res.data.data.plans))
      .catch(() => setError('Не вдалося завантажити плани'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size={28} />
      </div>
    );
  }

  return (
    <div className="animate-fade-up max-w-[800px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] font-semibold text-chalk-header tracking-tight mb-1">
            Плани уроків
          </h1>
          <p className="text-[15px] text-chalk-muted">
            {plans.length > 0
              ? `${plans.length} ${plans.length === 1 ? 'план' : plans.length < 5 ? 'плани' : 'планів'}`
              : 'Поки що порожньо'}
          </p>
        </div>

        <Link to="/lesson-plans/generate" className="no-underline">
          <Button>+ Новий план</Button>
        </Link>
      </div>

      {error && <Alert className="mb-4">{error}</Alert>}

      {plans.length === 0 ? (
        <Card className="px-5 py-14 text-center">
          <span className="text-4xl mb-4 block">✦</span>
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-chalk-header mb-2">
            Ще немає планів
          </h2>
          <p className="text-sm text-chalk-muted mb-6 max-w-[320px] mx-auto">
            Згенеруйте перший план уроку — AI створить структуру по НУШ з
            хронометражем за 15 секунд
          </p>
          <Link to="/lesson-plans/generate" className="no-underline">
            <Button>Згенерувати план</Button>
          </Link>
        </Card>
      ) : (
        <div className="flex flex-col gap-2.5">
          {plans.map((plan) => (
            <LessonPlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  );
}
