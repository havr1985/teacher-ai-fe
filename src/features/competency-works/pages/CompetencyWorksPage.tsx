import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { competencyWorksApi } from '../api/competencyWorksApi';
import { CompetencyWorkCard } from '../components/CompetencyWorkCard';
import { Button } from '../../../shared/components/ui/Button';
import { Card } from '../../../shared/components/ui/Card';
import { Alert } from '../../../shared/components/ui/Alert';
import { Spinner } from '../../../shared/components/ui/Spinner';
import type { CompetencyWork } from '../../../shared/types';

export default function CompetencyWorksPage() {
  const [works, setWorks] = useState<CompetencyWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    competencyWorksApi
      .getAll({ limit: 50 })
      .then((res) => setWorks(res.data.data.works))
      .catch(() => setError('Не вдалося завантажити роботи'))
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
            Компетентнісні роботи
          </h1>
          <p className="text-[15px] text-chalk-muted">
            {works.length > 0
              ? `${works.length} ${works.length === 1 ? 'робота' : works.length < 5 ? 'роботи' : 'робіт'}`
              : 'Поки що порожньо'}
          </p>
        </div>

        <Link to="/competency-works/generate" className="no-underline">
          <Button>+ Нова робота</Button>
        </Link>
      </div>

      {error && <Alert className="mb-4">{error}</Alert>}

      {works.length === 0 ? (
        <Card className="px-5 py-14 text-center">
          <span className="text-4xl mb-4 block">◈</span>
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-chalk-header mb-2">
            Ще немає робіт
          </h2>
          <p className="text-sm text-chalk-muted mb-6 max-w-[360px] mx-auto">
            AI створить компетентнісну роботу з трьома рівнями — учень сам
            обирає складність
          </p>
          <Link to="/competency-works/generate" className="no-underline">
            <Button>Створити роботу</Button>
          </Link>
        </Card>
      ) : (
        <div className="flex flex-col gap-2.5">
          {works.map((w) => (
            <CompetencyWorkCard key={w.id} work={w} />
          ))}
        </div>
      )}
    </div>
  );
}
