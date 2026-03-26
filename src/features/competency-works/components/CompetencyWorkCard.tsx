import { Link } from 'react-router-dom';
import { Card } from '../../../shared/components/ui/Card';
import type { CompetencyWork } from '../../../shared/types';
import { OUTCOME_GROUP_SHORT } from '../../../shared/types';

interface CompetencyWorkCardProps {
  work: CompetencyWork;
}

export function CompetencyWorkCard({ work }: CompetencyWorkCardProps) {
  const isRegeneration = !!work.parentId;

  const date = new Date(work.createdAt).toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Show time for regenerated works to distinguish versions
  const time = isRegeneration
    ? new Date(work.createdAt).toLocaleTimeString('uk-UA', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  const grLabel = OUTCOME_GROUP_SHORT[work.outcomeGroup] ?? work.outcomeGroup;

  return (
    <Link to={`/competency-works/${work.id}`} className="no-underline group">
      <Card className="flex items-center gap-4 px-5 py-4 transition-all duration-150 group-hover:border-chalk-accent group-hover:shadow-[0_2px_12px_rgba(200,169,110,0.12)]">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[18px] shrink-0 bg-[rgba(200,169,110,0.1)] text-chalk-accent">
          {isRegeneration ? '🔄' : '◈'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-[15px] font-medium text-chalk-header truncate">
              {work.topic}
            </p>
            {isRegeneration && (
              <span className="shrink-0 text-[11px] font-medium px-1.5 py-0.5 rounded bg-[rgba(200,169,110,0.15)] text-chalk-accent">
                Перегенерація
              </span>
            )}
          </div>
          <p className="text-[13px] text-chalk-muted">
            {work.class?.name} · {grLabel} · {date}
            {time && ` · ${time}`}
          </p>
        </div>

        <span className="text-chalk-muted text-lg shrink-0 transition-transform duration-150 group-hover:translate-x-0.5">
          →
        </span>
      </Card>
    </Link>
  );
}
