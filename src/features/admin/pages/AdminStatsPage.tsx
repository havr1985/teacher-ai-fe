import { useEffect, useState } from 'react';
import {
  adminApi,
  type StatsGenerations,
  type StatsTokens,
} from '../api/adminApi';
import { StatCard } from '../components/StatCard';
import { MiniBarChart } from '../components/MiniBarChart';
import { Spinner } from '../../../shared/components/ui/Spinner';
import { Alert } from '../../../shared/components/ui/Alert';

const GR_LABELS: Record<string, string> = {
  'gr-1': 'ГР-1 Досліджує природу',
  'gr-2': 'ГР-2 Опрацьовує інформацію',
  'gr-3': 'ГР-3 Усвідомлює закономірності',
};

const CHART_DAYS = 14;

export function AdminStatsPage() {
  const [gen, setGen] = useState<StatsGenerations | null>(null);
  const [tok, setTok] = useState<StatsTokens | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([adminApi.getStatsGenerations(), adminApi.getStatsTokens()])
      .then(([genRes, tokRes]) => {
        setGen(genRes.data.data);
        setTok(tokRes.data.data);
      })
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

  if (error || !gen || !tok) {
    return <Alert>{error ?? 'Помилка'}</Alert>;
  }

  const recentDays = gen.byDay.slice(-CHART_DAYS);
  const recentTokenDays = tok.byDay.slice(-CHART_DAYS);
  const totalGenerations = gen.byType.reduce((s, t) => s + t.count, 0);

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-[1.5rem] font-semibold text-chalk-header">
          Статистика
        </h2>
        <p className="text-sm text-chalk-muted mt-0.5">Останні 30 днів</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Всього генерацій" value={totalGenerations} accent />
        <StatCard
          label="Плани уроків"
          value={gen.byType.find((t) => t.type === 'lesson_plan')?.count ?? 0}
        />
        <StatCard
          label="Компетентнісні роботи"
          value={
            gen.byType.find((t) => t.type === 'competency_work')?.count ?? 0
          }
        />
        <StatCard
          label="Загальна вартість"
          value={`$${tok.totalCostUsd}`}
          sub={`${tok.totalTokens.toLocaleString('uk-UA')} токенів`}
        />
      </div>

      {/* Generations chart */}
      <div className="bg-chalk-card rounded-[12px] border border-chalk-border p-5">
        <p className="text-sm font-semibold text-chalk-header mb-4">
          Генерації по днях (останні {CHART_DAYS} днів)
        </p>
        {recentDays.length === 0 ? (
          <p className="text-sm text-chalk-muted">Немає даних</p>
        ) : (
          <>
            <MiniBarChart
              data={recentDays.map((d) => ({ label: d.date, value: d.total }))}
              height={100}
            />
            <div className="flex items-center gap-2 mt-3 text-xs text-chalk-muted">
              <span className="w-3 h-3 rounded-sm bg-chalk-accent inline-block" />
              Всього генерацій
            </div>
          </>
        )}
      </div>

      {/* Tokens chart */}
      <div className="bg-chalk-card rounded-[12px] border border-chalk-border p-5">
        <p className="text-sm font-semibold text-chalk-header mb-4">
          Токени по днях (останні {CHART_DAYS} днів)
        </p>
        {recentTokenDays.length === 0 ? (
          <p className="text-sm text-chalk-muted">Немає даних</p>
        ) : (
          <>
            <MiniBarChart
              data={recentTokenDays.map((d) => ({
                label: `${d.date}: ${d.tokens.toLocaleString()} токенів ($${d.costUsd})`,
                value: d.tokens,
              }))}
              color="#0f6e56"
              height={100}
            />
            <div className="flex items-center gap-2 mt-3 text-xs text-chalk-muted">
              <span className="w-3 h-3 rounded-sm bg-[#0f6e56] inline-block" />
              Токени
            </div>
          </>
        )}
      </div>

      {/* By GR */}
      <div className="bg-chalk-card rounded-[12px] border border-chalk-border p-5">
        <p className="text-sm font-semibold text-chalk-header mb-4">
          Компетентнісні роботи по ГР
        </p>
        {gen.byGr.length === 0 ? (
          <p className="text-sm text-chalk-muted">Немає даних</p>
        ) : (
          <div className="space-y-3">
            {gen.byGr.map((item) => {
              const totalGr = gen.byGr.reduce((s, g) => s + g.count, 0);
              const pct =
                totalGr > 0 ? Math.round((item.count / totalGr) * 100) : 0;
              return (
                <div key={item.gr}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-chalk-text">
                      {GR_LABELS[item.gr] ?? item.gr}
                    </span>
                    <span className="font-medium text-chalk-header">
                      {item.count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 bg-chalk-sidebar rounded-full overflow-hidden">
                    <div
                      className="h-full bg-chalk-accent rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
