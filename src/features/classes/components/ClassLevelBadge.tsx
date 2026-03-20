import { cn } from '../../../shared/lib/cn';
import type { ClassLevel } from '../../../shared/types';

const CONFIG: Record<ClassLevel, { label: string; className: string }> = {
  standard: {
    label: 'Стандартний',
    className: 'bg-[rgba(200,169,110,0.1)] text-chalk-accent',
  },
  advanced: {
    label: 'Поглиблений',
    className: 'bg-[rgba(94,134,172,0.12)] text-[#5E86AC]',
  },
  support: {
    label: 'Підтримка',
    className: 'bg-[rgba(172,135,94,0.12)] text-[#AC875E]',
  },
};

interface ClassLevelBadgeProps {
  level: ClassLevel;
}

export function ClassLevelBadge({ level }: ClassLevelBadgeProps) {
  const { label, className } = CONFIG[level];

  return (
    <span
      className={cn(
        'inline-flex px-2 py-0.5 rounded-md text-[12px] font-medium',
        className,
      )}
    >
      {label}
    </span>
  );
}
