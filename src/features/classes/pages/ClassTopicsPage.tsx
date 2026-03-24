import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { classesApi } from '../api/classesApi';
import { TopicRow } from '../components/TopicRow';
import { AddTopicForm } from '../components/AddTopicForm';
import { ClassLevelBadge } from '../components/ClassLevelBadge';
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal';
import { Card } from '../../../shared/components/ui/Card';
import { Alert } from '../../../shared/components/ui/Alert';
import { Spinner } from '../../../shared/components/ui/Spinner';
import type { ClassEntity, CoveredTopic } from '../../../shared/types';
import toast from 'react-hot-toast';

export default function ClassTopicsPage() {
  const { classId } = useParams<{ classId: string }>();

  const [classEntity, setClassEntity] = useState<ClassEntity | null>(null);
  const [topics, setTopics] = useState<CoveredTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deletingTopic, setDeletingTopic] = useState<CoveredTopic | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    if (!classId) return;
    try {
      setError(null);
      const [classesRes, topicsRes] = await Promise.all([
        classesApi.getAll(),
        classesApi.getTopics(classId),
      ]);
      const found = classesRes.data.data.find((c) => c.id === classId);
      if (!found) {
        setError('Клас не знайдено');
        return;
      }
      setClassEntity(found);
      setTopics(topicsRes.data.data);
    } catch {
      setError('Не вдалося завантажити дані');
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleAddTopic = async (topic: string, date: string) => {
    if (!classId) return;
    await classesApi.addTopic(classId, { topic, coveredAt: date });
    toast.success(`Тему "${topic}" додано`);
    await fetchData();
  };

  const handleDeleteConfirm = async () => {
    if (!classId || !deletingTopic) return;
    setDeleting(true);
    try {
      await classesApi.deleteTopic(classId, deletingTopic.id);
      toast.success('Тему видалено');
      setDeletingTopic(null);
      await fetchData();
    } catch {
      setError('Не вдалося видалити тему');
    } finally {
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

  if (!classEntity) {
    return (
      <div className="max-w-[800px] mx-auto">
        <Alert>{error ?? 'Клас не знайдено'}</Alert>
        <Link
          to="/classes"
          className="inline-block mt-4 text-sm text-chalk-accent no-underline hover:underline"
        >
          ← Назад до класів
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-up max-w-[800px] mx-auto">
      <Link
        to="/classes"
        className="inline-flex items-center gap-1.5 text-sm text-chalk-muted no-underline hover:text-chalk-accent mb-4"
      >
        ← Мої класи
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] font-semibold text-chalk-header tracking-tight">
          {classEntity.name}
        </h1>
        <ClassLevelBadge level={classEntity.level} />
        <span className="text-[13px] text-chalk-muted">
          {classEntity.subject.name} · {classEntity.grade} клас
        </span>
      </div>

      {error && <Alert className="mb-4">{error}</Alert>}

      <div className="mb-6">
        <p className="text-[13px] font-medium text-chalk-muted uppercase tracking-[0.06em] mb-2">
          Додати тему вручну
        </p>
        <AddTopicForm onAdd={handleAddTopic} />
      </div>

      <div>
        <p className="text-[13px] font-medium text-chalk-muted uppercase tracking-[0.06em] mb-2">
          Журнал пройденого · {topics.length}{' '}
          {topics.length === 1 ? 'тема' : topics.length < 5 ? 'теми' : 'тем'}
        </p>

        {topics.length === 0 ? (
          <Card className="px-5 py-10 text-center">
            <span className="text-3xl mb-3 block">📝</span>
            <p className="text-sm text-chalk-muted">
              Журнал порожній. Теми з'являться автоматично після генерацій або
              додайте вручну вище.
            </p>
          </Card>
        ) : (
          <Card>
            {topics.map((t) => (
              <TopicRow key={t.id} topic={t} onDelete={setDeletingTopic} />
            ))}
          </Card>
        )}
      </div>

      <ConfirmModal
        open={!!deletingTopic}
        onClose={() => setDeletingTopic(null)}
        onConfirm={handleDeleteConfirm}
        title="Видалити тему?"
        message={`Тема "${deletingTopic?.topic}" буде видалена з журналу.`}
        loading={deleting}
      />
    </div>
  );
}
