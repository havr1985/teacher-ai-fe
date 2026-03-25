import { useEffect, useState } from 'react';
import { adminApi, type SurveyEntry } from '../api/adminApi';
import { Spinner } from '../../../shared/components/ui/Spinner';
import { Button } from '../../../shared/components/ui/Button';
import { Alert } from '../../../shared/components/ui/Alert';
import { Card } from '../../../shared/components/ui/Card';

const TRIGGER_LABELS: Record<string, string> = {
  half_balance: 'Половина балансу',
  empty_balance: 'Баланс вичерпано',
};

const FREQUENCY_LABELS: Record<string, string> = {
  daily: 'Щодня',
  weekly: 'Щотижня',
  monthly: 'Раз на місяць',
  rarely: 'Рідко',
};

const FEATURE_LABELS: Record<string, string> = {
  competency: 'Компетентнісні роботи',
  lesson: 'Плани уроків',
  both: 'Обидва',
};

const LIMIT = 20;

export function AdminSurveysPage() {
  const [surveys, setSurveys] = useState<SurveyEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    adminApi
      .getSurveys({ page, limit: LIMIT })
      .then((res) => {
        setSurveys(res.data.data.surveys);
        setTotal(res.data.data.total);
      })
      .catch(() => setError('Не вдалося завантажити опитування'))
      .finally(() => setLoading(false));
  }, [page]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="space-y-5 animate-fade-up">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-[1.5rem] font-semibold text-chalk-header">
          Відповіді опитування
        </h2>
        <p className="text-sm text-chalk-muted mt-0.5">Всього: {total}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Spinner size={28} />
        </div>
      ) : error ? (
        <Alert>{error}</Alert>
      ) : surveys.length === 0 ? (
        <Card className="px-5 py-14 text-center">
          <span className="text-4xl mb-4 block">💬</span>
          <p className="text-chalk-muted text-sm">Відповідей ще немає</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {surveys.map((s) => (
            <div
              key={s.id}
              className="bg-chalk-card rounded-[12px] border border-chalk-border p-5"
            >
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="text-sm font-medium text-chalk-header">
                  {s.user?.email}
                </span>
                <span className="text-xs bg-chalk-sidebar text-chalk-muted px-2 py-0.5 rounded-full border border-chalk-border">
                  {TRIGGER_LABELS[s.trigger] ?? s.trigger}
                </span>
                <span className="text-xs text-chalk-muted ml-auto">
                  {new Date(s.createdAt).toLocaleDateString('uk-UA')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {s.frequency && (
                  <div>
                    <span className="text-chalk-muted">Частота: </span>
                    <span className="text-chalk-text font-medium">
                      {FREQUENCY_LABELS[s.frequency] ?? s.frequency}
                    </span>
                  </div>
                )}
                {s.favoriteFeature && (
                  <div>
                    <span className="text-chalk-muted">Фіча: </span>
                    <span className="text-chalk-text font-medium">
                      {FEATURE_LABELS[s.favoriteFeature] ?? s.favoriteFeature}
                    </span>
                  </div>
                )}
              </div>

              {s.feedback && (
                <div className="mt-3 bg-chalk-sidebar rounded-[8px] px-3 py-2 text-sm text-chalk-muted italic border border-chalk-border">
                  "{s.feedback}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-chalk-muted">
          <span>
            Сторінка {page} з {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
            >
              ← Попередня
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
            >
              Наступна →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
