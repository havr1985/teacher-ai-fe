import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import type { AxiosError } from 'axios';
import toast from 'react-hot-toast';

import { competencyWorksApi } from '../api/competencyWorksApi';
import { authApi } from '../../auth/api/authApi';
import { useAuthUpdateUser } from '../../auth/store/auth.selectors';
import { CompetencyLevelBlock } from '../components/CompetencyLevelBlock';
import { RegenerateModal } from '../components/RegenerateModal';
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
  const updateUser = useAuthUpdateUser();

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

  // Regeneration state
  const [showRegenerate, setShowRegenerate] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

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

  const handleRegenerate = async (notes?: string) => {
    if (!id) return;
    setRegenerating(true);
    setError(null);

    try {
      const res = await competencyWorksApi.regenerate(id, notes);
      const newWork = res.data.data;

      // Refresh user balance
      try {
        const meRes = await authApi.me();
        updateUser(meRes.data.data);
      } catch {
        /* non-critical */
      }

      toast.success('Новий варіант згенеровано');
      setShowRegenerate(false);

      // Navigate to the new work
      navigate(`/competency-works/${newWork.id}`, {
        state: { work: newWork },
        replace: true,
      });
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string | string[] }>;
      const msg = axiosErr.response?.data?.message;

      if (axiosErr.response?.status === 403) {
        setError('Недостатньо генерацій. Поповніть баланс.');
      } else {
        setError(
          Array.isArray(msg) ? msg[0] : (msg ?? 'Помилка перегенерації'),
        );
      }
      setShowRegenerate(false);
    } finally {
      setRegenerating(false);
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
            variant="secondary"
            size="sm"
            onClick={() => setShowRegenerate(true)}
          >
            🔄 Перегенерувати
          </Button>
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

      {/* Modals */}
      <RegenerateModal
        open={showRegenerate}
        onClose={() => setShowRegenerate(false)}
        onConfirm={handleRegenerate}
        loading={regenerating}
      />

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
