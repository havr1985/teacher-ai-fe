import { useCallback, useEffect, useState } from 'react';

import { classesApi } from '../api/classesApi';
import { subjectsApi } from '../../subjects/api/subjectsApi';
import { ClassCard } from '../components/ClassCard';
import { ClassFormModal } from '../components/ClassFormModal';
import { EmptyClasses } from '../components/EmptyClasses';
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal';
import { Button } from '../../../shared/components/ui/Button';
import { Alert } from '../../../shared/components/ui/Alert';
import { Spinner } from '../../../shared/components/ui/Spinner';
import type { ClassEntity, Subject } from '../../../shared/types';
import type { ClassFormValues } from '../schemas/class.chemas.ts';
import toast from 'react-hot-toast';

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassEntity[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassEntity | null>(null);
  const [deletingClass, setDeletingClass] = useState<ClassEntity | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [classesRes, subjectsRes] = await Promise.all([
        classesApi.getAll(),
        subjectsApi.getAll(),
      ]);
      setClasses(classesRes.data.data);
      setSubjects(subjectsRes.data.data);
    } catch {
      setError('Не вдалося завантажити дані');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleCreate = () => {
    setEditingClass(null);
    setFormOpen(true);
  };

  const handleEdit = (c: ClassEntity) => {
    setEditingClass(c);
    setFormOpen(true);
  };

  const handleFormSubmit = async (values: ClassFormValues) => {
    // grade comes as string from HTML select — convert to number for API
    const dto = {
      ...values,
      grade: Number(values.grade),
      teacherNotes: values.teacherNotes || null,
    };

    if (editingClass) {
      await classesApi.update(editingClass.id, dto);
      toast.success(`Клас "${values.name}" оновлено`);
    } else {
      await classesApi.create(dto);
      toast.success(`Клас "${values.name}" створено`);
    }

    await fetchData();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingClass) return;
    setDeleting(true);
    try {
      await classesApi.delete(deletingClass.id);
      toast.success(`Клас "${deletingClass.name}" видалено`);
      setDeletingClass(null);
      await fetchData();
    } catch {
      setError('Не вдалося видалити клас');
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

  return (
    <div className="animate-fade-up max-w-[1060px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] font-semibold text-chalk-header tracking-tight mb-1">
            Мої класи
          </h1>
          <p className="text-[15px] text-chalk-muted">
            {classes.length > 0
              ? `${classes.length} ${classes.length === 1 ? 'клас' : classes.length < 5 ? 'класи' : 'класів'}`
              : 'Поки що порожньо'}
          </p>
        </div>

        {classes.length > 0 && (
          <Button onClick={handleCreate}>+ Новий клас</Button>
        )}
      </div>

      {error && <Alert className="mb-4">{error}</Alert>}

      {classes.length === 0 ? (
        <EmptyClasses onCreate={handleCreate} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classes.map((c) => (
            <ClassCard
              key={c.id}
              classEntity={c}
              onEdit={handleEdit}
              onDelete={setDeletingClass}
            />
          ))}
        </div>
      )}

      <ClassFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        subjects={subjects}
        editingClass={editingClass}
      />

      <ConfirmModal
        open={!!deletingClass}
        onClose={() => setDeletingClass(null)}
        onConfirm={handleDeleteConfirm}
        title="Видалити клас?"
        message={`Клас "${deletingClass?.name}" та весь журнал пройденого буде видалено. Цю дію не можна скасувати.`}
        loading={deleting}
      />
    </div>
  );
}
