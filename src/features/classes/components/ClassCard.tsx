import { Link } from 'react-router-dom';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { ClassLevelBadge } from './ClassLevelBadge';
import type { ClassEntity } from '../../../shared/types';

interface ClassCardProps {
  classEntity: ClassEntity;
  onEdit: (classEntity: ClassEntity) => void;
  onDelete: (classEntity: ClassEntity) => void;
}

export function ClassCard({ classEntity, onEdit, onDelete }: ClassCardProps) {
  const { id, name, grade, subject, academicYear, level, teacherNotes } =
    classEntity;

  return (
    <Card className="flex flex-col px-5 py-4">
      <div className="flex items-center gap-2.5 mb-1.5">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-chalk-header">
          {name}
        </h3>
        <ClassLevelBadge level={level} />
      </div>

      <p className="text-[13px] text-chalk-muted mb-3">
        {subject.name} · {grade} клас · {academicYear}
      </p>

      {teacherNotes && (
        <p className="text-[13px] text-chalk-muted italic mb-3 line-clamp-2">
          {teacherNotes}
        </p>
      )}

      <div className="flex items-center gap-2 mt-auto pt-2 border-t border-chalk-border">
        <Link to={`/classes/${id}/topics`} className="no-underline">
          <Button variant="secondary" size="sm">
            Журнал
          </Button>
        </Link>

        <Button variant="ghost" size="sm" onClick={() => onEdit(classEntity)}>
          Редагувати
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(classEntity)}
          className="text-chalk-error hover:text-chalk-error ml-auto"
        >
          Видалити
        </Button>
      </div>
    </Card>
  );
}
