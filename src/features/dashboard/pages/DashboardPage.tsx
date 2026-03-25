import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../auth/store/auth.selectors';
import { statsApi, type MyStats } from '../../stats/api/statsApi';

function StatBlock({
  label,
  value,
  to,
}: {
  label: string;
  value: number | string;
  to?: string;
}) {
  const content = (
    <div className="bg-chalk-card rounded-[12px] border border-chalk-border p-5 hover:border-chalk-accent/40 transition-colors">
      <div className="text-3xl font-bold text-chalk-header">{value}</div>
      <div className="text-sm text-chalk-muted mt-1">{label}</div>
    </div>
  );

  return to ? (
    <Link to={to} className="no-underline block">
      {content}
    </Link>
  ) : (
    content
  );
}

export default function DashboardPage() {
  const user = useUser();
  const [stats, setStats] = useState<MyStats | null>(null);

  useEffect(() => {
    statsApi
      .getMyStats()
      .then((res) => setStats(res.data.data))
      .catch(() => {
        // non-critical — dashboard still renders without stats
      });
  }, []);

  const firstName = user?.firstName ?? 'Вчителю';

  return (
    <div className="animate-fade-up max-w-[800px] mx-auto space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] font-semibold text-chalk-header tracking-tight">
          Вітаємо, {firstName}! 👋
        </h1>
        <p className="text-[15px] text-chalk-muted mt-1">
          Що будемо готувати сьогодні?
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatBlock
          label="Планів уроків"
          value={stats?.lessonsCount ?? '—'}
          to="/lesson-plans"
        />
        <StatBlock
          label="Компетентнісних робіт"
          value={stats?.competencyWorksCount ?? '—'}
          to="/competency-works"
        />
        <StatBlock
          label="Генерацій залишилось"
          value={stats?.generationsBalance ?? user?.generationsBalance ?? '—'}
        />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-xs font-semibold text-chalk-muted uppercase tracking-widest mb-4">
          Швидкі дії
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/lesson-plans/generate"
            className="group flex items-start gap-4 bg-chalk-card rounded-[12px] border border-chalk-border p-5 hover:border-chalk-accent/50 hover:shadow-sm transition-all no-underline"
          >
            <div className="text-3xl">📋</div>
            <div>
              <div className="font-medium text-chalk-header group-hover:text-chalk-accent transition-colors">
                Новий план уроку
              </div>
              <div className="text-sm text-chalk-muted mt-0.5">
                Структурований план по НУШ за 10 секунд
              </div>
            </div>
          </Link>

          <Link
            to="/competency-works/generate"
            className="group flex items-start gap-4 bg-chalk-card rounded-[12px] border border-chalk-border p-5 hover:border-chalk-accent/50 hover:shadow-sm transition-all no-underline"
          >
            <div className="text-3xl">📝</div>
            <div>
              <div className="font-medium text-chalk-header group-hover:text-chalk-accent transition-colors">
                Нова компетентнісна робота
              </div>
              <div className="text-sm text-chalk-muted mt-0.5">
                Три рівні, один аркуш, за вашою ГР
              </div>
            </div>
          </Link>

          <Link
            to="/classes"
            className="group flex items-start gap-4 bg-chalk-card rounded-[12px] border border-chalk-border p-5 hover:border-chalk-accent/50 hover:shadow-sm transition-all no-underline"
          >
            <div className="text-3xl">🏫</div>
            <div>
              <div className="font-medium text-chalk-header group-hover:text-chalk-accent transition-colors">
                Мої класи
              </div>
              <div className="text-sm text-chalk-muted mt-0.5">
                Журнал пройденого та налаштування
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Admin link — only for admins */}
      {user?.role === 'admin' && (
        <div className="border-t border-chalk-border pt-6">
          <Link
            to="/admin"
            className="text-sm text-chalk-muted hover:text-chalk-accent transition-colors no-underline"
          >
            🔧 Панель адміністратора
          </Link>
        </div>
      )}
    </div>
  );
}
