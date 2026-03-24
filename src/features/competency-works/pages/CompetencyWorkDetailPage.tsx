import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import { competencyWorksApi } from '../api/competencyWorksApi';
import { CompetencyLevelBlock } from '../components/CompetencyLevelBlock';
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Alert } from '../../../shared/components/ui/Alert';
import { Spinner } from '../../../shared/components/ui/Spinner';
import { downloadBlob } from '../../../shared/lib/download';
import type { CompetencyWork } from '../../../shared/types';
import { OUTCOME_GROUP_SHORT } from '../../../shared/types';

export default function CompetencyWorkDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const workFromState = (location.state as { work?: CompetencyWork } | null)
    ?.work;

  const [work, setWork] = useState<CompetencyWork | null>(
    workFromState ?? null,
  );
  const [loading, setLoading] = useState(!workFromState);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchWork = useCallback(async () => {
    if (!id || workFromState) return;
    try {
      const res = await competencyWorksApi.getById(id);
      setWork(res.data.data);
    } catch {
      setError('Не вдалося завантажити роботу');
    } finally {
      setLoading(false);
    }
  }, [id, workFromState]);

  useEffect(() => {
    void fetchWork();
  }, [fetchWork]);

  const handleExport = async () => {
    if (!id || !work) return;
    setExporting(true);
    try {
      const res = await competencyWorksApi.exportDocx(id);
      const gr = OUTCOME_GROUP_SHORT[work.outcomeGroup] ?? work.outcomeGroup;
      const filename = `${work.topic.replace(/\s+/g, '_')}_${work.class?.grade ?? ''}кл_${gr}.docx`;
      downloadBlob(res.data, filename);
    } catch {
      setError('Не вдалося завантажити файл');
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      await competencyWorksApi.delete(id);
      navigate('/competency-works');
    } catch {
      setError('Не вдалося видалити роботу');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size={28} />
      </div>
    );
  }

  if (!work) {
    return (
      <div className="max-w-[800px] mx-auto">
        <Alert>{error ?? 'Роботу не знайдено'}</Alert>
        <Link
          to="/competency-works"
          className="inline-block mt-4 text-sm text-chalk-accent no-underline hover:underline"
        >
          ← Назад
        </Link>
      </div>
    );
  }

  const grLabel = OUTCOME_GROUP_SHORT[work.outcomeGroup] ?? work.outcomeGroup;

  return (
    <div className="animate-fade-up max-w-[900px] mx-auto">
      <Link
        to="/competency-works"
        className="inline-flex items-center gap-1.5 text-sm text-chalk-muted no-underline hover:text-chalk-accent mb-4"
      >
        ← Компетентнісні роботи
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] font-semibold text-chalk-header tracking-tight mb-1">
            {work.topic}
          </h1>
          <p className="text-[15px] text-chalk-muted">
            {work.class?.name} · {grLabel}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="primary"
            size="sm"
            onClick={handleExport}
            loading={exporting}
          >
            📄 .docx
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirmDelete(true)}
            className="text-chalk-error hover:text-chalk-error"
          >
            Видалити
          </Button>
        </div>
      </div>

      {error && <Alert className="mb-4">{error}</Alert>}

      <Card className="px-6 py-4 mb-6">
        <div className="flex items-center justify-between">
          <p className="text-[14px] text-chalk-header">
            Прізвище та ім'я учня ___________________________
          </p>
          <p className="text-[14px] text-chalk-header">Бал ______ / 12</p>
        </div>
      </Card>

      {work.content?.levels?.map((level) => (
        <CompetencyLevelBlock key={level.level} level={level} />
      ))}

      <Card className="px-6 py-4 mt-6">
        <div className="flex items-center justify-between">
          <p className="text-[14px] text-chalk-header">
            Загальний бал: _______ / 12
          </p>
          <p className="text-[14px] text-chalk-header">
            Підпис вчителя: _______________
          </p>
        </div>
      </Card>

      <ConfirmModal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Видалити роботу?"
        message="Компетентнісну роботу буде видалено назавжди."
        loading={deleting}
      />
    </div>
  );
}
