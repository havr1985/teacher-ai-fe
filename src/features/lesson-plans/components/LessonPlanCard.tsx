import { Link } from 'react-router-dom';
import { Card } from '../../../shared/components/ui/Card';
import type { LessonPlan } from '../../../shared/types';

interface LessonPlanCardProps {
  plan: LessonPlan;
}

export function LessonPlanCard({ plan }: LessonPlanCardProps) {
  const date = new Date(plan.createdAt).toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const isCached = !!plan.cachedAt;

  return (
    <Link to={`/lesson-plans/${plan.id}`} className="no-underline group">
      <Card className="flex items-center gap-4 px-5 py-4 transition-all duration-150 group-hover:border-chalk-accent group-hover:shadow-[0_2px_12px_rgba(200,169,110,0.12)]">
        {/* Icon */}
        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[18px] shrink-0 bg-[rgba(200,169,110,0.1)] text-chalk-accent">
          ✦
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-medium text-chalk-header mb-0.5 truncate">
            {plan.topic}
          </p>
          <p className="text-[13px] text-chalk-muted">
            {plan.classEntity?.name} · {plan.classEntity?.subject?.name} ·{' '}
            {plan.durationMinutes} хв · {date}
            {isCached && ' · ⚡'}
          </p>
        </div>

        {/* Arrow */}
        <span className="text-chalk-muted text-lg shrink-0 transition-transform duration-150 group-hover:translate-x-0.5">
          →
        </span>
      </Card>
    </Link>
  );
}
