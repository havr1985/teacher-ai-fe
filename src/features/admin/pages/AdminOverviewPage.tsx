import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi, type StatsOverview } from '../api/adminApi';
import { StatCard } from '../components/StatCard';
import { Spinner } from '../../../shared/components/ui/Spinner';
import { Alert } from '../../../shared/components/ui/Alert';

export function AdminOverviewPage() {
  const [stats, setStats] = useState<StatsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .getStatsOverview()
      .then((res) => setStats(res.data.data))
      .catch(() => setError('Не вдалося завантажити статистику'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Spinner size={28} />
      </div>
    );
  }

  if (error || !stats) {
    return <Alert>{error ?? 'Помилка'}</Alert>;
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-[1.5rem] font-semibold text-chalk-header">
          Загальний огляд
        </h2>
      </div>

      <div>
        <p className="text-xs font-semibold text-chalk-muted uppercase tracking-widest mb-3">
          Сьогодні
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Нові реєстрації"
            value={stats.registrationsToday}
            accent
          />
          <StatCard label="Генерацій" value={stats.generationsToday} />
          <StatCard
            label="Токенів"
            value={stats.tokensToday.toLocaleString('uk-UA')}
          />
          <StatCard
            label="Вартість"
            value={`$${stats.costTodayUsd}`}
            sub="~$5 / 1M токенів"
          />
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-chalk-muted uppercase tracking-widest mb-3">
          Всього
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="Користувачів" value={stats.totalUsers} />
          <StatCard label="Генерацій" value={stats.totalGenerations} />
        </div>
      </div>

      <div className="border-t border-chalk-border pt-6">
        <p className="text-xs font-semibold text-chalk-muted uppercase tracking-widest mb-3">
          Швидкий доступ
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/users"
            className="px-4 py-2 bg-chalk-card border border-chalk-border rounded-[8px] text-sm text-chalk-text hover:border-chalk-accent transition-colors no-underline"
          >
            👥 Користувачі
          </Link>
          <Link
            to="/admin/stats"
            className="px-4 py-2 bg-chalk-card border border-chalk-border rounded-[8px] text-sm text-chalk-text hover:border-chalk-accent transition-colors no-underline"
          >
            📈 Статистика
          </Link>
          <Link
            to="/admin/surveys"
            className="px-4 py-2 bg-chalk-card border border-chalk-border rounded-[8px] text-sm text-chalk-text hover:border-chalk-accent transition-colors no-underline"
          >
            💬 Опитування
          </Link>
        </div>
      </div>
    </div>
  );
}
