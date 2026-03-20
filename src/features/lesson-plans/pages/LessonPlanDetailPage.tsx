import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import { lessonPlansApi } from '../api/lessonPlansApi';
import { LessonPlanStagesTable } from '../components/LessonPlanStagesTable';
import {
  LessonPlanListSection,
  LessonPlanSection,
} from '../components/LessonPlanSection';
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Alert } from '../../../shared/components/ui/Alert';
import { Spinner } from '../../../shared/components/ui/Spinner';
import { downloadBlob } from '../../../shared/lib/download';
import type { LessonPlan } from '../../../shared/types';

export default function LessonPlanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Use plan from router state (after generation) to avoid extra GET
  const planFromState = (location.state as { plan?: LessonPlan } | null)?.plan;

  const [plan, setPlan] = useState<LessonPlan | null>(planFromState ?? null);
  const [loading, setLoading] = useState(!planFromState);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchPlan = useCallback(async () => {
    if (!id || planFromState) return;
    try {
      const res = await lessonPlansApi.getById(id);
      setPlan(res.data.data);
    } catch {
      setError('Не вдалося завантажити план');
    } finally {
      setLoading(false);
    }
  }, [id, planFromState]);

  useEffect(() => {
    void fetchPlan();
  }, [fetchPlan]);

  const handleExport = async () => {
    if (!id || !plan) return;
    setExporting(true);
    try {
      const res = await lessonPlansApi.exportDocx(id);
      const filename = `${plan.topic.replace(/\s+/g, '_')}_${plan.classEntity?.name ?? ''}.docx`;
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
      await lessonPlansApi.delete(id);
      navigate('/lesson-plans');
    } catch {
      setError('Не вдалося видалити план');
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

  if (!plan) {
    return (
      <div className="max-w-[800px] mx-auto">
        <Alert>{error ?? 'План не знайдено'}</Alert>
        <Link
          to="/lesson-plans"
          className="inline-block mt-4 text-sm text-chalk-accent no-underline hover:underline"
        >
          ← Назад до планів
        </Link>
      </div>
    );
  }

  const { content } = plan;

  return (
    <div className="animate-fade-up max-w-[900px] mx-auto">
      <Link
        to="/lesson-plans"
        className="inline-flex items-center gap-1.5 text-sm text-chalk-muted no-underline hover:text-chalk-accent mb-4"
      >
        ← Плани уроків
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] font-semibold text-chalk-header tracking-tight mb-1">
            {plan.topic}
          </h1>
          <p className="text-[15px] text-chalk-muted">
            {plan.classEntity?.name} · {plan.classEntity?.subject?.name} ·{' '}
            {plan.durationMinutes} хв
            {plan.cachedAt && ' · ⚡ Кешовано'}
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

      <Card className="p-6">
        <LessonPlanListSection
          title="Цілі уроку"
          items={content?.objectives ?? []}
        />

        {(content?.outcome_groups?.length ?? 0) > 0 && (
          <LessonPlanSection title="Групи результатів">
            <div className="flex gap-2 flex-wrap">
              {content.outcome_groups.map((gr) => (
                <span
                  key={gr}
                  className="inline-flex px-2.5 py-1 rounded-md text-[13px] font-medium bg-[rgba(200,169,110,0.1)] text-chalk-accent"
                >
                  {gr}
                </span>
              ))}
            </div>
          </LessonPlanSection>
        )}

        <LessonPlanListSection
          title="Обладнання"
          items={content?.equipment ?? []}
        />

        {(content?.stages?.length ?? 0) > 0 && (
          <LessonPlanSection title="Хід уроку">
            <LessonPlanStagesTable stages={content.stages} />
          </LessonPlanSection>
        )}

        {content?.homework && (
          <LessonPlanSection title="Домашнє завдання">
            <p className="text-[14px] text-chalk-text">{content.homework}</p>
          </LessonPlanSection>
        )}

        {content?.teacher_notes && (
          <LessonPlanSection title="Примітки вчителя">
            <p className="text-[14px] text-chalk-muted italic">
              {content.teacher_notes}
            </p>
          </LessonPlanSection>
        )}
      </Card>

      <ConfirmModal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Видалити план?"
        message="План уроку буде видалено назавжди."
        loading={deleting}
      />
    </div>
  );
}
