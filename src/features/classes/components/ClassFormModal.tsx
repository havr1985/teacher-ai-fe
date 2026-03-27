import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '../../../shared/components/ui/Modal';
import { FormField } from '../../../shared/components/ui/FormField';
import { Input } from '../../../shared/components/ui/Input';
import { Select } from '../../../shared/components/ui/Select';
import { Textarea } from '../../../shared/components/ui/Textarea';
import { Button } from '../../../shared/components/ui/Button';
import {
  classFormSchema,
  type ClassFormValues,
} from '../schemas/class.chemas.ts';
import type { ClassEntity, Subject } from '../../../shared/types';

interface ClassFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ClassFormValues) => Promise<void>;
  subjects: Subject[];
  editingClass?: ClassEntity | null;
}

function getDefaultAcademicYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  return now.getMonth() >= 8 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
}

const LEVEL_OPTIONS = [
  { value: 'standard', label: 'Стандартний' },
  { value: 'advanced', label: 'Поглиблений / гімназія' },
  { value: 'support', label: 'Потребує підтримки' },
] as const;

const GRADE_OPTIONS = [5, 6, 7, 8, 9] as const;

// ─── Textbook options per subject ────────────────────────────────────────────
// Key: subject name (lowercase), Value: available textbooks
// Empty array = no textbooks available for this subject yet
const TEXTBOOK_OPTIONS: Record<
  string,
  Array<{ value: string; label: string }>
> = {
  біологія: [
    { value: 'ostapchenko', label: 'Остапченко Л.І.' },
    { value: 'matyash', label: 'Матяш Н.Ю.' },
  ],
  // Інші предмети — додамо пізніше
  // 'хімія': [...],
  // 'фізика': [...],
};

function getTextbookOptions(
  subjectName: string | undefined,
): Array<{ value: string; label: string }> {
  if (!subjectName) return [];
  return TEXTBOOK_OPTIONS[subjectName.toLowerCase()] ?? [];
}

export function ClassFormModal({
  open,
  onClose,
  onSubmit,
  subjects,
  editingClass,
}: ClassFormModalProps) {
  const isEdit = !!editingClass;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      name: '',
      grade: '7',
      subjectId: '',
      academicYear: getDefaultAcademicYear(),
      level: 'standard',
      teacherNotes: '',
      textbook: '',
    },
  });

  const selectedSubjectId = watch('subjectId');
  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);
  const textbookOptions = getTextbookOptions(selectedSubject?.name);

  useEffect(() => {
    if (!open) return;

    if (editingClass) {
      reset({
        name: editingClass.name,
        grade: String(editingClass.grade),
        subjectId: editingClass.subject.id,
        academicYear: editingClass.academicYear,
        level: editingClass.level,
        teacherNotes: editingClass.teacherNotes ?? '',
        textbook: editingClass.textbook ?? '',
      });
    } else {
      reset({
        name: '',
        grade: '7',
        subjectId: subjects[0]?.id ?? '',
        academicYear: getDefaultAcademicYear(),
        level: 'standard',
        teacherNotes: '',
        textbook: '',
      });
    }
  }, [open, editingClass, subjects, reset]);

  const handleFormSubmit = async (values: ClassFormValues) => {
    await onSubmit(values);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalHeader
        title={isEdit ? 'Редагувати клас' : 'Новий клас'}
        onClose={onClose}
      />

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <ModalBody>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-[1fr_100px] gap-3">
              <FormField id="name" label="Назва" error={errors.name?.message}>
                <Input
                  id="name"
                  placeholder="7-А"
                  error={!!errors.name}
                  {...register('name')}
                />
              </FormField>

              <FormField id="grade" label="Клас" error={errors.grade?.message}>
                <Select
                  id="grade"
                  error={!!errors.grade}
                  {...register('grade')}
                >
                  {GRADE_OPTIONS.map((g) => (
                    <option key={g} value={String(g)}>
                      {g} клас
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>

            <FormField
              id="subjectId"
              label="Предмет"
              error={errors.subjectId?.message}
            >
              <Select
                id="subjectId"
                error={!!errors.subjectId}
                {...register('subjectId')}
              >
                <option value="">Оберіть предмет</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                id="academicYear"
                label="Навч. рік"
                error={errors.academicYear?.message}
              >
                <Input
                  id="academicYear"
                  placeholder="2025-2026"
                  error={!!errors.academicYear}
                  {...register('academicYear')}
                />
              </FormField>

              <FormField
                id="level"
                label="Рівень"
                error={errors.level?.message}
              >
                <Select
                  id="level"
                  error={!!errors.level}
                  {...register('level')}
                >
                  {LEVEL_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>

            {/* Textbook — shown only if subject has textbook options */}
            {textbookOptions.length > 0 && (
              <FormField
                id="textbook"
                label="Підручник"
                error={errors.textbook?.message}
              >
                <Select
                  id="textbook"
                  error={!!errors.textbook}
                  {...register('textbook')}
                >
                  <option value="">
                    Загальна програма (без контексту підручника)
                  </option>
                  {textbookOptions.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </FormField>
            )}

            <FormField
              id="teacherNotes"
              label="Примітки для AI (необов'язково)"
              error={errors.teacherNotes?.message}
            >
              <Textarea
                id="teacherNotes"
                placeholder="Наприклад: клас сильний, потребує складніших завдань..."
                rows={3}
                error={!!errors.teacherNotes}
                {...register('teacherNotes')}
              />
            </FormField>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="secondary" size="sm" type="button" onClick={onClose}>
            Скасувати
          </Button>
          <Button type="submit" size="sm" loading={isSubmitting}>
            {isEdit ? 'Зберегти' : 'Створити'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
